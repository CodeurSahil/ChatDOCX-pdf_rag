import { useEffect, useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatInterface from "@/components/ChatInterface";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/components/types/common";

interface UploadedFile {
  name: string;
  uploadedAt: Date;
  file: File;
  collectionName?: string;
}

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [initialChat, setInitialChat] = useState<ChatMessage>({id: "", text: "", sender: "user", timestamp: new Date()});
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const chatDetails = localStorage.getItem('chat-details');
    console.log("chatDetails", chatDetails);
    if (chatDetails) {
      const uploadedFileDetails: UploadedFile = JSON.parse(chatDetails);
      setUploadedFile(uploadedFileDetails);
    }
  }, []);

  const handleFileUpload = (file: File) => {
    localStorage.removeItem('chat-history');
    setIsUploading(true);

    // Simulate file upload
    const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

    const formData = new FormData();

    formData.append("file", file);

    fetch(`${BACK_END_URL}/upload`, {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        
        toast({
          title: "Upload failed",
          description: data?.error || "An error occurred while uploading.",
          variant: "destructive",
        });
      } else {
        const data = await res.json().catch(() => null);

        setInitialChat({id: Date.now().toString(), text: data?.message, sender: "bot", timestamp: new Date()});

        toast({
          title: "Upload successful!",
          description: `${file.name} has been uploaded and is ready for chat.`,
        });

        const uploadedFileDetails: UploadedFile = {
          name: file.name,
          uploadedAt: new Date(),
          file: file,
          collectionName: data?.collection_name,
        };

        setUploadedFile(uploadedFileDetails);

        localStorage.setItem('chat-details', JSON.stringify(uploadedFileDetails));
      }
    }).catch(() => {
      toast({
        title: "Upload failed",
        description: "Network error occurred while uploading.",
        variant: "destructive",
      });
    }).finally(() => {
      setIsUploading(false);
    });
  };

  const handleNewChat = async () => {
    try {
      // Clear the Qdrant collection
      const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;
      const response = await fetch(`${BACK_END_URL}/delete_session`, {
        method: "POST",
        body: JSON.stringify({ collection_name: uploadedFile?.collectionName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Collection cleared:", data.message);
      } else {
        console.warn("Failed to clear collection, but continuing with new chat");
      }
    } catch (error) {
      console.warn("Error clearing collection:", error);
    }

    // Clear local storage and reset state
    localStorage.removeItem('chat-history');
    localStorage.removeItem('chat-details');
    setUploadedFile(null);
    
    toast({
      title: "New chat started",
      description: "Your conversation history and document data have been cleared.",
    });
  };

  if (!uploadedFile) {
    return <WelcomeScreen onFileUpload={handleFileUpload} isUploading={isUploading} />;
  }

  return (
    <ChatInterface
      fileName={uploadedFile.name}
      uploadedAt={uploadedFile.uploadedAt}
      onNewChat={handleNewChat}
      initialChat={initialChat}
      collectionName={uploadedFile.collectionName}
    />
  );
};

export default Index;
