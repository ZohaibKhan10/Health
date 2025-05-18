
import React, { useState, useEffect, useRef } from 'react';
import { useDocumentStore } from '@/services/documentService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookmarkPlus, BookmarkMinus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WordDefinitionPopover from './WordDefinitionPopover';
import { Document } from '@/types/documents';
import { useToast } from '@/hooks/use-toast';

interface DocumentViewerProps {
  document: Document;
  readingMode: 'day' | 'night' | 'sepia';
}

const DocumentViewer = ({ document, readingMode }: DocumentViewerProps) => {
  const { updateDocumentProgress, toggleBookmark } = useDocumentStore();
  const { toast } = useToast();
  const [searchText, setSearchText] = useState('');
  const [content, setContent] = useState<string>(document.content || '');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{word: string; x: number; y: number} | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  
  // Check if current page is bookmarked
  useEffect(() => {
    const isCurrentPageBookmarked = document.bookmarks?.some(
      bookmark => bookmark.page === document.currentPage
    );
    setIsBookmarked(!!isCurrentPageBookmarked);
  }, [document.bookmarks, document.currentPage]);
  
  // Load document content based on type
  useEffect(() => {
    const loadContent = async () => {
      if (document.content) {
        setContent(document.content);
        return;
      }
      
      // Simple handling for different document types
      if (document.type.includes('text/plain') || document.url === 'sample') {
        try {
          if (document.url !== 'sample') {
            const response = await fetch(document.url);
            const text = await response.text();
            setContent(text);
          }
        } catch (error) {
          console.error("Error loading text document:", error);
          setContent("Error loading document. Please try again.");
        }
      } else if (document.type.includes('pdf')) {
        setContent("PDF viewer would be integrated here. For this demo, we're focusing on text documents.");
      } else if (document.type.includes('epub')) {
        setContent("EPUB viewer would be integrated here. For this demo, we're focusing on text documents.");
      }
    };
    
    loadContent();
    
    // Track reading progress
    const interval = setInterval(() => {
      updateDocumentProgress(document.id);
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [document, updateDocumentProgress]);
  
  // Handle text selection for dictionary lookup
  const handleTextSelection = () => {
    const selection = window.getSelection();
    
    if (selection && selection.toString().trim()) {
      const word = selection.toString().trim();
      
      if (word.length > 0 && /^[a-zA-Z]+$/.test(word)) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Get position for the popover
        const viewerRect = viewerRef.current?.getBoundingClientRect();
        if (viewerRect) {
          setSelectedWord({
            word,
            x: rect.left - viewerRect.left + (rect.width / 2),
            y: rect.bottom - viewerRect.top
          });
        }
      }
    }
  };
  
  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    toggleBookmark(document.id, document.currentPage);
    
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmark added",
      description: isBookmarked 
        ? "This page has been removed from your bookmarks."
        : "This page has been added to your bookmarks."
    });
  };
  
  // Search for text in document
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchText.trim()) return;
    
    // Basic search implementation
    if (content) {
      const lowerContent = content.toLowerCase();
      const lowerSearch = searchText.toLowerCase();
      
      if (lowerContent.includes(lowerSearch)) {
        toast({
          title: "Found matches",
          description: `"${searchText}" was found in the document.`
        });
        
        // In a real implementation, we would highlight matches and scroll to them
      } else {
        toast({
          variant: "destructive",
          title: "No matches found",
          description: `"${searchText}" was not found in the document.`
        });
      }
    }
  };
  
  // Get background color based on reading mode
  const getBackgroundColor = () => {
    switch (readingMode) {
      case 'night':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-[#f5efdc] text-gray-800';
      case 'day':
      default:
        return 'bg-white text-gray-800';
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Search and bookmark controls */}
      <div className="flex items-center space-x-2">
        <form onSubmit={handleSearch} className="flex-1 flex items-center space-x-2">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search in document..."
            className="flex-1"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleBookmarkToggle}
          className={isBookmarked ? "text-primary" : ""}
        >
          {isBookmarked ? <BookmarkMinus className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Document content viewer */}
      <div 
        ref={viewerRef}
        className={`relative border rounded-lg ${getBackgroundColor()} min-h-[600px]`}
      >
        <ScrollArea className="h-[600px] w-full px-6 py-4">
          <div 
            className="prose max-w-none"
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTextSelection}
          >
            {content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </ScrollArea>
        
        {selectedWord && (
          <WordDefinitionPopover
            word={selectedWord.word}
            x={selectedWord.x}
            y={selectedWord.y}
            onClose={() => setSelectedWord(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
