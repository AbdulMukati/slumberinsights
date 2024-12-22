import { useState } from "react";
import DreamListItem from "./DreamListItem";

interface DreamListViewProps {
  dreams: Array<{
    id: string;
    dream: string;
    interpretation: string;
    symbolism: string;
    emotional_analysis: string;
    detailed_interpretation: string;
    date: string;
    title: string;
    image_url?: string;
  }>;
  onDeleteDream: (id: string) => void;
}

const DreamListView = ({ dreams, onDeleteDream }: DreamListViewProps) => {
  const [expandedDream, setExpandedDream] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {dreams.map((dream, index) => (
        <DreamListItem
          key={dream.id}
          dream={dream}
          isExpanded={expandedDream === index}
          onToggle={() => setExpandedDream(expandedDream === index ? null : index)}
          onDelete={onDeleteDream}
        />
      ))}
    </div>
  );
};

export default DreamListView;