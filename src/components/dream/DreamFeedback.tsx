import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EMOTIONS = [
  { value: "😊", label: "Happy", score: 5 },
  { value: "😌", label: "Calm", score: 4 },
  { value: "😕", label: "Confused", score: 3 },
  { value: "😨", label: "Anxious", score: 2 },
  { value: "😢", label: "Sad", score: 1 },
];

interface DreamFeedbackProps {
  dreamId: string;
}

const DreamFeedback = ({ dreamId }: DreamFeedbackProps) => {
  const [notes, setNotes] = useState("");
  const [emotionAfter, setEmotionAfter] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    if (!notes.trim() || !emotionAfter) return;

    setIsSaving(true);
    try {
      const emotion = EMOTIONS.find(e => e.value === emotionAfter);
      const { error } = await supabase
        .from("dreams")
        .update({
          notes,
          emotion_after: emotionAfter,
          emotion_after_value: emotion?.score
        })
        .eq("id", dreamId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your notes and feelings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 border-t pt-6">
      <div>
        <Label>How do you feel after reading the interpretation?</Label>
        <RadioGroup
          value={emotionAfter}
          onValueChange={setEmotionAfter}
          className="flex flex-wrap gap-4 mt-2"
        >
          {EMOTIONS.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={value} id={`emotion-after-${value}`} />
              <Label
                htmlFor={`emotion-after-${value}`}
                className="flex items-center space-x-2"
              >
                <span className="text-2xl">{value}</span>
                <span>{label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="notes">Your Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your thoughts about this interpretation..."
          className="mt-2"
        />
      </div>

      <Button
        onClick={handleSaveNotes}
        disabled={isSaving || !notes.trim() || !emotionAfter}
        className="w-full"
      >
        {isSaving ? "Saving..." : "Save Notes & Feelings"}
      </Button>
    </div>
  );
};

export default DreamFeedback;