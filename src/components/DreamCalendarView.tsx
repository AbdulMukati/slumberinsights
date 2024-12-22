import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import DreamListItem from "./DreamListItem";

interface DreamCalendarViewProps {
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

const DreamCalendarView = ({ dreams, onDeleteDream }: DreamCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [expandedDream, setExpandedDream] = useState<number | null>(null);

  const dreamsForSelectedDate = selectedDate
    ? dreams.filter(
        (dream) =>
          format(new Date(dream.date), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border shadow"
        />
      </div>
      <div className="space-y-4">
        {dreamsForSelectedDate.map((dream, index) => (
          <DreamListItem
            key={dream.id}
            dream={dream}
            isExpanded={expandedDream === index}
            onToggle={() => setExpandedDream(expandedDream === index ? null : index)}
            onDelete={onDeleteDream}
          />
        ))}
        {dreamsForSelectedDate.length === 0 && selectedDate && (
          <p className="text-center text-gray-500">
            No dreams recorded for {format(selectedDate, "MMMM d, yyyy")}
          </p>
        )}
      </div>
    </div>
  );
};

export default DreamCalendarView;