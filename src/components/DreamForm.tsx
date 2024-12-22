import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import NoNamePrompt from "./dream/NoNamePrompt";
import EmotionSelector from "./dream/EmotionSelector";

interface DreamFormProps {
  onSubmit: (dream: string, emotionBefore: string) => void;
  isLoading: boolean;
}

const DreamForm = ({ onSubmit, isLoading }: DreamFormProps) => {
  const [dream, setDream] = useState("");
  const [emotionBefore, setEmotionBefore] = useState("");
  const [userName, setUserName] = useState<string>("");
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
        }
      }
    };

    fetchUserName();
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim() && emotionBefore) {
      onSubmit(dream, emotionBefore);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {user && !userName && <NoNamePrompt />}
      
      <div className="space-y-4">
        <Label htmlFor="dream" className="text-lg">
          Tell me about your dream
        </Label>
        <Textarea
          id="dream"
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Share the details of your dream..."
          className="min-h-[200px] mb-4 p-4 text-lg"
          disabled={isLoading}
        />
      </div>

      <EmotionSelector 
        value={emotionBefore}
        onChange={setEmotionBefore}
      />

      <Button
        type="submit"
        disabled={isLoading || !dream.trim() || !emotionBefore}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isLoading ? 
          "Interpreting..." : 
          userName ? 
            `Let me interpret your dream, ${userName}` : 
            "Interpret Dream"
        }
      </Button>
    </motion.form>
  );
};

export default DreamForm;