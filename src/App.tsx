import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import Index from "@/pages/Index";
import Journal from "@/pages/Journal";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Reports from "@/pages/Reports";
import AuthButton from "@/components/AuthButton";
import "./App.css";

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="dream-baba-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <img
                    src="/lovable-uploads/15f3fbaa-0385-4a7e-95ae-ca76c1417489.png"
                    alt="Dream Baba"
                    className="w-12 h-12"
                  />
                  <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    Dream Baba
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <AuthButton />
                </div>
              </div>
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