import { useState } from "react";
import { motion } from "framer-motion";
import DreamForm from "@/components/DreamForm";
import DreamInterpretation from "@/components/DreamInterpretation";
import LoadingDream from "@/components/LoadingDream";
import DreamHistory from "@/components/DreamHistory";
import { useToast } from "@/hooks/use-toast";
import { Key } from "lucide-react";
import SignUpWall from "@/components/SignUpWall";
import { useAuth } from "@/contexts/AuthContext";
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
import { supabase } from "@/lib/supabase";

interface DreamEntry {
  dream: string;
  interpretation: string;
  date: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDream, setCurrentDream] = useState<DreamEntry | null>(null);
  const [history, setHistory] = useState<DreamEntry[]>([]);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
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
      // Call your backend endpoint that handles the OpenAI API call
      const { data, error } = await supabase.functions.invoke('interpret-dream', {
        body: { dream: dreamText }
      });

      if (error) throw error;

      const newDream: DreamEntry = {
        dream: dreamText,
        interpretation: data.interpretation,
        date: new Date().toLocaleDateString()
      };
      
      // Save dream to Supabase
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
        {/* API Key Button */}
        <button
          onClick={() => setShowApiKeyDialog(true)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Update API Key"
        >
          <Key className="w-6 h-6" />
        </button>

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

        <AlertDialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
          <AlertDialogContent>
            <form onSubmit={handleApiKeySubmit}>
              <AlertDialogHeader>
                <AlertDialogTitle>Enter OpenAI API Key</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>Please enter a valid OpenAI API key to use the dream interpretation feature.</p>
                  <p>You can get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline">OpenAI website</a>.</p>
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