import { useState } from "react";
import { motion } from "framer-motion";
import DreamForm from "@/components/DreamForm";
import DreamInterpretation from "@/components/DreamInterpretation";
import LoadingDream from "@/components/LoadingDream";
import DreamHistory from "@/components/DreamHistory";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DreamEntry {
  dream: string;
  interpretation: string;
  date: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDream, setCurrentDream] = useState<DreamEntry | null>(null);
  const [history, setHistory] = useState<DreamEntry[]>([]);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(!localStorage.getItem('OPENAI_API_KEY'));
  const { toast } = useToast();

  const analyzeDream = async (dreamText: string) => {
    const apiKey = localStorage.getItem('OPENAI_API_KEY');
    
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: 'system',
              content: 'You are a wise dream interpreter. Analyze dreams by considering symbolism, emotions, and potential meanings. Be insightful but concise. Structure your response in clear sections: Symbols, Emotions, and Meaning.'
            },
            {
              role: 'user',
              content: dreamText
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle quota exceeded error specifically
        if (response.status === 429) {
          localStorage.removeItem('OPENAI_API_KEY'); // Clear the invalid API key
          setShowApiKeyDialog(true);
          throw new Error("Your OpenAI API key has exceeded its quota. Please update your API key or check your billing details.");
        }
        
        throw new Error(errorData.error?.message || 'Failed to analyze dream');
      }
      
      const data = await response.json();
      const interpretation = data.choices[0].message.content;
      
      const newDream: DreamEntry = {
        dream: dreamText,
        interpretation,
        date: new Date().toLocaleDateString()
      };
      
      setCurrentDream(newDream);
      setHistory(prev => [newDream, ...prev].slice(0, 5));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze your dream. Please try again.",
        variant: "destructive"
      });
      if (error instanceof Error && error.message.includes('quota')) {
        setShowApiKeyDialog(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const apiKey = formData.get('apiKey') as string;
    
    if (apiKey) {
      localStorage.setItem('OPENAI_API_KEY', apiKey);
      setShowApiKeyDialog(false);
      toast({
        title: "Success",
        description: "API key has been updated successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-4xl mx-auto pt-16 px-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-purple-900 dark:text-purple-100">
          Dream Interpreter
        </h1>
        <p className="text-center mb-12 text-gray-600 dark:text-gray-300">
          Share your dream and receive a deep, meaningful interpretation
        </p>
        
        <DreamForm onSubmit={analyzeDream} isLoading={isLoading} />
        
        {isLoading && <LoadingDream />}
        
        {currentDream && !isLoading && (
          <DreamInterpretation dream={currentDream} />
        )}
        
        {history.length > 0 && !isLoading && (
          <DreamHistory dreams={history} />
        )}

        <AlertDialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
          <AlertDialogContent>
            <form onSubmit={handleApiKeySubmit}>
              <AlertDialogHeader>
                <AlertDialogTitle>Update OpenAI API Key</AlertDialogTitle>
                <AlertDialogDescription>
                  Your current API key has exceeded its quota or is invalid. Please enter a new OpenAI API key to continue using the dream interpretation feature.
                  You can get your API key from the OpenAI website.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <input
                  type="password"
                  name="apiKey"
                  placeholder="Enter your API key"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Update API Key</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
};

export default Index;