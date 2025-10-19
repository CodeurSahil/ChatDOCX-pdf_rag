from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from openai import OpenAI
from dotenv import load_dotenv
import traceback
from qdrant_client import QdrantClient
import uuid

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
QDRANT_URL = os.getenv("QDRANT_URL")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Initialize embeddings
embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=GOOGLE_API_KEY
)

# Initialize text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

def format_docs(docs):
    """Format documents for the prompt"""
    return "\n\n".join(doc.page_content for doc in docs)

def interactWithLLM(system_prompt, conversation_history_with_new_input):
    """
    Interact with LLM using system prompt, conversation history, and new input
    
    Args:
        system_prompt (str): The system message/instruction
        conversation_history (list): List of previous messages in format [{"role": "user/assistant", "content": "..."}]
        new_input (str): The new user input
    
    Returns:
        dict: Response containing the LLM's reply and updated conversation history
    """

    try:
        # Initialize OpenAI client with Gemini endpoint
        client = OpenAI(
            api_key=GOOGLE_API_KEY,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        
        # Prepare messages array
        messages = []
        
        # Add system prompt
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        # Add conversation history
        if conversation_history_with_new_input:
            messages.extend(conversation_history_with_new_input)
        
        # Get response from Gemini using OpenAI-compatible API
        response = client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=messages,
        )
        
        # Extract the response text
        response_text = response.choices[0].message.content

        
        return {
            "success": True,
            "response": response_text
        }
        
    except Exception as e:
        print(f"Error in interactWithLLM: {e}")
        return {
            "success": False,
            "error": str(e),
            "response": None
        }

def create_retriever(collection_name=None):
    """Create a retriever from existing Qdrant collection"""
    try:
        # Use provided collection_name or fall back to global COLLECTION_NAME
        target_collection = collection_name
        
        vector_store = QdrantVectorStore.from_existing_collection(
            url=QDRANT_URL,
            collection_name=target_collection,
            embedding=embeddings
        )

        return vector_store.as_retriever()
    except Exception as e:
        print(f"Error creating retriever: {e}")
        return None

@app.route('/upload', methods=['POST'])
def upload_document():
    """Upload PDF or DOCX file and store in Qdrant vector store"""
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file extension
        filename = file.filename.lower()
        if not (filename.endswith('.pdf') or filename.endswith('.docx')):
            return jsonify({'error': 'Only PDF and DOCX files are supported'}), 400

        
        # Generate UUID for collection name
        collection_uuid = str(uuid.uuid4())
        COLLECTION_NAME = collection_uuid

        print("COLLECTION_NAME", COLLECTION_NAME)

        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(filename).suffix) as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name
        
        try:
            # Load document based on file type
            if filename.endswith('.pdf'):
                loader = PyPDFLoader(file_path=temp_path)
            else:  # .docx
                loader = Docx2txtLoader(file_path=temp_path)
            
            docs = loader.load()
            
            # Split documents into chunks
            split_docs = text_splitter.split_documents(documents=docs)
            
            # Create or update vector store
            vector_store = QdrantVectorStore.from_documents(
                documents=split_docs,
                url=QDRANT_URL,
                collection_name=COLLECTION_NAME,
                embedding=embeddings
            )

            system_prompt = '''
                You are an **AI Agent (RAG)** named **ChatDOCX**, designed to respond **only** based on the provided document context.

                I will provide the **first two pages** of a document, and you must respond using that context.

                Your response should be **short, polite, and friendly**, not exceeding **100 words**.
                This will serve as the **starting message** of the conversation.

                You must return your response in **Markdown (.md)** format and use **bold**, *italics*, and other styling to make it engaging and visually appealing.

                ---

                ### **Response Format (Markdown):**

                👋 **Hi there, welcome to _ChatDOCX_!**

                From what I’ve gathered so far, this document seems to be about **[Topic / Subject]**.  
                It provides insights into *[1–2 short lines summarizing what it covers]*.  

                Would you like me to dive deeper into a particular section, or give you a quick overview first?
            '''

            conversation_history_with_new_input = [
                {
                    "role": "user",
                    "content": f"{system_prompt}\n\nContext: {format_docs(split_docs[:2])}"
                }
            ]

            result = interactWithLLM(system_prompt, conversation_history_with_new_input)

            if result['success']:
                return jsonify({
                    'success': True,
                    'message': result['response'],
                    'collection_name': collection_uuid
                }), 200
            else:
                return jsonify({'error': result['error']}), 500

        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
    except Exception as e:
        print(f"Error in upload endpoint: {e}")
        print(traceback.format_exc())
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@app.route('/chat', methods=['POST'])
def chat():
    """Chat with the AI agent using the uploaded documents"""
    try:
        data = request.get_json()
        
        # Get conversation history and collection name
        conversation_history = data.get('content', [])
        collection_name = data.get('collection_name')
        
        if not conversation_history:
            return jsonify({'error': 'No conversation history provided'}), 400
        
        if not collection_name:
            return jsonify({'error': 'Collection name is required'}), 400
        
        # Get the latest user message
        latest_message = conversation_history[-1] if conversation_history else None
        if not latest_message or latest_message.get('role') != 'user':
            return jsonify({'error': 'No user message found'}), 400
        
        query = latest_message.get('content', '')
        
        # Create retriever with collection name
        retriever = create_retriever(collection_name)

        if retriever is None:
            return jsonify({'error': 'Vector store not available. Please upload documents first.'}), 500
        
        # Retrieve relevant documents
        relevant_docs = retriever.get_relevant_documents(query)
        
        # Format context from documents
        context = format_docs(relevant_docs)
        
        client = OpenAI(
            api_key=GOOGLE_API_KEY,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )

        system_prompt = '''
            You are an **AI Agent (RAG)** named **ChatDOCX**, designed to respond **only** based on the provided document context.

            I will provide the context of a document, and you must respond using that context.

            Your response should be **short, polite, and friendly**, not exceeding **150-200 words**.

            You must return your response in **Markdown (.md)** format and use **bold**, *italics*, and other styling to make it engaging and visually appealing.

            ---

            **Response Rules:**
                - If the information seems extensive but important, politely ask: **"Would you like to know more about this topic?"**
                - Return the Entire Output in .md format Compatible with 'react-markdown' library
                - All responses must be formatted in **Markdown** to support rendering with "react-markdown".
                - Use appropriate Markdown features for readability and style:
                    - Use "**bold**" for key terms or emphasis.
                    - Use "*italic*" to highlight soft tone or secondary notes.
                    - Use bullet points ("-") or numbered lists when listing information.
                    - Use "###" or "##" for headings if breaking content into sections.
                    - Wrap code or commands in backticks ("likeThis") for clarity.
                    - Use [inline links](https://example.com "_blank") when sharing link's.
                    - In Case of Links Make Sure to Add "_blank", So that on clicking Link opens into a new page
                - Keep responses under 150-200 words unless the user specifically asks for more.
                - Always end with a friendly sentence or follow-up question to keep the conversation going.
                - Add light humor or emoji when appropriate to keep it friendly and engaging (e.g., 😉, 🚀, ✅).
        '''
        
        # Build messages array with system prompt, context, and conversation history
        messages = [
            {"role": "system", "content": f"{system_prompt}\n\nContext: {context}"}
        ]
        
        # Add conversation history
        messages.extend(conversation_history)

        response = client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=messages
        )
        
        response_text = response.choices[0].message.content
        
        return jsonify({
            'success': True,
            'query': query,
            'response': response_text,
            'sources_count': len(relevant_docs)
        }), 200
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        print(traceback.format_exc())
        return jsonify({'error': f'Chat failed: {str(e)}'}), 500

@app.route('/delete_session', methods=['POST'])
def delete_session():
    """Clear the Qdrant collection when starting a new chat"""
    try:
        data = request.get_json()
        collection_name = data.get('collection_name')

        if not collection_name:
            return jsonify({
                'success': False,
                'error': 'Collection name is required'
            }), 400

        TO_BE_DELETED_COLLECTION_NAME = collection_name
        # Initialize Qdrant client
        client = QdrantClient(url=QDRANT_URL)
        
        # Check if collection exists
        collections = client.get_collections()
        collection_names = [col.name for col in collections.collections]
        
        if TO_BE_DELETED_COLLECTION_NAME in collection_names:
            # Delete the collection
            client.delete_collection(collection_name=TO_BE_DELETED_COLLECTION_NAME)
            print(f"Collection '{TO_BE_DELETED_COLLECTION_NAME}' deleted successfully")
            
            return jsonify({
                'success': True,
                'message': f'Collection "{TO_BE_DELETED_COLLECTION_NAME}" cleared successfully'
            }), 200
        else:
            return jsonify({
                'success': True,
                'message': f'Collection "{TO_BE_DELETED_COLLECTION_NAME}" does not exist'
            }), 200
            
    except Exception as e:
        print(f"Error clearing collection: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': f'Failed to clear collection: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("Starting Flask application...")
    print("Available endpoints:")
    print("  POST /upload - Upload PDF/DOCX files")
    print("  POST /chat - Chat with AI agent")
    print("  POST /delete_session - Clear Qdrant collection")
    app.run(debug=True, host='0.0.0.0', port=3000)