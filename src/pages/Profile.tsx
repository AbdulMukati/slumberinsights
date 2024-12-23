import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch profile data
  useEffect(() => {
    const getProfile = async () => {
      if (!user?.id) return;

      try {
        console.log("Fetching profile for user:", user.id);
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Profile fetch error:", error);
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create it
            console.log("Creating new profile for user:", user.id);
            const { error: insertError } = await supabase
              .from("profiles")
              .insert([{ 
                id: user.id, 
                full_name: user.email?.split('@')[0] || 'User'
              }]);
            
            if (insertError) {
              console.error("Profile creation error:", insertError);
              toast({
                title: "Error",
                description: "Could not create profile",
                variant: "destructive",
              });
            } else {
              setFullName(user.email?.split('@')[0] || 'User');
            }
          } else {
            toast({
              title: "Error",
              description: "Could not fetch profile",
              variant: "destructive",
            });
          }
          return;
        }

        if (data) {
          console.log("Profile data received:", data);
          setFullName(data.full_name);
        }
      } catch (err) {
        console.error("Unexpected error in getProfile:", err);
      }
    };

    getProfile();
  }, [user, toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !fullName.trim()) return;

    setIsLoading(true);
    console.log("Updating profile for user:", user.id);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", user.id);

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }

      toast({
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error in handleUpdateProfile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        description: "Password reset email sent",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Error",
        description: "Failed to send reset password email",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dreams
      </Button>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your profile information and manage your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Account Security</h3>
              <Button
                variant="outline"
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;