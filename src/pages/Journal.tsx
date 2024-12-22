import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DreamHistory from "@/components/DreamHistory";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Journal = () => {
  const [dreams, setDreams] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchDreams();
  }, [user]);

  const fetchDreams = async () => {
    try {
      const { data, error } = await supabase
        .from("dreams")
        .select("dream, interpretation, symbolism, emotional_analysis, detailed_interpretation, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setDreams(
        data.map((dream) => ({
          dream: dream.dream,
          interpretation: dream.interpretation,
          symbolism: dream.symbolism,
          emotional_analysis: dream.emotional_analysis,
          detailed_interpretation: dream.detailed_interpretation,
          date: new Date(dream.created_at).toISOString(),
        }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your dream journal",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      <div className="container max-w-4xl mx-auto pt-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-purple-900 dark:text-purple-100">
          Dream Journal
        </h1>
        <DreamHistory dreams={dreams} />
      </div>
    </div>
  );
};

export default Journal;