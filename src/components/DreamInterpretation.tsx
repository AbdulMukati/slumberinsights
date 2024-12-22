import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DreamInterpretationProps {
  dream: {
    dream: string;
    interpretation: string;
    symbolism: string;
    emotional_analysis: string;
    detailed_interpretation: string;
    date: string;
    title: string;
    image_url?: string;
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
            {dream.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none space-y-6">
            {dream.image_url && (
              <div className="mb-6">
                <img
                  src={dream.image_url}
                  alt="Dream visualization"
                  className="rounded-lg w-full max-w-2xl mx-auto"
                />
              </div>
            )}
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Your Dream</h3>
              <p className="text-gray-700 dark:text-gray-300">{dream.dream}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Brief Interpretation</h3>
              <p className="text-gray-700 dark:text-gray-300">{dream.interpretation}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Symbolic Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300">{dream.symbolism}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Emotional Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300">{dream.emotional_analysis}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Detailed Personal Interpretation</h3>
              <p className="text-gray-700 dark:text-gray-300">{dream.detailed_interpretation}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DreamInterpretation;