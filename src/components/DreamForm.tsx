import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface DreamFormProps {
  onSubmit: (dream: string, emotionBefore: string) => void;
  isLoading: boolean;
}

const EMOTIONS = [
  { value: "😊", label: "Happy" },
  { value: "😌", label: "Calm" },
  { value: "😕", label: "Confused" },
  { value: "😨", label: "Anxious" },
  { value: "😢", label: "Sad" },
];

const DreamForm = ({ onSubmit, isLoading }: DreamFormProps) => {
  const [dream, setDream] = useState("");
  const [emotionBefore, setEmotionBefore] = useState("");
  const [userName, setUserName] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

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

  const NoNamePrompt = () => (
    <div className="text-center mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        To make your dream interpretation more personal, please{" "}
        <Link to="/profile" className="text-blue-600 dark:text-blue-400 hover:underline">
          add your name to your profile
        </Link>
        .
      </p>
    </div>
  );

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
          {userName ? "Tell me about your dream" : "Describe your dream"}
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

      <div className="space-y-4">
        <Label className="text-lg">
          How are you feeling about this dream?
        </Label>
        <RadioGroup
          value={emotionBefore}
          onValueChange={setEmotionBefore}
          className="flex flex-wrap gap-4"
        >
          {EMOTIONS.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={value} id={`emotion-${value}`} />
              <Label htmlFor={`emotion-${value}`} className="flex items-center space-x-2">
                <span className="text-2xl">{value}</span>
                <span>{label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

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