import ParticleCanvas from "@/components/ParticleCanvas";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import AppWindow from "@/components/AppWindow";
import HeroSection from "@/components/landing/HeroSection";
import DetectionModules from "@/components/landing/DetectionModules";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProblemSection from "@/components/landing/ProblemSection";
import AIArchitecture from "@/components/landing/AIArchitecture";
import TeamSection from "@/components/landing/TeamSection";
import ContactCTA from "@/components/landing/ContactCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <AppWindow>
      <ParticleCanvas />
      <TopNav />
      <HeroSection />
      <DetectionModules />
      <HowItWorks />
      <FeaturesSection />
      <ProblemSection />
      <AIArchitecture />
      <TeamSection />
      <ContactCTA />
      <Footer />
      <BottomNav />
    </AppWindow>
  );
};

export default Index;
