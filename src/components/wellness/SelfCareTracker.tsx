import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SelfCareTrackerProps {
  trigger?: React.ReactNode;
}

const selfCareActivities = [
  { id: 'meditation', label: 'Meditation/Mindfulness', duration: '5-10 min' },
  { id: 'skincare', label: 'Skincare routine', duration: '10-15 min' },
  { id: 'reading', label: 'Reading', duration: '15-30 min' },
  { id: 'bath', label: 'Relaxing bath', duration: '20-30 min' },
  { id: 'music', label: 'Listen to music', duration: '10-20 min' },
  { id: 'journaling', label: 'Journaling', duration: '10-15 min' },
  { id: 'stretching', label: 'Gentle stretching', duration: '10-15 min' },
  { id: 'tea', label: 'Mindful tea/coffee break', duration: '5-10 min' },
];

export const SelfCareTracker = ({ trigger }: SelfCareTrackerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleActivityChange = (activityId: string, checked: boolean) => {
    if (checked) {
      setSelectedActivities([...selectedActivities, activityId]);
    } else {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    }
  };

  const handleSubmit = async () => {
    if (selectedActivities.length === 0) {
      toast({
        title: "Please select at least one activity",
        description: "Choose the self-care activities you completed today.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Update self-care status in localStorage
      if (user) {
        const storedWellness = localStorage.getItem(`wellness_${user.id}`);
        const wellness = storedWellness ? JSON.parse(storedWellness) : [];
        
        // Update today's entry or create new one
        const today = new Date().toDateString();
        const todayEntry = wellness.find((entry: any) => 
          new Date(entry.created_at).toDateString() === today
        );
        
        if (todayEntry) {
          todayEntry.self_care_completed = true;
          todayEntry.notes = notes || todayEntry.notes;
        } else {
          wellness.unshift({
            id: Date.now().toString(),
            mood_score: 7,
            energy_level: 7,
            sleep_hours: 8,
            stress_level: 3,
            self_care_completed: true,
            hydration_glasses: 4,
            created_at: new Date().toISOString(),
            notes: notes || 'Completed self-care activities'
          });
        }
        
        localStorage.setItem(`wellness_${user.id}`, JSON.stringify(wellness));
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Self-care logged successfully!",
        description: `Great job completing ${selectedActivities.length} self-care activities today!`,
      });
      
      setOpen(false);
      setSelectedActivities([]);
      setNotes('');
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error logging self-care",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Heart className="mr-2 h-4 w-4" />
            Add Self-Care Activity
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Self-Care Tracker
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-500" />
              What self-care activities did you do today?
            </Label>
            
            <div className="space-y-3">
              {selfCareActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={activity.id}
                    checked={selectedActivities.includes(activity.id)}
                    onCheckedChange={(checked) => 
                      handleActivityChange(activity.id, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={activity.id} 
                      className="text-sm font-medium cursor-pointer"
                    >
                      {activity.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{activity.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Additional Notes (Optional)</Label>
            <Textarea
              placeholder="How did these activities make you feel? Any other self-care you did?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Log Self-Care"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};