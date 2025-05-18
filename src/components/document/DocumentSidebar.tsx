
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocumentStore } from '@/services/documentService';
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { Bookmark, Clock, FileText, FileMinus, NotebookPen } from "lucide-react";
import NoteEditor from './NoteEditor';
import { useToast } from '@/hooks/use-toast';

const DocumentSidebar = () => {
  const { documents, currentDocument, openDocument, deleteDocument } = useDocumentStore();
  const { toast } = useToast();
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  
  // Sort documents by date added (most recent first)
  const recentDocuments = [...documents].sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );
  
  // Get bookmarks for current document
  const currentBookmarks = currentDocument?.bookmarks || [];
  
  // Handle document deletion
  const handleDeleteDocument = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    deleteDocument(id);
    toast({
      title: "Document removed",
      description: "The document has been removed from your library."
    });
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Library</h2>
      
      <Tabs defaultValue="recent">
        <TabsList className="w-full">
          <TabsTrigger value="recent" className="flex-1">
            <Clock className="w-4 h-4 mr-2" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex-1">
            <Bookmark className="w-4 h-4 mr-2" />
            Bookmarks
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex-1">
            <NotebookPen className="w-4 h-4 mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>
        
        {/* Recent documents tab */}
        <TabsContent value="recent" className="h-[500px]">
          <ScrollArea className="h-full">
            {recentDocuments.length > 0 ? (
              <div className="space-y-2">
                {recentDocuments.map((doc) => (
                  <Card 
                    key={doc.id}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      currentDocument?.id === doc.id ? 'border-primary' : ''
                    }`}
                    onClick={() => openDocument(doc.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <h4 className="font-medium text-sm line-clamp-1">{doc.name}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(doc.dateAdded), { addSuffix: true })}
                          </p>
                          {doc.currentPage > 1 && (
                            <p className="text-xs text-muted-foreground">
                              Page {doc.currentPage}{doc.totalPages > 0 ? ` of ${doc.totalPages}` : ''}
                            </p>
                          )}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => handleDeleteDocument(doc.id, e)}
                        >
                          <FileMinus className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium">No documents yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload a document to start reading
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        {/* Bookmarks tab */}
        <TabsContent value="bookmarks" className="h-[500px]">
          <ScrollArea className="h-full">
            {currentDocument && currentBookmarks.length > 0 ? (
              <div className="space-y-2">
                {currentBookmarks.map((bookmark) => (
                  <Card 
                    key={bookmark.id} 
                    className="cursor-pointer transition-colors hover:bg-accent"
                  >
                    <CardContent className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Bookmark className="h-4 w-4 mr-2 text-primary" />
                          <h4 className="font-medium text-sm">{bookmark.title || `Page ${bookmark.page}`}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(bookmark.dateAdded), { addSuffix: true })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Bookmark className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium">No bookmarks yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentDocument 
                    ? "Bookmark pages to save your reading position"
                    : "Open a document to bookmark pages"}
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        {/* Notes tab */}
        <TabsContent value="notes" className="h-[500px]">
          <div className="flex justify-end mb-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsNoteEditorOpen(true)}
              disabled={!currentDocument}
            >
              <NotebookPen className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
          
          <ScrollArea className="h-[460px]">
            {currentDocument && currentDocument.notes && currentDocument.notes.length > 0 ? (
              <div className="space-y-2">
                {currentDocument.notes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{note.title || "Note"}</h4>
                          <p className="text-xs text-muted-foreground">
                            Page {note.page}
                          </p>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(note.dateAdded), { addSuffix: true })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <NotebookPen className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium">No notes yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentDocument 
                    ? "Add notes to remember important information"
                    : "Open a document to add notes"}
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {isNoteEditorOpen && currentDocument && (
        <NoteEditor 
          documentId={currentDocument.id} 
          currentPage={currentDocument.currentPage}
          onClose={() => setIsNoteEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default DocumentSidebar;
