# 🧠 **ChatDOCX** — Talk to Your Documents Seamlessly

> *ChatDOCX — Talk to Your Documents Seamlessly using RAG-based AI.*

ChatDOCX is an intelligent document chat application that allows you to upload PDF and DOCX files and have natural conversations with them using advanced RAG (Retrieval-Augmented Generation) technology.

## ✨ **Features**

- 📄 **Upload & Chat** with PDF and DOCX files
- 🧠 **Context-aware responses** powered by RAG
- 🎨 **Modern UI** with dark theme and smooth animations
- 🚀 **RAG-powered backend** with intelligent document processing
- 💬 **Natural conversations** with your documents
- 🔄 **Session management** for multiple document chats

## 🚀 **Quick Start**

### 1. **Clone the Repository**
```bash
git clone <your-repo-url>
cd pdf_reader_rag
```

### 2. **Backend Setup**
```bash
cd back-end
pip install -r requirements.txt
python main.py
```
*Backend runs on `http://localhost:3000`*

### 3. **Frontend Setup**
```bash
cd front-end
npm install
npm run dev
```
*Frontend runs on `http://localhost:8080`*

### 4. **Start Chatting**
- Open your browser to `http://localhost:8080`
- Upload a PDF or DOCX file
- Start chatting with your document!

## 🛠️ **Tech Stack**

### **Frontend**
- ⚛️ **React** with TypeScript
- 🎨 **TailwindCSS** for styling
- 🎭 **Framer Motion** for animations
- 🧩 **shadcn/ui** components

### **Backend**
- 🐍 **Python Flask** API
- 🧠 **LangChain** for RAG pipeline
- 🔍 **Qdrant** vector database
- 🤖 **Google Gemini** AI model
- 📄 **Document processing** (PDF/DOCX)

### **Database/Storage**
- 🗄️ **Qdrant** vector store for embeddings
- 📁 **Temporary file processing**

## 📚 **Documentation**

- 👉 **[Backend Guide](./back-end/README.md)** — API endpoints, setup, and configuration
- 👉 **[Frontend Guide](./front-end/README.md)** — UI components and development setup

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file in the `back-end` directory:

```env
QDRANT_URL=http://localhost:6333
GOOGLE_API_KEY=your_google_api_key_here
```

### **Qdrant Setup**
Make sure Qdrant is running:
```bash
docker run -p 6333:6333 qdrant/qdrant
```

## 🎯 **How It Works**

1. **Upload** → Upload PDF/DOCX files through the web interface
2. **Process** → Documents are split into chunks and embedded using Google's embeddings
3. **Store** → Chunks are stored in Qdrant vector database
4. **Chat** → When you ask questions, relevant chunks are retrieved and sent to Gemini AI
5. **Respond** → AI generates context-aware responses based on your document content

## 🤝 **Contributing**

We welcome contributions! Please feel free to submit issues and pull requests.

---

**Happy Document Chatting! 🚀**