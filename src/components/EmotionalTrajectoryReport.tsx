import { useState } from "react";
import { format, subMonths, subWeeks, subYears } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EMOTIONS_MAP = {
  "😊": 100, // Happy
  "😌": 75,  // Calm
  "😕": 50,  // Confused
  "😨": 25,  // Anxious
  "😢": 5,   // Sad
};

const REVERSE_EMOTIONS_MAP = {
  100: "😊",
  75: "😌",
  50: "😕",
  25: "😨",
  5: "😢",
};

interface EmotionalTrajectoryReportProps {
  dreams: Array<{
    date: string;
    emotion_before?: string;
    emotion_after?: string;
  }>;
}

const EmotionalTrajectoryReport = ({ dreams }: EmotionalTrajectoryReportProps) => {
  const [timeRange, setTimeRange] = useState("week");

  const getDateLimit = () => {
    const now = new Date();
    switch (timeRange) {
      case "week":
        return subWeeks(now, 1);
      case "month":
        return subMonths(now, 1);
      case "6months":
        return subMonths(now, 6);
      case "year":
        return subYears(now, 1);
      default:
        return subWeeks(now, 1);
    }
  };

  const filteredDreams = dreams.filter(
    (dream) => new Date(dream.date) >= getDateLimit()
  );

  const chartData = filteredDreams.map((dream) => ({
    date: format(new Date(dream.date), "MMM dd"),
    before: dream.emotion_before ? EMOTIONS_MAP[dream.emotion_before as keyof typeof EMOTIONS_MAP] : null,
    after: dream.emotion_after ? EMOTIONS_MAP[dream.emotion_after as keyof typeof EMOTIONS_MAP] : null,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              {entry.name === "before" ? "Before: " : "After: "}
              {REVERSE_EMOTIONS_MAP[entry.value as keyof typeof REVERSE_EMOTIONS_MAP]}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Emotional Trajectory</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="6months">6 Months</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[0, 100]}
                ticks={[5, 25, 50, 75, 100]}
                tickFormatter={(value) => REVERSE_EMOTIONS_MAP[value as keyof typeof REVERSE_EMOTIONS_MAP]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="before"
                stroke="#9333ea"
                name="Before"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="after"
                stroke="#22c55e"
                name="After"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-4">
          {[
            { emoji: "😢", label: "Sad" },
            { emoji: "😨", label: "Anxious" },
            { emoji: "😕", label: "Confused" },
            { emoji: "😌", label: "Calm" },
            { emoji: "😊", label: "Happy" },
          ].map(({ emoji, label }) => (
            <div key={emoji} className="text-center">
              <span className="text-4xl">{emoji}</span>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalTrajectoryReport;
