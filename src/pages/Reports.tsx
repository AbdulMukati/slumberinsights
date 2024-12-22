import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const emotionToNumber = (emotion: string) => {
  const emotionMap: { [key: string]: number } = {
    'Terrible': 1,
    'Bad': 2,
    'Neutral': 3,
    'Good': 4,
    'Great': 5
  };
  return emotionMap[emotion] || 3;
};

const Reports = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDreams = async () => {
      if (!user) return;

      const { data: dreams, error } = await supabase
        .from("dreams")
        .select("created_at, emotion_before, emotion_after")
        .eq("user_id", user.id)
        .order("created_at");

      if (error) {
        console.error("Error fetching dreams:", error);
        return;
      }

      const formattedData = dreams.map(dream => ({
        date: format(new Date(dream.created_at), 'MMM dd'),
        before: emotionToNumber(dream.emotion_before || 'Neutral'),
        after: emotionToNumber(dream.emotion_after || 'Neutral'),
      }));

      setData(formattedData);
    };

    fetchDreams();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Emotional Journey Report</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daily Emotional States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis 
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) => {
                    const emotions = ['Terrible', 'Bad', 'Neutral', 'Good', 'Great'];
                    return emotions[value - 1] || '';
                  }}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="before" 
                  stroke="#8884d8" 
                  name="Starting Emotion"
                  dot={{ strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="after" 
                  stroke="#82ca9d" 
                  name="Ending Emotion"
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;