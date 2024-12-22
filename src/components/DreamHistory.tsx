import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface DreamHistoryProps {
  dreams: Array<{
    dream: string;
    interpretation: string;
    date: string;
  }>;
}

const DreamHistory = ({ dreams }: DreamHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState("list");

  const filteredDreams = selectedDate
    ? dreams.filter(
        (dream) =>
          format(new Date(dream.date), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      )
    : dreams;

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
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(dream.date), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {dream.dream}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      Interpretation: {dream.interpretation}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <div className="space-y-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mx-auto"
                />
                <div className="mt-4">
                  {filteredDreams.length > 0 ? (
                    filteredDreams.map((dream, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 mb-4"
                      >
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {dream.dream}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          Interpretation: {dream.interpretation}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      No dreams recorded for this date
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DreamHistory;