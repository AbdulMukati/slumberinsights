import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DreamListItemProps {
  dream: {
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
  };
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
}

const DreamListItem = ({ dream, isExpanded, onToggle, onDelete }: DreamListItemProps) => {
  return (
    <motion.div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30">
      <div className="flex justify-between items-center mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            {dream.title}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(dream.date), "MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-red-500"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Dream</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this dream? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => onDelete(dream.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4"
          >
            {dream.image_url && (
              <div className="mt-4">
                <img
                  src={dream.image_url}
                  alt="Dream visualization"
                  className="rounded-lg w-full max-w-md mx-auto"
                />
              </div>
            )}
            <div>
              <h4 className="font-semibold mb-2">Dream</h4>
              <p className="text-gray-700 dark:text-gray-300">{dream.dream}</p>
            </div>
            {(dream.emotion_before || dream.emotion_after) && (
              <div className="flex gap-4">
                {dream.emotion_before && (
                  <div>
                    <h4 className="font-semibold mb-2">Initial Feeling</h4>
                    <p className="text-2xl">{dream.emotion_before}</p>
                  </div>
                )}
                {dream.emotion_after && (
                  <div>
                    <h4 className="font-semibold mb-2">After Interpretation</h4>
                    <p className="text-2xl">{dream.emotion_after}</p>
                  </div>
                )}
              </div>
            )}
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
            {dream.notes && (
              <div>
                <h4 className="font-semibold mb-2">Your Notes</h4>
                <p className="text-gray-700 dark:text-gray-300">{dream.notes}</p>
              </div>
            )}
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