import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EmbeddedCheckoutProps {
  priceId: string;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Stripe: any;
  }
}

const EmbeddedCheckout = ({ priceId, onSuccess }: EmbeddedCheckoutProps) => {
  const checkoutRef = useRef<HTMLDivElement>(null);
  const stripeCheckoutRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeCheckout = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Clean up any existing checkout instance
        if (stripeCheckoutRef.current) {
          try {
            stripeCheckoutRef.current.unmount();
          } catch (e) {
            console.log('Cleanup error:', e);
          }
          stripeCheckoutRef.current = null;
        }

        // Get client secret from edge function
        const { data, error: invokeError } = await supabase.functions.invoke('create-checkout', {
          body: { priceId }
        });

        if (invokeError) {
          throw new Error(invokeError.message);
        }

        if (!data?.clientSecret) {
          throw new Error('No client secret received');
        }

        // Initialize Stripe
        if (!window.Stripe) {
          throw new Error('Stripe.js failed to load');
        }

        const stripe = window.Stripe('pk_live_51S4sMACNwyQa1NiQmZrjG7oSMVWDUNPdqMWKbGmkk1f8KXcnqXQITGVP2XsI9aXLMxMOQSX8CtU2nEAoNSmrCdGN00aIWz1BSl');

        if (!mounted) return;

        // Mount embedded checkout
        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret: data.clientSecret,
        });

        if (!mounted) {
          checkout.unmount();
          return;
        }

        stripeCheckoutRef.current = checkout;

        if (checkoutRef.current) {
          checkout.mount(checkoutRef.current);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Checkout initialization error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize checkout';
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
      }
    };

    initializeCheckout();

    return () => {
      mounted = false;
      // Properly unmount the checkout on cleanup
      if (stripeCheckoutRef.current) {
        try {
          stripeCheckoutRef.current.unmount();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
        stripeCheckoutRef.current = null;
      }
    };
  }, [priceId]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading secure checkout...</p>
          </div>
        </div>
      )}
      <div ref={checkoutRef} />
    </div>
  );
};

export default EmbeddedCheckout;
