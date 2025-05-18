
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, BookOpen } from "lucide-react";
import { useDocumentStore } from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';

const DocumentUploader = () => {
  const { addDocument } = useDocumentStore();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFile = async (file: File) => {
    // Check file type
    const validTypes = ['application/pdf', 'application/epub+zip', 'text/plain'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && 
        !(fileExtension === 'epub' || fileExtension === 'pdf' || fileExtension === 'txt')) {
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Please upload a PDF, EPUB, or TXT file."
      });
      return;
    }
    
    try {
      // Create URL for the file
      const url = URL.createObjectURL(file);
      
      // Add document to store
      addDocument({
        id: `doc_${Date.now()}`,
        name: file.name,
        type: file.type || `application/${fileExtension}`,
        url: url,
        dateAdded: new Date().toISOString(),
        currentPage: 1,
        totalPages: 0,
        bookmarks: [],
        notes: []
      });
      
      toast({
        title: "Document uploaded",
        description: `${file.name} has been added to your library.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your document."
      });
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };
  
  return (
    <div 
      className={`min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-all ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center space-y-6">
        <div className="mx-auto bg-muted rounded-full p-4 w-fit">
          <Upload size={40} className="text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-medium">Upload a document</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Drag and drop a document or click the button below to browse your files.
            Supported formats: PDF, EPUB, and TXT.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <label htmlFor="file-upload">
            <Button className="cursor-pointer">
              <FileText className="mr-2" />
              Browse Files
            </Button>
            <input 
              id="file-upload" 
              type="file" 
              className="hidden"
              accept=".pdf,.epub,.txt,application/pdf,application/epub+zip,text/plain"
              onChange={handleFileChange}
            />
          </label>
          
          <Button variant="outline" onClick={() => {
            // Add a sample document for testing
            addDocument({
              id: `doc_${Date.now()}`,
              name: "Sample Document.txt",
              type: "text/plain",
              url: "sample",
              dateAdded: new Date().toISOString(),
              content: "This is a sample document for testing purposes. You can select this text to look up definitions. Try words like 'serenity', 'mindfulness', or 'meditation'.",
              currentPage: 1,
              totalPages: 1,
              bookmarks: [],
              notes: []
            });
          }}>
            <BookOpen className="mr-2" />
            Try Sample
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
