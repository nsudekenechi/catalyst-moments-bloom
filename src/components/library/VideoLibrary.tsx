import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Play, Upload, Clock, User, BookOpen, Video } from 'lucide-react';
import VideoModal from '@/components/ui/video-modal';
import { useToast } from '@/hooks/use-toast';

interface VideoContent {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  category: string;
  tags: string[];
  thumbnail: string;
  videoUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  motherhoodStage: 'ttc' | 'pregnant' | 'postpartum' | 'general';
}

const mockVideos: VideoContent[] = [
  {
    id: '1',
    title: 'Postpartum Core Recovery Fundamentals',
    description: 'Learn the essential exercises to safely rebuild your core strength after childbirth. This course covers breathing techniques, gentle movements, and progressive strengthening.',
    duration: '45 min',
    instructor: 'Dr. Sarah Martinez',
    category: 'Core Recovery',
    tags: ['Core', 'Recovery', 'Breathing'],
    thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    level: 'Beginner',
    motherhoodStage: 'postpartum'
  },
  {
    id: '2',
    title: 'Fertility Yoga: Mind-Body Connection',
    description: 'Gentle yoga sequences designed to reduce stress, improve circulation, and create a positive mindset for conception.',
    duration: '30 min',
    instructor: 'Maya Thompson',
    category: 'Fertility Support',
    tags: ['Yoga', 'Stress Relief', 'Mindfulness'],
    thumbnail: 'https://images.unsplash.com/photo-1540206395-68808572332f',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    level: 'Beginner',
    motherhoodStage: 'ttc'
  },
  {
    id: '3',
    title: 'Safe Pregnancy Workouts: Second Trimester',
    description: 'Energizing yet safe workout routines perfect for the second trimester, focusing on strength, flexibility, and preparing for labor.',
    duration: '35 min',
    instructor: 'Jessica Chen',
    category: 'Prenatal Fitness',
    tags: ['Pregnancy', 'Strength', 'Flexibility'],
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    level: 'Intermediate',
    motherhoodStage: 'pregnant'
  },
  {
    id: '4',
    title: 'Nutrition for New Moms',
    description: 'Essential nutrition guidelines for breastfeeding mothers, including meal planning, energy-boosting foods, and supplements.',
    duration: '25 min',
    instructor: 'Dr. Amanda Foster',
    category: 'Nutrition',
    tags: ['Nutrition', 'Breastfeeding', 'Energy'],
    thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    level: 'Beginner',
    motherhoodStage: 'postpartum'
  },
  {
    id: '5',
    title: 'Baby-Wearing Workouts',
    description: 'Safe and effective exercises you can do while wearing your baby, perfect for bonding while staying active.',
    duration: '20 min',
    instructor: 'Rachel Kim',
    category: 'Baby & Me',
    tags: ['Baby Wearing', 'Bonding', 'Cardio'],
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    level: 'Beginner',
    motherhoodStage: 'postpartum'
  }
];

const VideoLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredVideos = mockVideos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleVideoPlay = (video: VideoContent) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleUpload = () => {
    toast({
      title: "Upload Feature Coming Soon",
      description: "Video upload functionality will be available in the next update!",
      duration: 3000,
    });
    setIsUploadModalOpen(false);
  };

  const getVideosByCategory = (category: string) => {
    switch (category) {
      case 'ttc':
        return filteredVideos.filter(v => v.motherhoodStage === 'ttc');
      case 'pregnancy':
        return filteredVideos.filter(v => v.motherhoodStage === 'pregnant');
      case 'postpartum':
        return filteredVideos.filter(v => v.motherhoodStage === 'postpartum');
      default:
        return filteredVideos;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Video Library</h1>
          <p className="text-muted-foreground">
            Expert-led courses and workouts for every stage of motherhood
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search videos..." 
              className="pl-9 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Course Video</DialogTitle>
                <DialogDescription>
                  Share your expertise with other moms by uploading your course videos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Video title" />
                <Input placeholder="Video description" />
                <Input type="file" accept="video/*" />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload}>Upload</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="ttc">TTC Support</TabsTrigger>
          <TabsTrigger value="pregnancy">Pregnancy</TabsTrigger>
          <TabsTrigger value="postpartum">Postpartum</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <VideoGrid videos={filteredVideos} onVideoPlay={handleVideoPlay} />
        </TabsContent>
        
        <TabsContent value="ttc" className="mt-6">
          <VideoGrid videos={getVideosByCategory('ttc')} onVideoPlay={handleVideoPlay} />
        </TabsContent>
        
        <TabsContent value="pregnancy" className="mt-6">
          <VideoGrid videos={getVideosByCategory('pregnancy')} onVideoPlay={handleVideoPlay} />
        </TabsContent>
        
        <TabsContent value="postpartum" className="mt-6">
          <VideoGrid videos={getVideosByCategory('postpartum')} onVideoPlay={handleVideoPlay} />
        </TabsContent>
      </Tabs>

      {selectedVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={selectedVideo.videoUrl}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
};

const VideoGrid = ({ 
  videos, 
  onVideoPlay 
}: { 
  videos: VideoContent[], 
  onVideoPlay: (video: VideoContent) => void 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {videos.map((video) => (
      <VideoCard key={video.id} video={video} onPlay={() => onVideoPlay(video)} />
    ))}
    {videos.length === 0 && (
      <div className="col-span-full text-center py-12">
        <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No videos found</h3>
        <p className="text-muted-foreground">Try adjusting your search or browse different categories.</p>
      </div>
    )}
  </div>
);

const VideoCard = ({ video, onPlay }: { video: VideoContent, onPlay: () => void }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <div className="relative">
      <img 
        src={video.thumbnail} 
        alt={video.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <Button 
          size="lg" 
          className="rounded-full" 
          onClick={onPlay}
        >
          <Play className="h-6 w-6 mr-2" />
          Play Video
        </Button>
      </div>
      <div className="absolute top-2 left-2">
        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
          {video.category}
        </Badge>
      </div>
      <div className="absolute top-2 right-2">
        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
          {video.level}
        </Badge>
      </div>
    </div>
    
    <CardHeader className="pb-2">
      <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
      <CardDescription className="line-clamp-2">{video.description}</CardDescription>
    </CardHeader>
    
    <CardContent>
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          {video.instructor}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {video.duration}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {video.tags.map(tag => (
          <span 
            key={tag}
            className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default VideoLibrary;