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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Shield } from "lucide-react";

const UsersManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // First get all profiles
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
      return;
    }

    // Then get auth users data
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    
    // Combine the data
    const enrichedProfiles = profiles.map(profile => {
      const authUser = authUsers?.users.find(u => u.id === profile.id);
      return {
        ...profile,
        email: authUser?.email,
        created_at: authUser?.created_at
      };
    });

    setUsers(enrichedProfiles);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send reset password email",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Password reset email sent",
    });
  };

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: !currentStatus })
      .eq("id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive",
      });
      return;
    }

    fetchUsers();
    toast({
      title: "Success",
      description: `User ${currentStatus ? "removed from" : "added to"} admin role`,
    });
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.is_admin ? "Yes" : "No"}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => resetPassword(user.email)}
                    title="Reset Password"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleAdmin(user.id, user.is_admin)}
                    title={user.is_admin ? "Remove Admin" : "Make Admin"}
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersManagement;