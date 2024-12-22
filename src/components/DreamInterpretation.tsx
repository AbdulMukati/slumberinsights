import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DreamInterpretationProps {
  dream: {
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
  };
}

const EMOTIONS = [
  { value: "😊", label: "Happy" },
  { value: "😌", label: "Calm" },
  { value: "😕", label: "Confused" },
  { value: "😨", label: "Anxious" },
  { value: "😢", label: "Sad" },
];

const DreamInterpretation = ({ dream }: DreamInterpretationProps) => {
  const [notes, setNotes] = useState("");
  const [emotionAfter, setEmotionAfter] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const formatSection = (text: string | null) => {
    if (!text) return null;
    
    // Split by double asterisks to handle section titles
    const parts = text.split(/\*\*(.*?)\*\*/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a section title (was between **)
        return <h4 key={index} className="font-semibold text-lg mt-4 mb-2">{part}</h4>;
      } else {
        // This is regular content
        return part.split('\n').map((line, lineIndex) => (
          <p key={`${index}-${lineIndex}`} className="mb-2">{line}</p>
        ));
      }
    });
  };

  const handleSaveNotes = async () => {
    if (!notes.trim() || !emotionAfter) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("dreams")
        .update({
          notes,
          emotion_after: emotionAfter,
        })
        .eq("id", dream.id);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900 dark:text-purple-100">
            {dream.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none space-y-6">
            {dream.image_url && (
              <div className="mb-6">
                <img
                  src={dream.image_url}
                  alt="Dream visualization"
                  className="rounded-lg w-full max-w-2xl mx-auto"
                />
              </div>
            )}
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Your Dream</h3>
              <p className="text-gray-700 dark:text-gray-300">{dream.dream}</p>
              {dream.emotion_before && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    How you felt: {dream.emotion_before}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-white dark:bg-gray-800/50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Initial Thoughts</h3>
              <div className="text-gray-700 dark:text-gray-300">
                {formatSection(dream.interpretation)}
              </div>
            </div>

            <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Symbolic Analysis</h3>
              <div className="text-gray-700 dark:text-gray-300">
                {formatSection(dream.symbolism)}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800/50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Emotional Insights</h3>
              <div className="text-gray-700 dark:text-gray-300">
                {formatSection(dream.emotional_analysis)}
              </div>
            </div>

            <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Personal Reflection</h3>
              <div className="text-gray-700 dark:text-gray-300">
                {formatSection(dream.detailed_interpretation)}
              </div>
            </div>

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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DreamInterpretation;