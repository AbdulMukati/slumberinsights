import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DreamForm from "@/components/DreamForm";
import DreamInterpretation from "@/components/DreamInterpretation";
import LoadingDream from "@/components/LoadingDream";
import { useToast } from "@/hooks/use-toast";
import SignUpWall from "@/components/SignUpWall";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AuthButton from "@/components/AuthButton";

interface DreamEntry {
  id: string;
  dream: string;
  interpretation: string;
  symbolism: string;
  emotional_analysis: string;
  detailed_interpretation: string;
  created_at: string;
  title: string;
  image_url?: string;
  emotion_before?: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDream, setCurrentDream] = useState<DreamEntry | null>(null);
  const [showSignUpWall, setShowSignUpWall] = useState(false);
  const [pendingDream, setPendingDream] = useState<{text: string, emotion: string} | null>(null);
  const [userName, setUserName] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();
        
        if (data && !error) {
          setUserName(data.full_name);
        } else if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Could not fetch user profile",
            variant: "destructive"
          });
        }
      }
    };

    fetchUserName();
  }, [user, toast]);

  const analyzeDream = async (dreamText: string, emotionBefore: string) => {
    if (!user) {
      setPendingDream({ text: dreamText, emotion: emotionBefore });
      setShowSignUpWall(true);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('interpret-dream', {
        body: { dream: dreamText, userName }
      });

      if (error) throw error;

      const { data: savedDream, error: saveError } = await supabase
        .from('dreams')
        .insert([{
          user_id: user.id,
          dream: dreamText,
          interpretation: data.interpretation,
          symbolism: data.symbolism,
          emotional_analysis: data.emotional_analysis,
          detailed_interpretation: data.detailed_interpretation,
          title: data.title,
          image_url: data.image_url,
          emotion_before: emotionBefore,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (saveError) throw saveError;
      
      setCurrentDream(savedDream as DreamEntry);
      toast({
        title: "Dream Interpreted",
        description: "Your dream has been interpreted and saved to your journal.",
      });
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
      await analyzeDream(pendingDream.text, pendingDream.emotion);
      setPendingDream(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      <AuthButton />
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
        
        {showSignUpWall && (
          <SignUpWall onComplete={handleSignUpComplete} />
        )}
      </motion.div>
    </div>
  );
};

export default Index;