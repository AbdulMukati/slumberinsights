import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
      <div className="space-y-4">
        <Label htmlFor="dream">Describe your dream</Label>
        <Textarea
          id="dream"
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Describe your dream in detail..."
          className="min-h-[200px] mb-4 p-4 text-lg"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-4">
        <Label>How do you feel about this dream?</Label>
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
        {isLoading ? "Interpreting..." : "Interpret Dream"}
      </Button>
    </motion.form>
  );
};

export default DreamForm;