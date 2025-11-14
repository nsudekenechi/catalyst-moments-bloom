import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: React.ReactNode;
  shareText?: string;
  fileName?: string;
}

export const ShareModal = ({ 
  open, 
  onOpenChange, 
  content,
  shareText = "Check out my transformation journey with Catalyst Mom! 🌟",
  fileName = "catalyst-mom-achievement"
}: ShareModalProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!contentRef.current) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${fileName}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: 'Downloaded!',
        description: 'Your achievement has been saved.',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?ref=social_share`;
    navigator.clipboard.writeText(`${shareText}\n\n${url}`);
    setCopied(true);
    
    toast({
      title: 'Copied!',
      description: 'Share text copied to clipboard.',
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!contentRef.current || !navigator.share) {
      toast({
        title: 'Share not supported',
        description: 'Please use download instead.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `${fileName}.png`, { type: 'image/png' });
        
        await navigator.share({
          files: [file],
          title: 'My Catalyst Mom Journey',
          text: shareText,
        });

        toast({
          title: 'Shared!',
          description: 'Thanks for spreading the word!',
        });
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Achievement</DialogTitle>
          <DialogDescription>
            Share your progress and inspire others on their journey!
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="flex justify-center p-6 bg-muted/50 rounded-lg">
              <div ref={contentRef}>
                {content}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={handleDownload} 
                className="w-full gap-2" 
                variant="default"
                disabled={downloading}
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Downloading...' : 'Download Image'}
              </Button>

              {navigator.share && (
                <Button 
                  onClick={handleNativeShare} 
                  className="w-full gap-2"
                  variant="secondary"
                >
                  <Share2 className="w-4 h-4" />
                  Share to Social Media
                </Button>
              )}

              <Button 
                onClick={handleCopyLink} 
                className="w-full gap-2"
                variant="outline"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Share Text
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2 font-semibold">Share Text Preview:</p>
              <p className="text-sm">{shareText}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {window.location.origin}?ref=social_share
              </p>
            </div>

            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Tip:</strong> Share your achievements on Instagram, Facebook, or Twitter to inspire others 
                and earn referral rewards when friends join using your link!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
