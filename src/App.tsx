import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Journal from "@/pages/Journal";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Reports from "@/pages/Reports";
import AuthButton from "@/components/AuthButton";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthButton />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;