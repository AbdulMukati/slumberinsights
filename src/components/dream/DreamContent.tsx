import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";

interface DreamContentProps {
  dream: string;
  interpretation: string;
  image_url?: string;
  emotion_before?: string;
}

const DreamContent = ({ dream, interpretation, image_url, emotion_before }: DreamContentProps) => (
  <CardContent>
    <div className="prose dark:prose-invert max-w-none space-y-6">
      {image_url && (
        <div className="mb-6">
          <img
            src={image_url}
            alt="Dream visualization"
            className="rounded-lg w-full max-w-2xl mx-auto"
          />
        </div>
      )}
      
      <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-left">
        <h3 className="text-lg font-semibold mb-2">Your Dream</h3>
        <p className="text-gray-700 dark:text-gray-300">{dream}</p>
        {emotion_before && (
          <div className="mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              How you felt: {emotion_before}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800/50 rounded-lg text-left">
        <h3 className="text-lg font-semibold mb-2">Interpretation</h3>
        <div className="text-gray-700 dark:text-gray-300">
          {interpretation}
        </div>
      </div>
    </div>
  </CardContent>
);

export default DreamContent;