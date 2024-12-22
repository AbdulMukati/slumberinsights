import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { EMOTIONS } from "@/components/dream/EmotionSelector";

const Reports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [beforeEmotions, setBeforeEmotions] = useState<any[]>([]);
  const [afterEmotions, setAfterEmotions] = useState<any[]>([]);

  useEffect(() => {
    const fetchDreams = async () => {
      if (!user) return;

      const { data: dreams, error } = await supabase
        .from("dreams")
        .select("emotion_before, emotion_after")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching dreams:", error);
        return;
      }

      // Calculate percentages for before emotions
      const totalDreams = dreams.length;
      const beforeCounts = EMOTIONS.map((emotion) => {
        const count = dreams.filter(
          (d) => d.emotion_before === emotion.value
        ).length;
        return {
          emotion: emotion.value,
          label: emotion.label,
          percentage: totalDreams ? Math.round((count / totalDreams) * 100) : 0,
        };
      });

      // Calculate percentages for after emotions
      const afterCounts = EMOTIONS.map((emotion) => {
        const count = dreams.filter(
          (d) => d.emotion_after === emotion.value
        ).length;
        return {
          emotion: emotion.value,
          label: emotion.label,
          percentage: totalDreams ? Math.round((count / totalDreams) * 100) : 0,
        };
      });

      setBeforeEmotions(beforeCounts);
      setAfterEmotions(afterCounts);
    };

    fetchDreams();
  }, [user]);

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">
          Emotional Journey Report
        </h1>
      </div>

      <div className="grid gap-8">
        {/* Before Interpretation */}
        <Card>
          <CardHeader>
            <CardTitle>Emotional States Before Dream Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={beforeEmotions} layout="vertical">
                  <XAxis type="number" unit="%" domain={[0, 100]} />
                  <YAxis
                    dataKey="emotion"
                    type="category"
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Frequency"]}
                    labelFormatter={(label) =>
                      beforeEmotions.find((e) => e.emotion === label)?.label
                    }
                  />
                  <Bar
                    dataKey="percentage"
                    fill="#9333ea"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* After Interpretation */}
        <Card>
          <CardHeader>
            <CardTitle>Emotional States After Dream Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={afterEmotions} layout="vertical">
                  <XAxis type="number" unit="%" domain={[0, 100]} />
                  <YAxis
                    dataKey="emotion"
                    type="category"
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Frequency"]}
                    labelFormatter={(label) =>
                      afterEmotions.find((e) => e.emotion === label)?.label
                    }
                  />
                  <Bar
                    dataKey="percentage"
                    fill="#22c55e"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emoji Legend */}
        <div className="mt-6 grid grid-cols-5 gap-4">
          {EMOTIONS.map((emotion) => (
            <div
              key={emotion.value}
              className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <span className="text-2xl">{emotion.value}</span>
              <span className="text-sm text-muted-foreground mt-2">
                {emotion.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;