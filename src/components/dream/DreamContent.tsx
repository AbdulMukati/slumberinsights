import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";

interface DreamContentProps {
  dream: string;
  interpretation: string;
  image_url?: string;
  emotion_before?: string;
  symbolism?: string;
  emotional_analysis?: string;
  detailed_interpretation?: string;
}

const DreamContent = ({ 
  dream, 
  interpretation, 
  image_url, 
  emotion_before,
  symbolism,
  emotional_analysis,
  detailed_interpretation 
}: DreamContentProps) => (
  <CardContent>
    <div className="prose dark:prose-invert max-w-none space-y-8">
      {image_url && (
        <div className="mb-8">
          <img
            src={image_url}
            alt="Dream visualization"
            className="rounded-lg w-full max-w-2xl mx-auto"
          />
        </div>
      )}
      
      <div className="p-6 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-left">
        <h3 className="text-xl font-semibold mb-4">Your Dream</h3>
        <p className="text-gray-700 dark:text-gray-300">{dream}</p>
        {emotion_before && (
          <div className="mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Initial feeling: {emotion_before}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <section className="p-6 bg-white dark:bg-gray-800/50 rounded-lg text-left">
          <h3 className="text-xl font-semibold mb-4">Brief Interpretation</h3>
          <div className="text-gray-700 dark:text-gray-300">
            {interpretation}
          </div>
        </section>

        {symbolism && (
          <section className="p-6 bg-white dark:bg-gray-800/50 rounded-lg text-left">
            <h3 className="text-xl font-semibold mb-4">Symbolic Analysis</h3>
            <div className="text-gray-700 dark:text-gray-300">
              {symbolism}
            </div>
          </section>
        )}

        {emotional_analysis && (
          <section className="p-6 bg-white dark:bg-gray-800/50 rounded-lg text-left">
            <h3 className="text-xl font-semibold mb-4">Emotional Analysis</h3>
            <div className="text-gray-700 dark:text-gray-300">
              {emotional_analysis}
            </div>
          </section>
        )}

        {detailed_interpretation && (
          <section className="p-6 bg-white dark:bg-gray-800/50 rounded-lg text-left">
            <h3 className="text-xl font-semibold mb-4">Detailed Personal Interpretation</h3>
            <div className="text-gray-700 dark:text-gray-300">
              {detailed_interpretation}
            </div>
          </section>
        )}
      </div>
    </div>
  </CardContent>
);

export default DreamContent;