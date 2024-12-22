import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OpenAIUsage = () => {
  const [usageData, setUsageData] = useState<any[]>([]);
  const [userTotals, setUserTotals] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    const { data: usage, error } = await supabase
      .from("openai_usage")
      .select("*, profiles:user_id(full_name)");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch usage data",
        variant: "destructive",
      });
      return;
    }

    setUsageData(usage);

    // Calculate totals per user
    const totals = usage.reduce((acc: any, curr: any) => {
      const userId = curr.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          user_id: userId,
          user_name: curr.profiles?.full_name,
          total_tokens: 0,
        };
      }
      acc[userId].total_tokens += curr.tokens_used;
      return acc;
    }, {});

    setUserTotals(Object.values(totals));
  };

  return (
    <div className="space-y-8">
      <div className="h-[400px]">
        <h3 className="text-lg font-semibold mb-4">Usage by User</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={userTotals}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="user_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_tokens" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Usage</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usageData.map((usage) => (
              <TableRow key={usage.id}>
                <TableCell>{usage.profiles?.full_name}</TableCell>
                <TableCell>{usage.tokens_used}</TableCell>
                <TableCell>{usage.model_name}</TableCell>
                <TableCell>{usage.request_type}</TableCell>
                <TableCell>
                  {new Date(usage.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OpenAIUsage;