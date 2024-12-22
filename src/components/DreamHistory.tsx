import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DreamHistoryProps {
  dreams: Array<{
    dream: string;
    interpretation: string;
    date: string;
  }>;
}

const DreamHistory = ({ dreams }: DreamHistoryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900 dark:text-purple-100">
            Recent Dreams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dreams.map((dream, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {dream.date}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                  {dream.dream}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DreamHistory;