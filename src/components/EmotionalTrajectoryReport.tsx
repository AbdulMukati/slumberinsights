import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EMOTIONS = [
  { emoji: "😢", label: "Sad" },
  { emoji: "😨", label: "Anxious" },
  { emoji: "😕", label: "Confused" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😊", label: "Happy" },
];

interface EmotionalTrajectoryReportProps {
  dreams: Array<{
    emotion_before?: string;
    emotion_after?: string;
  }>;
}

const EmotionalTrajectoryReport = ({ dreams }: EmotionalTrajectoryReportProps) => {
  const emotionCounts = useMemo(() => {
    const before: { [key: string]: number } = {};
    const after: { [key: string]: number } = {};
    
    EMOTIONS.forEach(({ emoji }) => {
      before[emoji] = 0;
      after[emoji] = 0;
    });

    dreams.forEach((dream) => {
      if (dream.emotion_before) before[dream.emotion_before]++;
      if (dream.emotion_after) after[dream.emotion_after]++;
    });

    return { before, after };
  }, [dreams]);

  const chartData = useMemo(() => {
    return EMOTIONS.map(({ emoji, label }) => ({
      emoji,
      label,
      before: emotionCounts.before[emoji] || 0,
      after: emotionCounts.after[emoji] || 0,
    }));
  }, [emotionCounts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotional Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Initial Feelings</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="emoji"
                    tick={{ fontSize: 20 }}
                  />
                  <YAxis />
                  <Bar dataKey="before" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">After Interpretation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="emoji"
                    tick={{ fontSize: 20 }}
                  />
                  <YAxis />
                  <Bar dataKey="after" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex justify-center gap-8 pt-4">
            {EMOTIONS.map(({ emoji, label }) => (
              <div key={emoji} className="text-center">
                <span className="text-2xl">{emoji}</span>
                <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalTrajectoryReport;