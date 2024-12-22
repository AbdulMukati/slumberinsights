import { motion } from "framer-motion";
import { loadingMessages } from "@/data/loadingMessages";
import { useEffect, useState } from "react";

const LoadingDream = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setMessage(loadingMessages[randomIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 space-y-4"
    >
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg text-purple-600 dark:text-purple-300 animate-pulse">
        {message || loadingMessages[0]}
      </p>
    </motion.div>
  );
};

export default LoadingDream;