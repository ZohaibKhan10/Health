
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Send, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "@/components/ui/motion";
import { 
  ChatMessage, 
  sendMessageToCoach, 
  getApiKey, 
  saveApiKey 
} from "@/services/coachService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Hi, I'm your SERENE-FLOW wellness coach. How can I support you today?",
    sender: "assistant",
    timestamp: new Date()
  }
];

const Coach = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key exists when component mounts
    const storedKey = getApiKey();
    if (!storedKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key to use the coach feature",
      });
    }
  }, [toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    
    // Add user message
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    
    // Show typing indicator
    setIsTyping(true);
    
    // Send message to API and get response
    try {
      const aiResponse = await sendMessageToCoach(newUserMessage.content, messages);
      
      setIsTyping(false);
      
      if (aiResponse) {
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      setIsTyping(false);
      console.error("Error sending message to coach:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the wellness coach",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setShowApiDialog(false);
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved successfully",
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="container max-w-4xl mx-auto space-y-6 animate-fade-in relative"
      style={{ 
        backgroundImage: `url('/images/d3aceacc-ff01-444a-91c9-68a5c848485e.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 'calc(100vh - 120px)',
        borderRadius: '1rem',
        padding: '2rem'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 relative flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-serif text-white drop-shadow-lg">Wellness Coach</h1>
          <p className="text-white/80 mt-2 drop-shadow-md">AI wellness companion</p>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          onClick={() => setShowApiDialog(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          API Key
        </Button>
      </motion.div>
      
      <Card 
        className="h-[calc(100vh-240px)] flex flex-col relative overflow-hidden z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 to-green-300"
        >
          <span className="hidden">Gradient bar</span>
        </motion.div>
        
        <CardHeader className="relative z-10 border-b border-white/20">
          <CardTitle className="text-xl text-primary flex items-center">
            <motion.span
              animate={{ 
                scale: [1, 1.03, 1],
                opacity: [0.9, 1, 0.9]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut" 
              }}
              className="mr-2 text-blue-500"
            >
              💬
            </motion.span>
            Chat with your wellness coach
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col overflow-hidden relative z-10 p-6">
          <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
            {messages.map((message) => (
              <motion.div 
                key={message.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === "assistant" && (
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3,
                        ease: "easeInOut" 
                      }}
                    >
                      AI
                    </motion.div>
                  </div>
                )}
                
                <div className="max-w-[70%]">
                  <div 
                    className={`p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary/90 text-primary-foreground backdrop-blur-sm' 
                        : 'bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-gray-600">
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </span>
                    
                    {message.sender === "assistant" && (
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/50">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/50">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {message.sender === "user" && (
                  <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center ml-3 flex-shrink-0">
                    You
                  </div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex mb-4 justify-start"
              >
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                  AI
                </div>
                
                <div className="max-w-[70%]">
                  <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700">
                    <motion.div className="flex space-x-1">
                      <motion.span 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="h-2 w-2 bg-blue-500 rounded-full"
                      ></motion.span>
                      <motion.span 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="h-2 w-2 bg-blue-500 rounded-full"
                      ></motion.span>
                      <motion.span 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="h-2 w-2 bg-blue-500 rounded-full"
                      ></motion.span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-2 mt-auto relative z-10"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-white/70 border-white/30 backdrop-blur-sm focus:border-blue-300 focus:ring-blue-200"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isTyping || !getApiKey()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
      
      {/* API Key Dialog */}
      <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Coach API Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your Google Gemini API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coach;
