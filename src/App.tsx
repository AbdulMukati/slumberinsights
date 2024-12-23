import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, CalendarDays, LineChart, Settings, Shield } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "@/pages/Index";
import Journal from "@/pages/Journal";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Reports from "@/pages/Reports";
import AuthButton from "@/components/AuthButton";

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};

const Navigation = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        console.log("Checking admin status for user:", user.id);
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        
        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
          return;
        }

        console.log("Admin status check result:", profile);
        setIsAdmin(profile?.is_admin || false);
      } catch (error) {
        console.error("Error in admin status check:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Button variant="ghost" asChild className="flex items-center gap-2">
        <Link to="/journal">
          <CalendarDays className="h-5 w-5" />
          <span className="hidden md:inline">Dream Journal</span>
        </Link>
      </Button>
      <Button variant="ghost" asChild className="flex items-center gap-2">
        <Link to="/reports">
          <LineChart className="h-5 w-5" />
          <span className="hidden md:inline">Reports</span>
        </Link>
      </Button>
      <Button variant="ghost" asChild className="flex items-center gap-2">
        <Link to="/profile">
          <Settings className="h-5 w-5" />
          <span className="hidden md:inline">Profile</span>
        </Link>
      </Button>
      {isAdmin && (
        <Button variant="ghost" asChild className="flex items-center gap-2">
          <Link to="/admin">
            <Shield className="h-5 w-5" />
            <span className="hidden md:inline">Admin</span>
          </Link>
        </Button>
      )}
    </>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="dream-baba-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:from-purple-900 dark:to-blue-900 dark:bg-gradient-to-b">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                  <Link to="/" className="flex items-center gap-4">
                    <img
                      src="/lovable-uploads/9d7c542e-59e6-4b50-873b-f6410e5195ed.png"
                      alt="Dream Baba"
                      className="w-12 h-12"
                    />
                    <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      Dream Baba
                    </h1>
                  </Link>
                  <div className="flex items-center gap-4">
                    <Navigation />
                    <ThemeToggle />
                    <AuthButton />
                  </div>
                </div>
              </div>
            </nav>
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;