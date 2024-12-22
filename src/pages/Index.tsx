import React from "react";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center mb-12">
        <img
          src="/lovable-uploads/60deec4a-9022-4457-9604-b4348f876c2a.png"
          alt="Dream Baba"
          className="w-48 h-48 mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-4">
          Welcome to Dream Baba
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your personal dream interpreter powered by AI
        </p>
      </div>
    </div>
  );
};

export default Index;
