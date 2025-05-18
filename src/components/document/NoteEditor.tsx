
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDocumentStore } from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';

interface NoteEditorProps {
  documentId: string;
  currentPage: number;
  onClose: () => void;
}

const NoteEditor = ({ documentId, currentPage, onClose }: NoteEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { addNote } = useDocumentStore();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Note cannot be empty",
        description: "Please add some content to your note."
      });
      return;
    }
    
    addNote(documentId, {
      id: `note_${Date.now()}`,
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      page: currentPage,
      dateAdded: new Date().toISOString()
    });
    
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully."
    });
    
    onClose();
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditor;
