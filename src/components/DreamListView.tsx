import { useState } from "react";
import DreamListItem from "./DreamListItem";

interface DreamListViewProps {
  dreams: Array<{
    dream: string;
    interpretation: string;
    symbolism: string;
    emotional_analysis: string;
    detailed_interpretation: string;
    date: string;
  }>;
}

const DreamListView = ({ dreams }: DreamListViewProps) => {
  const [expandedDream, setExpandedDream] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {dreams.map((dream, index) => (
        <DreamListItem
          key={index}
          dream={dream}
          isExpanded={expandedDream === index}
          onToggle={() => setExpandedDream(expandedDream === index ? null : index)}
        />
      ))}
    </div>
  );
};

export default DreamListView;