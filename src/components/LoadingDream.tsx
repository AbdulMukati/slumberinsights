import { motion } from "framer-motion";

const LoadingDream = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="mt-4 text-purple-600 dark:text-purple-300">
        Interpreting your dream...
      </p>
    </motion.div>
  );
};

export default LoadingDream;