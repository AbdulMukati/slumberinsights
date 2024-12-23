import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DreamListView from "./DreamListView";
import DreamCalendarView from "./DreamCalendarView";

interface DreamHistoryProps {
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
    notes?: string;
    emotion_before?: string;
    emotion_after?: string;
  }>;
  onDeleteDream: (id: string) => void;
}

const DreamHistory = ({ dreams, onDeleteDream }: DreamHistoryProps) => {
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
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <DreamListView dreams={dreams} onDeleteDream={onDeleteDream} />
            </TabsContent>

            <TabsContent value="calendar">
              <DreamCalendarView dreams={dreams} onDeleteDream={onDeleteDream} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DreamHistory;