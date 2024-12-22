import { useState } from "react";
import { motion } from "framer-motion";
import DreamForm from "@/components/DreamForm";
import DreamInterpretation from "@/components/DreamInterpretation";
import LoadingDream from "@/components/LoadingDream";
import DreamHistory from "@/components/DreamHistory";
import { useToast } from "@/hooks/use-toast";
import SignUpWall from "@/components/SignUpWall";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface DreamEntry {
  dream: string;
  interpretation: string;
  date: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDream, setCurrentDream] = useState<DreamEntry | null>(null);
  const [history, setHistory] = useState<DreamEntry[]>([]);
  const [showSignUpWall, setShowSignUpWall] = useState(false);
  const [pendingDream, setPendingDream] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const analyzeDream = async (dreamText: string) => {
    if (!user) {
      setPendingDream(dreamText);
      setShowSignUpWall(true);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('interpret-dream', {
        body: { dream: dreamText }
      });

      if (error) throw error;

      const newDream: DreamEntry = {
        dream: dreamText,
        interpretation: data.interpretation,
        date: new Date().toLocaleDateString()
      };
      
      const { error: saveError } = await supabase
        .from('dreams')
        .insert([{
          user_id: user.id,
          dream: dreamText,
          interpretation: data.interpretation,
          created_at: new Date().toISOString()
        }]);

      if (saveError) throw saveError;
      
      setCurrentDream(newDream);
      setHistory(prev => [newDream, ...prev].slice(0, 5));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze your dream. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpComplete = async () => {
    setShowSignUpWall(false);
    if (pendingDream) {
      await analyzeDream(pendingDream);
      setPendingDream(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-4xl mx-auto pt-16 px-4 relative"
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

        {showSignUpWall && (
          <SignUpWall onComplete={handleSignUpComplete} />
        )}
      </motion.div>
    </div>
  );
};

export default Index;