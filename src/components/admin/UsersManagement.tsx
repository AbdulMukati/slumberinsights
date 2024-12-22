import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SubscriptionPlan = 'free' | 'monthly' | 'yearly';

interface Profile {
  id: string;
  full_name: string;
  created_at: string;
  is_admin: boolean;
  subscribed: boolean;
  subscription_plan: SubscriptionPlan | null;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Validate and transform the data to ensure it matches the Profile type
      const validatedData: Profile[] = (data || []).map(user => ({
        ...user,
        subscription_plan: (user.subscription_plan as SubscriptionPlan) || 'free',
        is_admin: Boolean(user.is_admin),
        subscribed: Boolean(user.subscribed)
      }));
      
      setUsers(validatedData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: !currentStatus })
        .eq("id", userId);

      if (error) throw error;
      await fetchUsers();
      toast({
        title: "Success",
        description: "Admin status updated successfully",
      });
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive",
      });
    }
  };

  const updateSubscriptionPlan = async (userId: string, plan: SubscriptionPlan) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          subscription_plan: plan,
          subscribed: plan !== 'free'
        })
        .eq("id", userId);

      if (error) throw error;
      await fetchUsers();
      toast({
        title: "Success",
        description: "Subscription plan updated successfully",
      });
    } catch (error) {
      console.error("Error updating subscription plan:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription plan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Admin Status</TableHead>
            <TableHead>Subscription Plan</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Switch
                  checked={user.is_admin}
                  onCheckedChange={() => toggleAdminStatus(user.id, user.is_admin)}
                  disabled={user.is_admin && user.full_name === "Abdul Mukati"}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={user.subscription_plan || 'free'}
                  onValueChange={(value: SubscriptionPlan) => updateSubscriptionPlan(user.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="space-x-2">
                <span className={user.is_admin ? "text-green-600" : "text-gray-600"}>
                  {user.is_admin ? "Admin" : "User"}
                </span>
                <span className={user.subscription_plan !== 'free' ? "text-purple-600" : "text-gray-600"}>
                  {user.subscription_plan === 'yearly' ? "Yearly Pro" : 
                   user.subscription_plan === 'monthly' ? "Monthly Pro" : "Free"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersManagement;