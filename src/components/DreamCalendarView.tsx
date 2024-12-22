import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import DreamListItem from "./DreamListItem";
import { Badge } from "@/components/ui/badge";

interface DreamCalendarViewProps {
  dreams: Array<{
    id: string;
    dream: string;
    interpretation: string;
    date: string;
    title: string;
    image_url?: string;
    notes?: string;
    emotion_before?: string;
    emotion_after?: string;
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

  const dreamCountByDate = dreams.reduce((acc, dream) => {
    const date = format(new Date(dream.date), "yyyy-MM-dd");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border shadow"
          components={{
            DayContent: ({ date }) => {
              const formattedDate = format(date, "yyyy-MM-dd");
              const count = dreamCountByDate[formattedDate];
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <span>{format(date, "d")}</span>
                  {count > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {count}
                    </Badge>
                  )}
                </div>
              );
            },
          }}
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