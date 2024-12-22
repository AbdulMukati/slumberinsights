import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { loadingMessages } from "@/data/loadingMessages";

const LoadingDream = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="space-y-6 text-center">
        <motion.div
          className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="relative">
          <motion.div
            className="text-xl text-purple-600 dark:text-purple-300 font-medium"
            initial={{ filter: "blur(0px)" }}
            animate={{ filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {loadingMessages[currentMessageIndex].split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="w-64 h-1 bg-purple-200 rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: 256 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.div
          className="h-full bg-purple-600"
          animate={{
            x: [-256, 256],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingDream;