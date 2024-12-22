import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [emotionStats, setEmotionStats] = useState<any[]>([]);

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

      // Calculate percentages for before and after emotions
      const totalDreams = dreams.length;
      const emotionCounts = EMOTIONS.map((emotion) => {
        const beforeCount = dreams.filter(
          (d) => d.emotion_before === emotion.value
        ).length;
        const afterCount = dreams.filter(
          (d) => d.emotion_after === emotion.value
        ).length;

        return {
          emotion: emotion.value,
          label: emotion.label,
          beforePercentage: totalDreams
            ? Math.round((beforeCount / totalDreams) * 100)
            : 0,
          afterPercentage: totalDreams
            ? Math.round((afterCount / totalDreams) * 100)
            : 0,
        };
      });

      setEmotionStats(emotionCounts);
    };

    fetchDreams();
  }, [user]);

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-purple-900 dark:text-purple-100">
        Emotional Journey Report
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Emotional States Before vs After Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionStats} layout="vertical">
                <XAxis type="number" unit="%" domain={[0, 100]} />
                <YAxis
                  dataKey="emotion"
                  type="category"
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name === "beforePercentage"
                      ? "Before Interpretation"
                      : "After Interpretation",
                  ]}
                  labelFormatter={(label) =>
                    emotionStats.find((e) => e.emotion === label)?.label
                  }
                />
                <Legend />
                <Bar
                  dataKey="beforePercentage"
                  name="Before Interpretation"
                  fill="#9333ea"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="afterPercentage"
                  name="After Interpretation"
                  fill="#22c55e"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-5 gap-4">
            {EMOTIONS.map((emotion) => (
              <div
                key={emotion.value}
                className="flex flex-col items-center text-center"
              >
                <span className="text-2xl">{emotion.value}</span>
                <span className="text-sm text-muted-foreground">
                  {emotion.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;