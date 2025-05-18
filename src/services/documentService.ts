
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Document, DocumentNote, DocumentBookmark } from '@/types/documents';

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  addDocument: (document: Document) => void;
  openDocument: (documentId: string) => void;
  deleteDocument: (documentId: string) => void;
  updateDocumentProgress: (documentId: string, page?: number) => void;
  toggleBookmark: (documentId: string, page: number, title?: string) => void;
  addNote: (documentId: string, note: DocumentNote) => void;
  deleteNote: (documentId: string, noteId: string) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [],
      currentDocument: null,
      
      addDocument: (document) => set((state) => {
        const documents = [...state.documents, document];
        return { 
          documents, 
          currentDocument: document 
        };
      }),
      
      openDocument: (documentId) => set((state) => {
        const document = state.documents.find(doc => doc.id === documentId) || null;
        return { currentDocument: document };
      }),
      
      deleteDocument: (documentId) => set((state) => {
        const documents = state.documents.filter(doc => doc.id !== documentId);
        const currentDocument = state.currentDocument && state.currentDocument.id === documentId
          ? null 
          : state.currentDocument;
          
        return { documents, currentDocument };
      }),
      
      updateDocumentProgress: (documentId, page) => set((state) => {
        const documents = state.documents.map(doc => {
          if (doc.id === documentId) {
            return { 
              ...doc, 
              currentPage: page || doc.currentPage 
            };
          }
          return doc;
        });
        
        const currentDocument = state.currentDocument && state.currentDocument.id === documentId
          ? { ...state.currentDocument, currentPage: page || state.currentDocument.currentPage }
          : state.currentDocument;
          
        return { documents, currentDocument };
      }),
      
      toggleBookmark: (documentId, page, title) => set((state) => {
        const documents = state.documents.map(doc => {
          if (doc.id === documentId) {
            // Check if bookmark already exists
            const existingBookmark = doc.bookmarks?.find(b => b.page === page);
            
            if (existingBookmark) {
              // Remove bookmark
              const bookmarks = doc.bookmarks?.filter(b => b.page !== page) || [];
              return { ...doc, bookmarks };
            } else {
              // Add bookmark
              const newBookmark: DocumentBookmark = {
                id: `bm_${Date.now()}`,
                page,
                title: title || `Page ${page}`,
                dateAdded: new Date().toISOString()
              };
              const bookmarks = [...(doc.bookmarks || []), newBookmark];
              return { ...doc, bookmarks };
            }
          }
          return doc;
        });
        
        const currentDocument = state.currentDocument && state.currentDocument.id === documentId
          ? documents.find(doc => doc.id === documentId) || null
          : state.currentDocument;
          
        return { documents, currentDocument };
      }),
      
      addNote: (documentId, note) => set((state) => {
        const documents = state.documents.map(doc => {
          if (doc.id === documentId) {
            const notes = [...(doc.notes || []), note];
            return { ...doc, notes };
          }
          return doc;
        });
        
        const currentDocument = state.currentDocument && state.currentDocument.id === documentId
          ? documents.find(doc => doc.id === documentId) || null
          : state.currentDocument;
          
        return { documents, currentDocument };
      }),
      
      deleteNote: (documentId, noteId) => set((state) => {
        const documents = state.documents.map(doc => {
          if (doc.id === documentId) {
            const notes = doc.notes?.filter(n => n.id !== noteId) || [];
            return { ...doc, notes };
          }
          return doc;
        });
        
        const currentDocument = state.currentDocument && state.currentDocument.id === documentId
          ? documents.find(doc => doc.id === documentId) || null
          : state.currentDocument;
          
        return { documents, currentDocument };
      })
    }),
    {
      name: 'document-store',
    }
  )
);
