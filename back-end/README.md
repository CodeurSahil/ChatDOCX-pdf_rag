# 🧩 **ChatDOCX Backend Guide**

> The backend handles file uploads, RAG processing, and API endpoints for user interaction.

The ChatDOCX backend is a Flask-based API that processes documents, manages vector storage, and provides intelligent chat responses using RAG (Retrieval-Augmented Generation) technology.

## 🏗️ **Core Architecture**

The backend is built around `main.py` which provides three main endpoints:

### **📤 `/upload`** — Document Processing
- Handles PDF/DOCX file uploads
- Splits documents into chunks using LangChain
- Creates embeddings using Google's Gemini embeddings
- Stores vectors in Qdrant database
- Returns document metadata and welcome message

### **💬 `/chat`** — AI Conversations  
- Processes user queries with conversation history
- Retrieves relevant document chunks from Qdrant
- Sends context to Google Gemini AI for responses
- Returns formatted markdown responses

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

### **Dependencies**
- **Flask** — Web framework
- **LangChain** — Document processing and embeddings
- **Qdrant** — Vector database
- **Google Gemini** — AI model for chat and embeddings
- **OpenAI Client** — Compatible API for Gemini

## 🔧 **Key Functions**

### **`interactWithLLM()`**
Handles AI conversations using Google Gemini with OpenAI-compatible API:
```python
def interactWithLLM(system_prompt, conversation_history_with_new_input):
    # Uses OpenAI client with Gemini endpoint
    # Returns formatted AI responses
```

### **`create_retriever()`**
Creates document retrievers from Qdrant collections:
```python
def create_retriever(collection_name=None):
    # Connects to existing Qdrant collection
    # Returns LangChain retriever for document search
```

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