import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import NoNamePrompt from "./dream/NoNamePrompt";
import EmotionSelector from "./dream/EmotionSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EMOTIONS } from "./dream/EmotionSelector";
import { useUsage } from "@/hooks/useUsage";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "./UpgradeModal";

interface DreamFormProps {
  onSubmit: (dream: string, emotionBefore: string, useIslamicInterpretation: boolean) => void;
  isLoading: boolean;
}

const MIN_DREAM_LENGTH = 50;
const GIBBERISH_PATTERN = /^[a-z]+$/i;
const FREE_DAILY_LIMIT = 2;

const DreamForm = ({ onSubmit, isLoading }: DreamFormProps) => {
  const [dream, setDream] = useState("");
  const [emotionBefore, setEmotionBefore] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [useIslamicInterpretation, setUseIslamicInterpretation] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { user } = useAuth();
  const { data: usage } = useUsage();
  const { data: subscription } = useSubscription();

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

  const validateDream = (text: string) => {
    if (text.length < MIN_DREAM_LENGTH) {
      return {
        isValid: false,
        message: "Could you tell me more about your dream? What details do you remember? How did it make you feel?"
      };
    }

    if (GIBBERISH_PATTERN.test(text.replace(/\s/g, ''))) {
      return {
        isValid: false,
        message: "Are you a QA engineer? Because you're doing a great job testing! When you're ready, why not share a real dream with me? I'd love to help interpret it. 😊"
      };
    }

    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateDream(dream);
    
    if (!validation.isValid) {
      setShowPrompt(true);
      return;
    }

    // Check usage limits
    if (!subscription?.subscribed && usage?.dream_interpretations_count >= FREE_DAILY_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }

    if (dream.trim() && emotionBefore) {
      const emotion = EMOTIONS.find(e => e.value === emotionBefore);
      onSubmit(dream, emotionBefore, useIslamicInterpretation);
      if (emotion) {
        // The emotion_before_value will be saved in the onSubmit handler
        try {
          await supabase.rpc('increment_usage', {
            p_user_id: user?.id,
            p_dream_interpretations_increment: 1,
          });
        } catch (error) {
          console.error('Error incrementing usage:', error);
        }
      }
    }
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {user && !userName && <NoNamePrompt />}
        
        <div className="space-y-4">
          <Label htmlFor="dream" className="text-lg font-semibold">
            Tell me about your dream
          </Label>
          <Textarea
            id="dream"
            value={dream}
            onChange={(e) => {
              setDream(e.target.value);
              setShowPrompt(false);
            }}
            placeholder="Share the details of your dream..."
            className="min-h-[200px] mb-4 p-4 text-lg"
            disabled={isLoading}
          />
          
          {showPrompt && (
            <Alert>
              <AlertDescription>
                {validateDream(dream).message}
              </AlertDescription>
            </Alert>
          )}

          {!subscription?.subscribed && usage?.dream_interpretations_count > 0 && (
            <Alert>
              <AlertDescription>
                You have {Math.max(0, FREE_DAILY_LIMIT - usage.dream_interpretations_count)} free interpretations remaining today.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <EmotionSelector 
          value={emotionBefore}
          onChange={setEmotionBefore}
        />

        <div className="flex items-center space-x-2 py-4">
          <Switch
            id="islamic-interpretation"
            checked={useIslamicInterpretation}
            onCheckedChange={setUseIslamicInterpretation}
          />
          <Label htmlFor="islamic-interpretation">
            Include Islamic interpretation (based on Quran and Hadith)
          </Label>
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

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="dreams"
      />
    </>
  );
};

export default DreamForm;