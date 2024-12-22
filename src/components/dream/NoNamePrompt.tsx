import { Link } from "react-router-dom";

const NoNamePrompt = () => (
  <div className="text-center mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
    <p className="text-sm text-yellow-800 dark:text-yellow-200">
      To make your dream interpretation more personal, please{" "}
      <Link to="/profile" className="text-blue-600 dark:text-blue-400 hover:underline">
        add your name to your profile
      </Link>
      .
    </p>
  </div>
);

export default NoNamePrompt;