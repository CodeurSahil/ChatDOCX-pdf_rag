import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatInterface from "@/components/ChatInterface";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  uploadedAt: Date;
  file: File;
}

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    // Simulate file upload
    toast({
      title: "Upload successful!",
      description: `${file.name} has been uploaded and is ready for chat.`,
    });

    setUploadedFile({
      name: file.name,
      uploadedAt: new Date(),
      file: file,
    });
  };

  const handleNewChat = () => {
    toast({
      title: "New chat started",
      description: "Your conversation history has been cleared.",
    });
  };

  if (!uploadedFile) {
    return <WelcomeScreen onFileUpload={handleFileUpload} />;
  }

  return (
    <ChatInterface
      fileName={uploadedFile.name}
      uploadedAt={uploadedFile.uploadedAt}
      onNewChat={handleNewChat}
    />
  );
};

export default Index;
