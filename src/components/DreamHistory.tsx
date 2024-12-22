import { motion, AnimatePresence } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DreamHistoryProps {
  dreams: Array<{
    dream: string;
    interpretation: string;
    date: string;
  }>;
}

const DreamHistory = ({ dreams }: DreamHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState("list");
  const [expandedDream, setExpandedDream] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const filteredDreams = selectedDate
    ? dreams.filter(
        (dream) =>
          format(new Date(dream.date), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      )
    : dreams;

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

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900 dark:text-purple-100">
            Dream Journal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full" onValueChange={setView}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <div className="space-y-4">
                {dreams.map((dream, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 cursor-pointer"
                    onClick={() => setExpandedDream(expandedDream === index ? null : index)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(dream.date), "MMMM d, yyyy")}
                      </span>
                      {expandedDream === index ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                    <AnimatePresence>
                      {expandedDream === index ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <p className="text-gray-700 dark:text-gray-300 mb-2">
                            {dream.dream}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            Interpretation: {dream.interpretation}
                          </p>
                        </motion.div>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                          {dream.dream}
                        </p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calendar">
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
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {dream.dream}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          Interpretation: {dream.interpretation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DreamHistory;