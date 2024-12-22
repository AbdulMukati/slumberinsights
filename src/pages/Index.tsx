import React, { useState } from "react";
import DreamForm from "@/components/DreamForm";
import DreamInterpretation from "@/components/DreamInterpretation";
import SignUpWall from "@/components/SignUpWall";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleDreamSubmit = async (dream: string, emotionBefore: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/interpret-dream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dream, emotionBefore }),
      });
      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (error) {
      console.error("Error interpreting dream:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <img
            src="/lovable-uploads/9d7c542e-59e6-4b50-873b-f6410e5195ed.png"
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

        {!user ? (
          <SignUpWall />
        ) : (
          <>
            <DreamForm onSubmit={handleDreamSubmit} isLoading={isLoading} />
            {interpretation && <DreamInterpretation interpretation={interpretation} />}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;