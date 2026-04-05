import React, { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import VideoModal from "@/components/ui/video-modal";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import FoodCalorieCheckerCard from "@/components/home/FoodCalorieCheckerCard";
import SEO from "@/components/seo/SEO";

const Index = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [isWelcomeVideo, setIsWelcomeVideo] = useState(false);

  const openVideoModal = (url: string, title: string) => {
    setVideoUrl(url);
    setVideoTitle(title);
    setIsWelcomeVideo(false);
    setVideoModalOpen(true);
  };

  const openWelcomeVideo = () => {
    setIsWelcomeVideo(true);
    setVideoModalOpen(true);
  };

  const [splashScreen, setSplashScreen] = useState(
    sessionStorage.getItem("splashScreen") === "false" ? false : true,
  );
  const [splashLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!splashScreen) return;

    const timer = setTimeout(() => {
      setSplashScreen(false);
      sessionStorage.setItem("splashScreen", "false");
    }, 1000);

    setTimeout(() => {
      setLoading(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout withPadding={false}>
      <SEO
        title="Catalyst Mom – Wellness, Fitness & Nutrition for Moms"
        description="Personalized workouts, meal plans, and community support for every stage of motherhood."
      />
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white text-white text-center p-2 h-screen top-0 z-50 flex items-center justify-center ${splashScreen ? "scale-100" : "scale-0"} `}
      >
        <img
          src="/splash.png"
          className={`w-[200px] h-[200px] object-cover ${!splashLoading ? "scale-0" : "scale-100"} duration-300 `}
        />
      </div>
      {/* Hero Section */}
      <HeroSection onWatchVideo={openWelcomeVideo} />

      {/* Food Calorie Checker Feature */}
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Try Our Latest Feature
        </h2>
        <div className="max-w-lg mx-auto">
          <FoodCalorieCheckerCard />
        </div>
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Testimonial Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection onWatchDemo={openWelcomeVideo} />

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={videoUrl}
        title={videoTitle}
        isWelcomeVideo={isWelcomeVideo}
      />
    </PageLayout>
  );
};

export default Index;
