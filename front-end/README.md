# 💻 **ChatDOCX Frontend Guide**

> The frontend provides an elegant, dark-themed interface for chatting with uploaded documents.

The ChatDOCX frontend is a modern React application built with TypeScript, featuring a sleek dark theme and smooth animations for an engaging document chat experience.

## 🎨 **Tech Stack**

- ⚛️ **React 18** with TypeScript
- 🎨 **TailwindCSS** for styling
- 🎭 **Framer Motion** for animations
- 🧩 **shadcn/ui** component library
- 📱 **Responsive design** for all devices
- 🎯 **Vite** for fast development

## 🚀 **Setup Steps**

### 1. **Navigate to Frontend Directory**
```bash
cd front-end
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Configure Backend API**
Update the backend API URL in your environment or config:
```env
VITE_API_URL=http://localhost:3000
```

### 4. **Start Development Server**
```bash
npm run dev
```
*Frontend runs on `http://localhost:8080`*

## 🏗️ **Project Structure**

```
front-end/
├── src/
│   ├── components/           # React components
│   │   ├── ChatInterface.tsx    # Main chat interface
│   │   ├── ChatHeader.tsx       # Chat header with controls
│   │   ├── ChatInput.tsx        # Message input component
│   │   ├── MessageBubble.tsx   # Individual message display
│   │   ├── WelcomeScreen.tsx   # Initial upload screen
│   │   └── ui/                 # shadcn/ui components
│   ├── pages/                # Page components
│   │   ├── Index.tsx            # Main page
│   │   └── NotFound.tsx         # 404 page
│   ├── utils/                # Utility functions
│   │   └── api.ts              # API communication
│   └── hooks/                 # Custom React hooks
```

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000
```

### **API Integration**
The frontend communicates with the backend through:
- **File Upload**: `POST /upload`
- **Chat Messages**: `POST /chat`
- **Session Management**: `POST /delete_session`

## 🚀 **Development Commands**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 **Features**

- 📄 **File Upload** — Drag-and-drop PDF/DOCX files
- 💬 **Real-time Chat** — Instant AI responses
- 🎨 **Markdown Support** — Rich text formatting
- 📱 **Mobile Responsive** — Works on all devices
- 🌙 **Dark Theme** — Easy on the eyes
- ⚡ **Fast Performance** — Optimized React components

---

**Ready to build beautiful document chats! 🎨**