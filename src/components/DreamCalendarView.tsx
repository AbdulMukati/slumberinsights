import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DreamCalendarViewProps {
  dreams: Array<{
    dream: string;
    interpretation: string;
    symbolism: string;
    emotional_analysis: string;
    detailed_interpretation: string;
    date: string;
  }>;
}

const DreamCalendarView = ({ dreams }: DreamCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getDreamsForDate = (date: Date) => {
    return dreams.filter(
      (dream) =>
        format(new Date(dream.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const filteredDreams = selectedDate
    ? getDreamsForDate(selectedDate)
    : [];

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div
            key={day}
            className="text-center p-2 font-semibold text-sm border-b"
          >
            {day}
          </div>
        ))}
        {daysInMonth.map((date, i) => {
          const dreamsForDate = getDreamsForDate(date);
          return (
            <div
              key={i}
              className={`min-h-[80px] p-1 border ${
                dreamsForDate.length > 0
                  ? "cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  : ""
              }`}
              onClick={() => {
                if (dreamsForDate.length > 0) {
                  setSelectedDate(date);
                }
              }}
            >
              <div className="text-right text-sm p-1">
                {format(date, "d")}
              </div>
              {dreamsForDate.length > 0 && (
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  {dreamsForDate.length} dream{dreamsForDate.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedDate && filteredDreams.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="font-semibold">
            Dreams for {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          {filteredDreams.map((dream, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Dream</h4>
                  <p className="text-gray-700 dark:text-gray-300">{dream.dream}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Interpretation</h4>
                  <p className="text-gray-700 dark:text-gray-300">{dream.interpretation}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Symbolism</h4>
                  <p className="text-gray-700 dark:text-gray-300">{dream.symbolism}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Emotional Analysis</h4>
                  <p className="text-gray-700 dark:text-gray-300">{dream.emotional_analysis}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Detailed Interpretation</h4>
                  <p className="text-gray-700 dark:text-gray-300">{dream.detailed_interpretation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DreamCalendarView;