import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DreamInterpretationProps {
  dream: {
    dream: string;
    interpretation: string;
    date: string;
  };
}

const DreamInterpretation = ({ dream }: DreamInterpretationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900 dark:text-purple-100">
            Your Dream Interpretation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Your Dream</h3>
              <p className="text-gray-700 dark:text-gray-300">{dream.dream}</p>
            </div>
            <div className="interpretation">
              <h3 className="text-lg font-semibold mb-2">Interpretation</h3>
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {dream.interpretation}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DreamInterpretation;