import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DreamFormProps {
  onSubmit: (dream: string) => void;
  isLoading: boolean;
}

const DreamForm = ({ onSubmit, isLoading }: DreamFormProps) => {
  const [dream, setDream] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim()) {
      onSubmit(dream);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Textarea
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        placeholder="Describe your dream in detail..."
        className="min-h-[200px] mb-4 p-4 text-lg"
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={isLoading || !dream.trim()}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isLoading ? "Interpreting..." : "Interpret Dream"}
      </Button>
    </motion.form>
  );
};

export default DreamForm;