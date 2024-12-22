import React, { useState } from "react";
import DreamForm from "@/components/DreamForm";
import DreamInterpretation from "@/components/DreamInterpretation";
import SignUpWall from "@/components/SignUpWall";
import LoadingDream from "@/components/LoadingDream";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [dreamData, setDreamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignUpWall, setShowSignUpWall] = useState(false);
  const [showDreamForm, setShowDreamForm] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDreamSubmit = async (dream: string, emotionBefore: string, useIslamicInterpretation: boolean) => {
    if (!user) {
      setShowSignUpWall(true);
      return;
    }

    setIsLoading(true);
    setShowDreamForm(false);

    try {
      const { data, error } = await supabase.functions.invoke('interpret-dream', {
        body: { dream, emotionBefore, userId: user.id, useIslamicInterpretation },
      });

      if (error) throw error;

      const newDream = {
        id: crypto.randomUUID(),
        dream,
        interpretation: data.interpretation,
        created_at: new Date().toISOString(),
        title: data.title,
        image_url: data.image_url,
        emotion_before: emotionBefore,
        symbolism: data.symbolism,
        emotional_analysis: data.emotional_analysis,
        detailed_interpretation: data.detailed_interpretation
      };

      setDreamData(newDream);

      const { error: dbError } = await supabase
        .from('dreams')
        .insert([{
          ...newDream,
          user_id: user?.id
        }]);

      if (dbError) {
        console.error('Error saving dream:', dbError);
        toast({
          title: "Error",
          description: "Failed to save your dream interpretation.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error interpreting dream:", error);
      toast({
        title: "Error",
        description: "Failed to interpret your dream. Please try again.",
        variant: "destructive",
      });
      setShowDreamForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpComplete = () => {
    setShowSignUpWall(false);
    toast({
      title: "Welcome!",
      description: "You can now start interpreting your dreams.",
    });
  };

  const handleNewDream = () => {
    setDreamData(null);
    setShowDreamForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <img
            src="/lovable-uploads/9d7c542e-59e6-4b50-873b-f6410e5195ed.png"
            alt="Dream Baba"
            className="w-48 h-48 mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-4">
            Welcome to Dream Baba
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your personal dream interpreter powered by AI
          </p>
        </div>

        <AnimatePresence mode="wait">
          {showDreamForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DreamForm onSubmit={handleDreamSubmit} isLoading={isLoading} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {showSignUpWall && (
          <SignUpWall onComplete={handleSignUpComplete} />
        )}
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingDream />
            </motion.div>
          ) : dreamData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DreamInterpretation dream={dreamData} />
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleNewDream}
                  className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                  <PenSquare className="w-4 h-4" />
                  Interpret Another Dream
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;