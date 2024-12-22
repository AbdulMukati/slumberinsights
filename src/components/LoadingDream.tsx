import { motion } from "framer-motion";

const LoadingDream = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Typing animation for interpretation */}
      <div className="space-y-4">
        <motion.div
          className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="flex items-center space-x-2">
          <span className="text-purple-600 dark:text-purple-300">
            Interpreting your dream
          </span>
          <motion.span
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            ...
          </motion.span>
        </div>
      </div>

      {/* Drawing animation for image generation */}
      <div className="space-y-4">
        <motion.div
          className="w-64 h-64 border-2 border-purple-300 rounded-lg relative overflow-hidden"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800"
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-purple-600 dark:text-purple-300">
              Creating dream visualization
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingDream;