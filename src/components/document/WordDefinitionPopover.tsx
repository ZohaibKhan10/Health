
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WordDefinitionPopoverProps {
  word: string;
  x: number;
  y: number;
  onClose: () => void;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface DictionaryResponse {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Definition[];
  }>;
}

const WordDefinitionPopover = ({ word, x, y, onClose }: WordDefinitionPopoverProps) => {
  const [definition, setDefinition] = useState<DictionaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
          throw new Error('Definition not found');
        }
        
        const data = await response.json();
        if (data && data.length > 0) {
          setDefinition(data[0]);
        } else {
          setError('No definition found');
        }
      } catch (err) {
        setError('No definition found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDefinition();
  }, [word]);
  
  // Get audio pronunciation if available
  const audioUrl = definition?.phonetics?.find(p => p.audio)?.audio || '';
  
  // Play audio pronunciation
  const playPronunciation = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };
  
  return (
    <div 
      className="absolute z-50 bg-popover text-popover-foreground rounded-lg shadow-lg border max-w-xs w-full"
      style={{
        left: `${Math.min(Math.max(x - 150, 0), 320)}px`,
        top: `${y + 10}px`
      }}
    >
      <div className="flex items-center justify-between p-3 border-b">
        <h4 className="font-medium">{word}</h4>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-3">
        {loading ? (
          <div className="p-2 text-sm text-center">Loading definition...</div>
        ) : error ? (
          <div className="p-2 text-sm text-center">{error}</div>
        ) : (
          <div className="space-y-3">
            {/* Pronunciation */}
            {(definition?.phonetic || audioUrl) && (
              <div className="flex items-center gap-2">
                {definition?.phonetic && (
                  <span className="text-sm text-muted-foreground">{definition.phonetic}</span>
                )}
                {audioUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={playPronunciation}
                  >
                    Play
                  </Button>
                )}
              </div>
            )}
            
            {/* Meanings */}
            {definition?.meanings.map((meaning, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm font-medium text-primary">
                  {meaning.partOfSpeech}
                </div>
                
                <ul className="space-y-2">
                  {meaning.definitions.slice(0, 2).map((def, idx) => (
                    <li key={idx} className="text-sm">
                      <span>{def.definition}</span>
                      
                      {def.example && (
                        <div className="text-xs text-muted-foreground mt-1 italic">
                          "{def.example}"
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                
                {/* Synonyms */}
                {meaning.definitions[0]?.synonyms?.length > 0 && (
                  <div className="text-xs">
                    <span className="font-medium">Synonyms: </span>
                    <span className="text-muted-foreground">
                      {meaning.definitions[0].synonyms.slice(0, 3).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordDefinitionPopover;
