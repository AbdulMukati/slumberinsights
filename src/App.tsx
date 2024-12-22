import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Journal from "@/pages/Journal";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Reports from "@/pages/Reports";
import AuthButton from "@/components/AuthButton";
import { Brain } from "lucide-react";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-purple-600" />
                <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  Dream Baba
                </h1>
              </div>
              <AuthButton />
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
  );
}

export default App;