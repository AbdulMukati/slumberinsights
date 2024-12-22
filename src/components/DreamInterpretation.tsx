import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import DreamHeader from "./dream/DreamHeader";
import DreamContent from "./dream/DreamContent";
import DreamFeedback from "./dream/DreamFeedback";

interface DreamInterpretationProps {
  dream: {
    id: string;
    dream: string;
    interpretation: string;
    created_at: string;
    title: string;
    image_url?: string;
    emotion_before?: string;
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
        <DreamHeader title={dream.title} />
        <DreamContent
          dream={dream.dream}
          interpretation={dream.interpretation}
          image_url={dream.image_url}
          emotion_before={dream.emotion_before}
        />
        <DreamFeedback dreamId={dream.id} />
      </Card>
    </motion.div>
  );
};

export default DreamInterpretation;