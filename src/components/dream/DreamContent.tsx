import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";

interface DreamContentProps {
  dream: string;
  interpretation: string;
  image_url?: string;
  emotion_before?: string;
}

const DreamContent = ({ 
  dream, 
  interpretation, 
  image_url, 
  emotion_before,
}: DreamContentProps) => {
  // Function to format text with bold sections
  const formatText = (text: string) => {
    return text.split('**').map((part, index) => {
      return index % 2 === 0 ? (
        <span key={index}>{part}</span>
      ) : (
        <strong key={index} className="font-bold">{part}</strong>
      );
    });
  };

  return (
    <CardContent className="space-y-8">
      <div className="prose dark:prose-invert max-w-none">
        {image_url && (
          <div className="mb-8">
            <img
              src={image_url}
              alt="Dream visualization"
              className="rounded-lg w-full max-w-2xl mx-auto"
            />
          </div>
        )}
        
        <div className="p-6 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Your Dream</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{dream}</p>
          {emotion_before && (
            <div className="mt-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Initial feeling: {emotion_before}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-gray-800/50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-purple-900 dark:text-purple-100">
            Interpretation
          </h3>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {formatText(interpretation)}
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default DreamContent;