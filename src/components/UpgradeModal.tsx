import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'dreams' | 'images';
}

export default function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (priceId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Upgrade to Dream Baba Pro
          </DialogTitle>
          <DialogDescription className="text-center text-lg mb-6">
            {reason === 'dreams' 
              ? "You've reached your daily limit of free dream interpretations."
              : "Unlock AI-generated dream visualizations"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 space-y-4 hover:border-purple-500 transition-colors">
            <h3 className="text-xl font-semibold text-center">Monthly</h3>
            <p className="text-3xl font-bold text-center text-purple-600">$7<span className="text-base font-normal">/month</span></p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unlimited dream interpretations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>AI dream visualizations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe('price_1QYmYbKILnKvelWHQ3cU5LWn')}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Subscribe Monthly"}
            </Button>
          </div>

          <div className="border rounded-lg p-6 space-y-4 hover:border-purple-500 transition-colors bg-purple-50 dark:bg-purple-900/10">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Yearly</h3>
              <p className="text-sm text-purple-600">Save 70%</p>
            </div>
            <p className="text-3xl font-bold text-center text-purple-600">$25<span className="text-base font-normal">/year</span></p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Everything in monthly</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>2 months free</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Early access to new features</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700" 
              onClick={() => handleSubscribe('price_1QYma1KILnKvelWHaXHP36Gd')}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Subscribe Yearly"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}