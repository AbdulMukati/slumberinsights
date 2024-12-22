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

  const handleSave = async () => {
    if (!emotionAfter) {
      toast({
        title: "Required Field",
        description: "Please select how you feel after the interpretation.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const emotion = EMOTIONS.find(e => e.value === emotionAfter);
      const { error } = await supabase
        .from("dreams")
        .update({
          notes: notes.trim() || null,
          emotion_after: emotionAfter,
          emotion_after_value: emotion?.score
        })
        .eq("id", dreamId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your feedback has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 border-t pt-6 px-6 pb-8">
      <div className="text-center">
        <Label className="text-lg mb-4 block font-semibold">
          How do you feel after reading the interpretation?
        </Label>
        <RadioGroup
          value={emotionAfter}
          onValueChange={setEmotionAfter}
          className="flex flex-wrap justify-center gap-6 mt-4"
        >
          {EMOTIONS.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={value} id={`emotion-after-${value}`} />
              <Label
                htmlFor={`emotion-after-${value}`}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <span className="text-2xl">{value}</span>
                <span>{label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="notes" className="text-lg mb-4 block font-semibold">
          Your Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your thoughts about this interpretation..."
          className="mt-2"
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving || !emotionAfter}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {isSaving ? "Saving..." : "Save Feedback"}
      </Button>
    </div>
  );
};

export default DreamFeedback;