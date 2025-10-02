import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SubscriptionButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
}

const SubscriptionButton = ({ 
  variant = "default", 
  size = "default", 
  className,
  children = "Subscribe Now",
  monthlyPriceId = "price_1S7xeRCNwyQa1NiQbqju7ts7", // Default monthly price
  yearlyPriceId = "price_1S7xeRCNwyQa1NiQbqju7ts7"  // Replace with actual yearly price ID
}: SubscriptionButtonProps) => {
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          monthly_price_id: monthlyPriceId,
          yearly_price_id: yearlyPriceId
        }
      });
      
      if (error) {
        console.error('Checkout error:', error);
        toast.error('Failed to create checkout session');
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to start subscription process');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSubscribe}
    >
      {children}
    </Button>
  );
};

export default SubscriptionButton;