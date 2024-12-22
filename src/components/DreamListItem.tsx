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
  // Function to format text with bold sections and proper spacing
  const formatText = (text: string) => {
    return text.split('**').map((part, index) => {
      return index % 2 === 0 ? (
        <span key={index} className="whitespace-pre-wrap">{part}</span>
      ) : (
        <strong key={index} className="font-bold text-purple-900 dark:text-purple-300">{part}</strong>
      );
    });
  };

  return (
    <motion.div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30">
      <div className="flex gap-4">
        {dream.image_url && (
          <div className="flex-shrink-0">
            <img
              src={dream.image_url}
              alt="Dream visualization"
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div>
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
                className="space-y-6"
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
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 text-purple-900 dark:text-purple-100">Dream</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {dream.dream}
                  </p>
                </div>
                {(dream.emotion_before || dream.emotion_after) && (
                  <div className="flex gap-4">
                    {dream.emotion_before && (
                      <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 flex-1">
                        <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">Initial Feeling</h4>
                        <p className="text-2xl">{dream.emotion_before}</p>
                      </div>
                    )}
                    {dream.emotion_after && (
                      <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 flex-1">
                        <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">After Interpretation</h4>
                        <p className="text-2xl">{dream.emotion_after}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 text-purple-900 dark:text-purple-100">Interpretation</h4>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {formatText(dream.interpretation)}
                  </div>
                </div>
                {dream.notes && (
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4 text-purple-900 dark:text-purple-100">Your Notes</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {dream.notes}
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                {dream.dream}
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default DreamListItem;