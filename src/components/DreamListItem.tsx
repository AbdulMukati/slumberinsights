import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DreamListItemProps {
  dream: {
    dream: string;
    interpretation: string;
    symbolism: string;
    emotional_analysis: string;
    detailed_interpretation: string;
    date: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

const DreamListItem = ({ dream, isExpanded, onToggle }: DreamListItemProps) => {
  return (
    <motion.div
      className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(dream.date), "MMMM d, yyyy")}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </div>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4"
          >
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
          </motion.div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
            {dream.dream}
          </p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DreamListItem;