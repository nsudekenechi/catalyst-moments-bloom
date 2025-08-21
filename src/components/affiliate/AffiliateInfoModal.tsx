import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Heart, FileText } from 'lucide-react';

interface AffiliateInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const AffiliateInfoModal = ({ isOpen, onClose, onApply }: AffiliateInfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Join Our Affiliate Program
          </DialogTitle>
          <p className="text-center text-muted-foreground text-lg mt-2">
            Earn while empowering other moms on their wellness journey
          </p>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <h3 className="text-xl font-semibold text-center">Why Become an Affiliate?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <DollarSign className="h-12 w-12 mx-auto text-primary mb-3" />
                <h4 className="font-semibold mb-2">Earn Up to 30%</h4>
                <p className="text-sm text-muted-foreground">Commission on all referrals</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 mx-auto text-primary mb-3" />
                <h4 className="font-semibold mb-2">Help Other Moms</h4>
                <p className="text-sm text-muted-foreground">Support their wellness journey</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="h-12 w-12 mx-auto text-primary mb-3" />
                <h4 className="font-semibold mb-2">Marketing Support</h4>
                <p className="text-sm text-muted-foreground">Templates and resources provided</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={onApply} className="flex-1">
              Apply to Become an Affiliate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AffiliateInfoModal;