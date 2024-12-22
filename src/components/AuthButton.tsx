import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { LogIn, LogOut, User } from 'lucide-react';
import SignUpWall from './SignUpWall';

const AuthButton = () => {
  const { user, signOut } = useAuth();
  const [showSignUpWall, setShowSignUpWall] = useState(false);

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

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4"
        onClick={handleAuthClick}
      >
        {user ? (
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <LogOut className="h-5 w-5" />
          </div>
        ) : (
          <LogIn className="h-5 w-5" />
        )}
      </Button>

      {showSignUpWall && (
        <SignUpWall onComplete={() => setShowSignUpWall(false)} />
      )}
    </>
  );
};

export default AuthButton;