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

interface Profile {
  id: string;
  full_name: string;
  created_at: string;
  is_admin: boolean;
  subscribed: boolean;
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
      setUsers(data || []);
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

  const toggleSubscriptionStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ subscribed: !currentStatus })
        .eq("id", userId);

      if (error) throw error;
      await fetchUsers();
      toast({
        title: "Success",
        description: "Subscription status updated successfully",
      });
    } catch (error) {
      console.error("Error updating subscription status:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription status",
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
            <TableHead>Subscription Status</TableHead>
            <TableHead>Actions</TableHead>
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
                <Switch
                  checked={user.subscribed}
                  onCheckedChange={() => toggleSubscriptionStatus(user.id, user.subscribed)}
                />
              </TableCell>
              <TableCell className="space-x-2">
                <span className={user.is_admin ? "text-green-600" : "text-gray-600"}>
                  {user.is_admin ? "Admin" : "User"}
                </span>
                <span className={user.subscribed ? "text-purple-600" : "text-gray-600"}>
                  {user.subscribed ? "Pro" : "Free"}
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