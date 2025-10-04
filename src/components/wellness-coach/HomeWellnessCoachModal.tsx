import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface HomeWellnessCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'coach' | 'user';
  timestamp: Date;
}

const HomeWellnessCoachModal = ({ isOpen, onClose }: HomeWellnessCoachModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addCoachMessage(
          "Hi there! 👋 I'm your Catalyst Mom wellness advisor!\n\n" +
          "We support women through EVERY stage of motherhood:\n\n" +
          "🌸 **TTC** - Fertility support & cycle tracking\n" +
          "🤰 **Pregnancy** - Safe workouts & birth prep\n" +
          "💪 **Postpartum** - Recovery & core rehab\n" +
          "👶 **Toddler Moms** - Staying healthy & strong\n\n" +
          "**What Makes Us Unique:**\n" +
          "• Video courses from certified professionals\n" +
          "• Evidence-based safe birth strategies\n" +
          "• Stage-specific nutrition & fitness plans\n" +
          "• Supportive community of moms\n" +
          "• Expert-backed guidance\n\n" +
          "What would you like to learn about? Ask me anything!"
        );
      }, 500);
    } else if (!isOpen) {
      setMessages([]);
    }
  }, [isOpen]);

  const addCoachMessage = (content: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content,
          sender: 'coach',
          timestamp: new Date()
        }
      ]);
      setIsLoading(false);
    }, 800);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
  };

  const generateResponse = (userMessage: string) => {
    const lowerMsg = userMessage.toLowerCase();

    // TTC (Trying to Conceive) related
    if (lowerMsg.includes('ttc') || lowerMsg.includes('trying to conceive') || lowerMsg.includes('fertility') || lowerMsg.includes('conceive') || lowerMsg.includes('ovulation')) {
      return "Yes! We have comprehensive TTC support! 🌸\n\n" +
        "**TTC Features:**\n" +
        "• Cycle tracking and ovulation prediction\n" +
        "• Fertility-supporting nutrition plans\n" +
        "• TTC-safe workout routines\n" +
        "• Stress management techniques\n" +
        "• Community support from other women TTC\n" +
        "• Educational resources on fertility optimization\n\n" +
        "💚 FREE: Basic cycle tracking, community access, recipes\n" +
        "💎 Premium: Personalized fertility plans, advanced analytics, expert consultations\n\n" +
        "Ready to start your TTC journey with us?";
    }

    // Pregnancy related
    if (lowerMsg.includes('pregnan') || lowerMsg.includes('trimester') || lowerMsg.includes('birth') || lowerMsg.includes('labor')) {
      return "Absolutely! Pregnancy is our specialty! 🤰\n\n" +
        "**Pregnancy Support:**\n" +
        "• Safe exercises for all trimesters\n" +
        "• Birth preparation strategies (including our unique Birth Ball Guide)\n" +
        "• Pregnancy nutrition and meal plans\n" +
        "• Symptom management (sciatica, fatigue, etc.)\n" +
        "• Contraction tracker and kick counter\n" +
        "• Video courses on labor preparation\n" +
        "• Expert guidance from healthcare professionals\n\n" +
        "We help women have safe, empowered births through evidence-based fitness and wellness strategies!\n\n" +
        "Want to explore our pregnancy programs?";
    }

    // Postpartum related
    if (lowerMsg.includes('postpartum') || lowerMsg.includes('after birth') || lowerMsg.includes('recovery') || lowerMsg.includes('new mom')) {
      return "We've got your postpartum journey covered! 💪\n\n" +
        "**Postpartum Features:**\n" +
        "• Core & pelvic floor rehabilitation\n" +
        "• Safe return-to-exercise programs\n" +
        "• Postpartum nutrition support\n" +
        "• Mental wellness resources\n" +
        "• Sleep tracking and optimization\n" +
        "• Breastfeeding support\n" +
        "• Video courses on recovery\n" +
        "• Community of postpartum moms\n\n" +
        "Our professionals guide you through safe, effective recovery at your own pace!\n\n" +
        "Ready to heal and thrive postpartum?";
    }

    // Workout/Fitness related
    if (lowerMsg.includes('workout') || lowerMsg.includes('fitness') || lowerMsg.includes('exercise') || lowerMsg.includes('video')) {
      return "Our workout programs are designed by professionals! 💪\n\n" +
        "**What We Offer:**\n" +
        "• Stage-specific programs (TTC, pregnancy, postpartum)\n" +
        "• Video courses with professional guidance\n" +
        "• Birth Ball Guide for labor prep\n" +
        "• Prenatal & postpartum workouts\n" +
        "• Safe modifications for every level\n" +
        "• Progress tracking features\n\n" +
        "**FREE Access:**\n" +
        "✓ Beginner workout videos\n" +
        "✓ Basic fitness guides\n\n" +
        "**Premium Access:**\n" +
        "✓ Full video course library\n" +
        "✓ Personalized workout plans\n" +
        "✓ Advanced programs\n\n" +
        "Want to start moving safely today?";
    }

    // Nutrition/Meal related
    if (lowerMsg.includes('nutrition') || lowerMsg.includes('meal') || lowerMsg.includes('food') || lowerMsg.includes('recipe') || lowerMsg.includes('diet')) {
      return "Nutrition is crucial at every stage! 🥗\n\n" +
        "**Nutrition Support:**\n" +
        "• Stage-specific meal plans (TTC, pregnancy, postpartum)\n" +
        "• Healthy recipes with calorie tracking\n" +
        "• Food safety guides for pregnancy\n" +
        "• Fertility-supporting nutrition\n" +
        "• Breastfeeding nutrition plans\n" +
        "• Professional nutritionist insights\n\n" +
        "**FREE Features:**\n" +
        "✓ Recipe library access\n" +
        "✓ Basic meal planning tools\n" +
        "✓ Calorie checker\n\n" +
        "**Premium Features:**\n" +
        "✓ Personalized meal plans\n" +
        "✓ Custom nutrition tracking\n" +
        "✓ Expert consultations\n\n" +
        "Ready to fuel your body right?";
    }

    // Professional/Expert related
    if (lowerMsg.includes('professional') || lowerMsg.includes('expert') || lowerMsg.includes('doctor') || lowerMsg.includes('specialist')) {
      return "Yes! We work with certified professionals! 👩‍⚕️\n\n" +
        "**Our Expert Team:**\n" +
        "• Certified fitness trainers\n" +
        "• Registered nutritionists\n" +
        "• Pelvic floor specialists\n" +
        "• Mental health professionals\n" +
        "• Birth educators\n\n" +
        "All our programs are developed with professional guidance to ensure safety and effectiveness at every stage of motherhood!\n\n" +
        "Want to learn more about our expert-backed approach?";
    }

    // Courses/Guides related
    if (lowerMsg.includes('course') || lowerMsg.includes('guide') || lowerMsg.includes('learn') || lowerMsg.includes('education')) {
      return "We have extensive educational resources! 📚\n\n" +
        "**Video Courses & Guides:**\n" +
        "• Birth Ball Guide (labor preparation)\n" +
        "• Prenatal fitness video series\n" +
        "• Postpartum recovery courses\n" +
        "• Nutrition education modules\n" +
        "• Mental wellness workshops\n" +
        "• Safe exercise technique videos\n\n" +
        "**FREE Content:**\n" +
        "✓ Beginner guides\n" +
        "✓ Selected video courses\n\n" +
        "**Premium Content:**\n" +
        "✓ Full course library\n" +
        "✓ Expert-led workshops\n" +
        "✓ Downloadable resources\n\n" +
        "Ready to start learning?";
    }

    // Community/Support related
    if (lowerMsg.includes('community') || lowerMsg.includes('support') || lowerMsg.includes('connect') || lowerMsg.includes('group') || lowerMsg.includes('mom')) {
      return "Our community is the heart of Catalyst Mom! 👥\n\n" +
        "**Community Features:**\n" +
        "• Stage-specific groups (TTC, pregnancy, postpartum, toddler)\n" +
        "• Shared experiences and support\n" +
        "• Challenges and events\n" +
        "• Comment and engage on all posts\n" +
        "• Make lasting friendships\n" +
        "• 24/7 peer support\n\n" +
        "The community is FREE and open to everyone! Connect with thousands of moms at the same stage as you.\n\n" +
        "Want to join our supportive community?";
    }

    // Features/App capabilities
    if (lowerMsg.includes('feature') || lowerMsg.includes('app') || lowerMsg.includes('what can') || lowerMsg.includes('capabilities')) {
      return "Here's what Catalyst Mom offers by stage:\n\n" +
        "**TTC Stage:**\n" +
        "✓ Cycle tracking\n" +
        "✓ Fertility nutrition plans\n" +
        "✓ TTC-safe workouts\n" +
        "✓ Stress management tools\n\n" +
        "**Pregnancy:**\n" +
        "✓ Trimester-specific workouts\n" +
        "✓ Birth prep strategies\n" +
        "✓ Contraction tracker\n" +
        "✓ Kick counter\n" +
        "✓ Safe nutrition guides\n\n" +
        "**Postpartum:**\n" +
        "✓ Recovery programs\n" +
        "✓ Core rehabilitation\n" +
        "✓ Mental wellness support\n" +
        "✓ Sleep tracking\n\n" +
        "**All Stages:**\n" +
        "✓ Video courses\n" +
        "✓ Community access\n" +
        "✓ Expert guidance\n" +
        "✓ Progress tracking\n\n" +
        "Which stage are you interested in?";
    }

    // Pricing/Premium features
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('premium') || lowerMsg.includes('subscription') || lowerMsg.includes('pay')) {
      if (!user) {
        return "Here's our pricing structure:\n\n" +
          "**FREE Forever:**\n" +
          "✓ Community access & commenting\n" +
          "✓ Basic workout videos\n" +
          "✓ Recipe library\n" +
          "✓ Wellness tracking\n" +
          "✓ Educational content\n\n" +
          "**Premium Membership:**\n" +
          "✓ Full video course library\n" +
          "✓ Personalized meal & workout plans\n" +
          "✓ Advanced AI wellness coach\n" +
          "✓ Expert Q&A sessions\n" +
          "✓ Advanced tracking & analytics\n" +
          "✓ All professional guides\n\n" +
          "Start with our FREE features, upgrade anytime for full access!\n\n" +
          "Ready to create your free account?";
      } else {
        return "Upgrade to Premium for full access:\n\n" +
          "**Premium Benefits:**\n" +
          "• Fully personalized AI coaching\n" +
          "• Custom meal & workout plans\n" +
          "• Complete video course library\n" +
          "• Expert consultations\n" +
          "• Advanced features\n\n" +
          "Visit your dashboard to see pricing and upgrade!";
      }
    }

    // Safe birth strategies
    if (lowerMsg.includes('safe birth') || lowerMsg.includes('birth plan') || lowerMsg.includes('labor') || lowerMsg.includes('delivery')) {
      return "Safe birth preparation is our specialty! 🌟\n\n" +
        "**Our Unique Strategies:**\n" +
        "• Birth Ball Guide - Professional video course\n" +
        "• Evidence-based labor positions\n" +
        "• Breathing techniques\n" +
        "• Partner support training\n" +
        "• Pain management strategies\n" +
        "• Pelvic floor preparation\n" +
        "• Mental preparation techniques\n\n" +
        "Developed with healthcare professionals to help you have an empowered, safe birth experience!\n\n" +
        "Want to explore our birth prep programs?";
    }

    // Getting started/sign up
    if (lowerMsg.includes('sign up') || lowerMsg.includes('start') || lowerMsg.includes('join') || lowerMsg.includes('account') || lowerMsg.includes('register')) {
      if (!user) {
        return "Let's get you started! 🎉\n\n" +
          "**Getting Started:**\n" +
          "1️⃣ Create your FREE account\n" +
          "2️⃣ Tell us your motherhood stage\n" +
          "3️⃣ Access free workouts, recipes & community\n" +
          "4️⃣ Upgrade to Premium anytime for full features\n\n" +
          "**You'll Immediately Access:**\n" +
          "✓ Community groups\n" +
          "✓ Basic workout videos\n" +
          "✓ Recipe library\n" +
          "✓ Wellness tracking tools\n\n" +
          "Ready to join thousands of moms? Click below to sign up!";
      } else {
        return "You're already part of the Catalyst Mom family! 🎉\n\n" +
          "**Next Steps:**\n" +
          "• Complete your wellness profile\n" +
          "• Join community groups\n" +
          "• Start a workout program\n" +
          "• Explore recipes\n" +
          "• Upgrade to Premium for personalized AI coaching\n\n" +
          "Head to your dashboard to get started!";
      }
    }

    // General/Default response
    return "I'm here to help you understand everything Catalyst Mom offers! 💚\n\n" +
      "**We Support Every Stage:**\n" +
      "🌸 TTC (Trying to Conceive)\n" +
      "🤰 Pregnancy (all trimesters)\n" +
      "💪 Postpartum Recovery\n" +
      "👶 Toddler Moms\n\n" +
      "**What We Provide:**\n" +
      "• Video courses & professional guides\n" +
      "• Stage-specific workouts\n" +
      "• Nutrition plans & recipes\n" +
      "• Safe birth strategies\n" +
      "• Community support\n" +
      "• Expert guidance\n\n" +
      "What would you like to know more about?";
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMsg = inputMessage.trim();
    addUserMessage(userMsg);
    setInputMessage('');

    setTimeout(() => {
      const response = generateResponse(userMsg);
      addCoachMessage(response);

      // If message mentions sign up and user is not logged in, show CTA after response
      if (!user && (userMsg.toLowerCase().includes('sign up') || userMsg.toLowerCase().includes('join') || userMsg.toLowerCase().includes('start'))) {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }, 500);
  };

  const handleSignUp = () => {
    onClose();
    navigate('/auth/register');
    toast({
      title: "Let's get started!",
      description: "Create your free account to access all features.",
    });
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  const QUICK_SUGGESTIONS = [
    "Do you have TTC stuff?",
    "Tell me about pregnancy support",
    "How do you help with safe birth?",
    "What features do you have?",
    "What's included for free?"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-lg">
                    💚
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div>
                <DialogTitle className="font-semibold text-foreground">Catalyst Mom Coach</DialogTitle>
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  Wellness Advisor
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                message.sender === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              {message.sender === 'coach' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                    💚
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-2xl px-4 py-2 max-w-full",
                  message.sender === 'user'
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted/50 text-foreground rounded-bl-md"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                  💚
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 0 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1.5 px-3"
                  onClick={() => {
                    setInputMessage(suggestion);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {!user && messages.length > 2 && (
          <div className="px-4 pb-2">
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              onClick={handleSignUp}
            >
              Get Started Free
            </Button>
          </div>
        )}

        {user && messages.length > 2 && (
          <div className="px-4 pb-2">
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              onClick={handleGoToDashboard}
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {!user ? "Sign up for free to unlock full features!" : "Upgrade to Premium for AI-powered coaching"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HomeWellnessCoachModal;
