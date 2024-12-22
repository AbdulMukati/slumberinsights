import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const EMOTIONS = [
  { value: "😊", label: "Happy", score: 5 },
  { value: "😌", label: "Calm", score: 4 },
  { value: "😕", label: "Confused", score: 3 },
  { value: "😨", label: "Anxious", score: 2 },
  { value: "😢", label: "Sad", score: 1 },
];

interface EmotionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const EmotionSelector = ({ value, onChange }: EmotionSelectorProps) => (
  <div className="space-y-4">
    <Label className="text-lg">
      How are you feeling about this dream?
    </Label>
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="flex flex-wrap gap-4"
    >
      {EMOTIONS.map(({ value: emotionValue, label }) => (
        <div key={emotionValue} className="flex items-center space-x-2">
          <RadioGroupItem value={emotionValue} id={`emotion-${emotionValue}`} />
          <Label htmlFor={`emotion-${emotionValue}`} className="flex items-center space-x-2">
            <span className="text-2xl">{emotionValue}</span>
            <span>{label}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>
);

export default EmotionSelector;