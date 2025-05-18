
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from 'react-helmet-async';
import DocumentUploader from '@/components/document/DocumentUploader';
import DocumentViewer from '@/components/document/DocumentViewer';
import DocumentSidebar from '@/components/document/DocumentSidebar';
import { useDocumentStore } from '@/services/documentService';

const DocumentReader = () => {
  const { currentDocument } = useDocumentStore();
  const [readingMode, setReadingMode] = useState<'day' | 'night' | 'sepia'>('day');
  
  return (
    <>
      <Helmet>
        <title>Document Reader | SereniFlow</title>
      </Helmet>
      <div className="container mx-auto p-4 animate-fade-in">
        <h1 className="text-3xl font-serif mb-6">Document Reader</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with document list, bookmarks, etc */}
          <div className="lg:col-span-1">
            <DocumentSidebar />
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
            {currentDocument ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">{currentDocument.name}</h2>
                  
                  <Tabs 
                    value={readingMode} 
                    onValueChange={(value) => setReadingMode(value as 'day' | 'night' | 'sepia')}
                    className="w-fit"
                  >
                    <TabsList>
                      <TabsTrigger value="day">Day</TabsTrigger>
                      <TabsTrigger value="night">Night</TabsTrigger>
                      <TabsTrigger value="sepia">Sepia</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <DocumentViewer 
                  document={currentDocument} 
                  readingMode={readingMode}
                />
              </>
            ) : (
              <DocumentUploader />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentReader;
