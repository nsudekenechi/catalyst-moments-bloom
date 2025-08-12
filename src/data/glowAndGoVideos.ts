export type GlowVideo = {
  id: string;
  title: string;
  url: string;
  duration?: string;
  description?: string;
};

export const GLOW_AND_GO_VIDEOS: GlowVideo[] = [
  {
    id: "intro",
    title: "Program Introduction",
    url: "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/glow%20and%20go/Intro.mp4",
    duration: "2 min",
    description: "Quick overview of what to expect in Glow & Go."
  }
  // Add more videos here by appending objects with id, title, and url
];
