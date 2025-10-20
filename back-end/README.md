# 🧩 **ChatDOCX Backend Guide**

> The backend handles file uploads, advanced RAG processing with Query Translation and RAG Fusion, and API endpoints for user interaction.

The ChatDOCX backend is a Flask-based API that processes documents, manages vector storage, and provides intelligent chat responses using advanced RAG (Retrieval-Augmented Generation) technology with **Query Translation** and **RAG Fusion** capabilities.

## 🏗️ **Core Architecture**

The backend is built around `main.py` which provides three main endpoints:

### **📤 `/upload`** — Document Processing
- Handles PDF/DOCX file uploads
- Splits documents into chunks using LangChain
- Creates embeddings using Google's Gemini embeddings
- Stores vectors in Qdrant database
- Returns document metadata and welcome message

### **💬 `/chat`** — Advanced AI Conversations  
- **Query Translation**: Transforms user queries into multiple related queries
- **RAG Fusion**: Parallel retrieval using multiple query variations
- **Multi-Query Processing**: Combines results from original + transformed queries
- Retrieves relevant document chunks from Qdrant using enhanced search
- Sends enriched context to Google Gemini AI for responses
- Returns formatted markdown responses with improved accuracy

### **🗑️ `/delete_session`** — Session Management
- Clears Qdrant collections for new conversations
- Manages document session lifecycle

## 🚀 **Setup Steps**

### 1. **Create Python Environment**
```bash
cd back-end
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

### 3. **Configure Environment**
Create a `.env` file:
```env
QDRANT_URL=http://localhost:6333
GOOGLE_API_KEY=your_google_api_key_here
```

### 4. **Start Qdrant Database**
```bash
docker run -p 6333:6333 qdrant/qdrant
```

### 5. **Run the Server**
```bash
python main.py
```
*Server runs on `http://localhost:3000`*

## 🔄 **API Flow Example**

```bash
# 1. Upload a document
curl -X POST -F "file=@document.pdf" http://localhost:3000/upload

# 2. Chat with the document
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "content": [{"role": "user", "content": "What is this document about?"}],
    "collection_name": "your-collection-uuid"
  }'

# 3. Clear session when done
curl -X POST http://localhost:3000/delete_session \
  -H "Content-Type: application/json" \
  -d '{"collection_name": "your-collection-uuid"}'
```

## ⚙️ **Configuration**

### **Environment Variables**
- `QDRANT_URL`: Qdrant server URL (default: http://localhost:6333)
- `GOOGLE_API_KEY`: Google AI API key for embeddings and chat
- `OPENAI_API_KEY`: OpenAI API key for enhanced embeddings

### **Dependencies**
- **Flask** — Web framework
- **LangChain** — Document processing and embeddings
- **Qdrant** — Vector database
- **Google Gemini** — AI model for chat and embeddings
- **OpenAI Client** — Compatible API for Gemini
- **OpenAI Embeddings** — Enhanced text embeddings (text-embedding-3-small)

## 🔧 **Key Functions**

### **`interactWithLLM()`**
Handles AI conversations using Google Gemini with OpenAI-compatible API:
```python
def interactWithLLM(system_prompt, conversation_history_with_new_input):
    # Uses OpenAI client with Gemini endpoint
    # Returns formatted AI responses
```

### **`query_transformer()`** 🆕
**Advanced Query Translation** - Transforms user queries into multiple related queries:
```python
def query_transformer(query):
    # Generates 3 additional related queries
    # Uses AI to create semantic variations
    # Returns list of enhanced queries for better retrieval
```

### **`create_retriever()`**
Creates document retrievers from Qdrant collections:
```python
def create_retriever(collection_name=None):
    # Connects to existing Qdrant collection
    # Returns LangChain retriever for document search
```

## 🚀 **Advanced RAG Features**

### **🔄 Query Translation Process**
1. **Input**: User's original query
2. **AI Transformation**: Generates 3 semantically related queries
3. **Parallel Processing**: All queries processed simultaneously
4. **Enhanced Retrieval**: Combines results from all query variations

### **🔀 RAG Fusion Implementation**
- **Multi-Query Retrieval**: Searches with original + 3 transformed queries
- **Result Aggregation**: Combines relevant documents from all searches
- **Improved Context**: Enriches context with diverse document perspectives
- **Better Accuracy**: Reduces missed relevant information

## 🛡️ **Error Handling**

The API includes comprehensive error handling for:
- Missing or invalid files
- Unsupported file types (only PDF/DOCX)
- Vector store connection issues
- Document processing failures
- Chat generation errors

All errors return appropriate HTTP status codes and descriptive messages.

## 📊 **Response Format**

### **Upload Response**
```json
{
  "success": true,
  "message": "Welcome message in markdown",
  "collection_name": "uuid-for-session"
}
```

### **Chat Response**
```json
{
  "success": true,
  "query": "User question",
  "response": "AI response in markdown",
  "sources_count": 3
}
```

---

**Ready to process documents and chat! 🚀**