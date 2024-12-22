import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { LogIn, LogOut, CalendarDays, Menu, Settings } from 'lucide-react';
import SignUpWall from './SignUpWall';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AuthButton = () => {
  const { user, signOut } = useAuth();
  const [showSignUpWall, setShowSignUpWall] = useState(false);
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    if (user) {
      try {
        await signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else {
      setShowSignUpWall(true);
    }
  };

  const handleJournalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/journal');
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/profile');
  };

  // Desktop version (md and up)
  const DesktopButtons = () => (
    <div className="hidden md:flex items-center gap-4">
      {user && (
        <>
          <Button
            onClick={handleJournalClick}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CalendarDays className="h-4 w-4" />
            Dream Journal
          </Button>
          <Button
            onClick={handleProfileClick}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAuthClick}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </>
      )}
      {!user && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAuthClick}
        >
          <LogIn className="h-5 w-5" />
        </Button>
      )}
    </div>
  );

  // Mobile version (smaller than md)
  const MobileMenu = () => (
    <div className="md:hidden">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleJournalClick}>
              <CalendarDays className="h-4 w-4 mr-2" />
              Dream Journal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleProfileClick}>
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAuthClick}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAuthClick}
        >
          <LogIn className="h-5 w-5" />
        </Button>
      )}
    </div>
  );

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <DesktopButtons />
        <MobileMenu />
      </div>

      {showSignUpWall && (
        <SignUpWall onComplete={() => setShowSignUpWall(false)} />
      )}
    </>
  );
};

export default AuthButton;