import { useState } from "react";
import { motion } from "framer-motion";
import DreamForm from "@/components/DreamForm";
import DreamInterpretation from "@/components/DreamInterpretation";
import LoadingDream from "@/components/LoadingDream";
import DreamHistory from "@/components/DreamHistory";
import { useToast } from "@/components/ui/use-toast";

interface DreamEntry {
  dream: string;
  interpretation: string;
  date: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDream, setCurrentDream] = useState<DreamEntry | null>(null);
  const [history, setHistory] = useState<DreamEntry[]>([]);
  const { toast } = useToast();

  const analyzeDream = async (dreamText: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('PERPLEXITY_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
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

      if (!response.ok) throw new Error('Failed to analyze dream');
      
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
        description: "Failed to analyze your dream. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
      </motion.div>
    </div>
  );
};

export default Index;