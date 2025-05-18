import { toast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

// API key management
const STORAGE_KEY = "coach_api_key";

export const getApiKey = (): string | null => localStorage.getItem(STORAGE_KEY);
export const saveApiKey = (apiKey: string): void => localStorage.setItem(STORAGE_KEY, apiKey);
export const clearApiKey = (): void => localStorage.removeItem(STORAGE_KEY);

// A set of predefined Q&A pairs with accents and variants
const predefinedAnswers: Record<string, string> = {
  "hi":"hi dear , how can i assist you today",
  "hello": "Hey there! How can I support your wellness today?",
  
};

// Send message to Gemini AI API and get response (or return predefined answer)
export const sendMessageToCoach = async (
  message: string,
  history: ChatMessage[]
): Promise<ChatMessage | null> => {
  const normalized = message.trim().toLowerCase();
  for (const [question, answer] of Object.entries(predefinedAnswers)) {
    if (normalized.includes(question)) {
      return {
        id: Date.now().toString(),
        content: answer,
        sender: "assistant",
        timestamp: new Date(),
      };
    }
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    toast({ title: "API Key Missing", description: "Please add your Gemini API key in settings", variant: "destructive" });
    return null;
  }

  try {
    const parts = [
      { text: "You are a helpful wellness coach. Provide supportive, positive advice about mental health, fitness, nutrition, and general well-being. Keep responses concise and encouraging. Do not provide medical diagnoses or treatment plans." },
      ...history.map((msg) => ({ text: msg.content })),
      { text: message }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, candidateCount: 1 }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      id: Date.now().toString(),
      content: aiText,
      sender: "assistant",
      timestamp: new Date(),
    };
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to get response from coach", variant: "destructive" });
    return null;
  }
};
