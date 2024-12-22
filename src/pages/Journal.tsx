import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DreamHistory from "@/components/DreamHistory";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

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
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setDreams(
        data.map((dream) => ({
          id: dream.id,
          dream: dream.dream,
          interpretation: dream.interpretation,
          symbolism: dream.symbolism || "No symbolism analysis available",
          emotional_analysis: dream.emotional_analysis || "No emotional analysis available",
          detailed_interpretation: dream.detailed_interpretation || "No detailed interpretation available",
          date: new Date(dream.created_at).toISOString(),
          title: dream.title || "Untitled Dream",
          image_url: dream.image_url,
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

  const handleDeleteDream = async (dreamId: string) => {
    try {
      const { error } = await supabase
        .from("dreams")
        .delete()
        .eq("id", dreamId);

      if (error) throw error;

      setDreams(dreams.filter((dream) => dream.id !== dreamId));
      toast({
        title: "Success",
        description: "Dream deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete dream",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      <div className="container max-w-4xl mx-auto pt-16 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 dark:text-purple-100">
            Dream Journal
          </h1>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
        <DreamHistory dreams={dreams} onDeleteDream={handleDeleteDream} />
      </div>
    </div>
  );
};

export default Journal;