import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Trophy, Star, Flame } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityPost {
  id: string;
  avatar: string;
  name: string;
  badge: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  tags: string[];
  isNew?: boolean;
  achievement?: string;
}

interface DynamicCommunityFeedProps {
  isTTC?: boolean;
}

export const DynamicCommunityFeed = ({ isTTC = false }: DynamicCommunityFeedProps) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  const basePosts: CommunityPost[] = isTTC ? [
    {
      id: '1',
      avatar: 'ER',
      name: 'Emma Rodriguez',
      badge: 'TTC Journey',
      time: '1 hour ago',
      content: 'Month 8 TTC and feeling hopeful! Started the fertility yoga sequence this week and it\'s been amazing for managing stress. The breathing exercises really help during the two-week wait. Anyone else find mindfulness helpful during their TTC journey?',
      likes: 18,
      comments: 12,
      tags: ['TTC', 'Fertility Yoga', 'Mindfulness'],
      achievement: 'Consistency Champion'
    },
    {
      id: '2',
      avatar: 'LM',
      name: 'Lisa Martinez',
      badge: 'TTC Community',
      time: '4 hours ago',
      content: 'Just wanted to share some love with this amazing community! Using the cycle tracker has helped me understand my body so much better. Knowledge is power! Sending baby dust to everyone on this journey 💕✨',
      likes: 34,
      comments: 15,
      tags: ['TTC Support', 'Cycle Tracking'],
      isNew: true
    },
    {
      id: '3',
      avatar: 'KC',
      name: 'Kimberly Chen',
      badge: 'TTC Nutritionist',
      time: 'Yesterday',
      content: 'Made the fertility smoothie from the nutrition section this morning - so delicious! The combination of spinach, berries, and walnuts is perfect. Here\'s my version with some extra chia seeds for omega-3s.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      likes: 42,
      comments: 9,
      tags: ['TTC Nutrition', 'Fertility Foods']
    }
  ] : [
    {
      id: '1',
      avatar: 'J',
      name: 'Jessica Miller',
      badge: 'Newborn Mom',
      time: '2 hours ago',
      content: 'Just completed my first postpartum workout! It was only 10 minutes but I feel so accomplished. Any other moms finding it hard to get back into fitness with a newborn?',
      likes: 24,
      comments: 8,
      tags: ['Postpartum', 'Fitness'],
      achievement: 'First Step Champion'
    },
    {
      id: '2',
      avatar: 'S',
      name: 'Sarah Thompson',
      badge: 'Toddler Mom',
      time: 'Yesterday',
      content: 'My toddler finally slept through the night after we tried the gentle sleep training method from the Wellness section! I\'ve had my first full night\'s sleep in months. Has anyone else had success with this?',
      likes: 42,
      comments: 16,
      tags: ['Sleep', 'Toddler'],
      isNew: true
    },
    {
      id: '3',
      avatar: 'M',
      name: 'Michelle Kennedy',
      badge: 'Pregnancy',
      time: '2 days ago',
      content: 'I\'ve been doing the prenatal yoga sequence every morning and it\'s made such a difference with my back pain. Sharing a quick pic from today\'s session. Anyone else loving the prenatal workouts?',
      image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
      likes: 38,
      comments: 7,
      tags: ['Pregnancy', 'Yoga']
    }
  ];

  const activityMessages = [
    '🎉 Maria just completed her 7-day workout challenge!',
    '💪 New member Alex joined the Postpartum Recovery group',
    '❤️ 15 moms loved Sarah\'s sleep training tip',
    '🔥 Jessica is on a 5-day workout streak!',
    '⭐ Kim earned the "Nutrition Guru" badge',
    '👥 8 new moms joined the community today',
    '💬 Active discussion in "TTC Support" group',
    '🏆 Elena completed her first month milestone!',
    '🌟 Rachel shared her success story',
    '💕 Community reached 1000 support messages this week!'
  ];

  // Simulate dynamic likes and engagement
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts(currentPosts => 
        currentPosts.map(post => ({
          ...post,
          likes: post.likes + Math.floor(Math.random() * 3),
          comments: post.comments + Math.floor(Math.random() * 2)
        }))
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate recent activity rotation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomActivity = activityMessages[Math.floor(Math.random() * activityMessages.length)];
      setRecentActivity(prev => [randomActivity, ...prev.slice(0, 2)]);
    }, 8000); // New activity every 8 seconds

    // Initialize with some activities
    setRecentActivity([
      activityMessages[0],
      activityMessages[1],
      activityMessages[2]
    ]);

    return () => clearInterval(interval);
  }, []);

  // Initialize posts
  useEffect(() => {
    setPosts(basePosts);
  }, [isTTC]);

  return (
    <div className="space-y-6">
      {/* Live Activity Feed */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-primary animate-pulse" />
            <h3 className="font-semibold text-sm">Live Community Activity</h3>
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className={`text-sm transition-all duration-500 ${index === 0 ? 'font-medium text-primary animate-fade-in' : 'text-muted-foreground'}`}>
                {activity}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Posts */}
      {posts.map((post) => (
        <CommunityPost key={post.id} post={post} />
      ))}
    </div>
  );
};

const CommunityPost = ({ post }: { post: CommunityPost }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const { subscribed, setShowCheckoutModal } = useAuth();

  const handleLike = () => {
    if (!subscribed) {
      setShowCheckoutModal(true);
      return;
    }
    setIsLiked(!isLiked);
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (!subscribed) {
      setShowCheckoutModal(true);
      return;
    }
    // Comment functionality would go here
  };

  const handleShare = () => {
    if (!subscribed) {
      setShowCheckoutModal(true);
      return;
    }
    // Share functionality would go here
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${post.isNew ? 'ring-1 ring-primary/30' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <Avatar className="relative">
            <AvatarFallback>{post.avatar}</AvatarFallback>
            {post.achievement && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="w-2 h-2 text-white" />
              </div>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <p className="font-semibold">{post.name}</p>
              <Badge variant="secondary" className="text-xs">{post.badge}</Badge>
              {post.isNew && <Badge variant="default" className="text-xs bg-primary">NEW</Badge>}
              {post.achievement && (
                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                  <Star className="w-3 h-3 mr-1" />
                  {post.achievement}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{post.time}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="mb-4">{post.content}</p>
          {post.image && (
            <img 
              src={post.image} 
              alt="Post content" 
              className="rounded-lg w-full max-h-80 object-cover mb-4" 
            />
          )}
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{localLikes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleComment}
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.comments}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};