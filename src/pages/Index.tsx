import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DreamForm from "@/components/DreamForm";
import DreamInterpretation from "@/components/DreamInterpretation";
import LoadingDream from "@/components/LoadingDream";
import { useToast } from "@/hooks/use-toast";
import SignUpWall from "@/components/SignUpWall";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [isBackgroundSaving, setIsBackgroundSaving] = useState(false);
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

    if (!userName) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile with your name first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: interpretation, error } = await supabase.functions.invoke('interpret-dream', {
        body: { dream: dreamText, userName }
      });

      if (error) throw error;

      // Create a temporary dream entry for immediate display
      const tempDream: DreamEntry = {
        id: 'temp-' + Date.now(),
        dream: dreamText,
        interpretation: interpretation.interpretation,
        symbolism: interpretation.symbolism,
        emotional_analysis: interpretation.emotional_analysis,
        detailed_interpretation: interpretation.detailed_interpretation,
        title: interpretation.title,
        image_url: interpretation.image_url,
        emotion_before: emotionBefore,
        created_at: new Date().toISOString()
      };

      setCurrentDream(tempDream);
      setIsLoading(false);
      setIsBackgroundSaving(true);

      // Save to database in the background
      const { data: savedDream, error: saveError } = await supabase
        .from('dreams')
        .insert([{
          user_id: user.id,
          dream: dreamText,
          interpretation: interpretation.interpretation,
          symbolism: interpretation.symbolism,
          emotional_analysis: interpretation.emotional_analysis,
          detailed_interpretation: interpretation.detailed_interpretation,
          title: interpretation.title,
          image_url: interpretation.image_url,
          emotion_before: emotionBefore,
        }])
        .select()
        .single();

      if (saveError) throw saveError;
      
      // Update the current dream with the saved version (including real ID)
      setCurrentDream(savedDream as DreamEntry);
      setIsBackgroundSaving(false);
      
      toast({
        title: "Dream Interpreted",
        description: "Your dream has been interpreted and saved to your journal.",
      });
    } catch (error) {
      setIsBackgroundSaving(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze your dream. Please try again.",
        variant: "destructive"
      });
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-4xl mx-auto pt-16 px-4 relative"
      >
        <div className="text-center mb-12">
          <img
            src="/lovable-uploads/82a43a54-df6e-4d0d-a305-70c2c6f894e9.png"
            alt="Dream Baba"
            className="w-48 h-48 mx-auto mb-8"
          />
        </div>
        
        <div className="transition-all duration-300">
          {!isLoading && !currentDream && (
            <DreamForm onSubmit={analyzeDream} isLoading={isLoading || isBackgroundSaving} />
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <LoadingDream />
            </motion.div>
          )}
          
          {currentDream && !isLoading && (
            <DreamInterpretation dream={currentDream} />
          )}
        </div>
        
        {showSignUpWall && (
          <SignUpWall onComplete={handleSignUpComplete} />
        )}
      </motion.div>
    </div>
  );
};

export default Index;
