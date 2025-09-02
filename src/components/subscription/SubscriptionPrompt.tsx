import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionPromptProps {
  title?: string;
  description?: string;
  action?: string;
}

const SubscriptionPrompt = ({ 
  title = "Premium Feature", 
  description = "Subscribe to unlock this feature and access all premium content.",
  action = "Subscribe Now"
}: SubscriptionPromptProps) => {
  const { setShowCheckoutModal } = useAuth();

  return (
    <Card className="border-2 border-dashed border-muted">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-4">
          <div className="rounded-full bg-muted p-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 rounded-full bg-primary p-1">
            <Star className="h-3 w-3 text-primary-foreground fill-current" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
        <Button 
          onClick={() => setShowCheckoutModal(true)}
          size="lg"
          className="rounded-full"
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPrompt;