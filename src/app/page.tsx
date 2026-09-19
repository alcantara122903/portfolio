import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollExperience } from "@/components/scroll/ScrollExperience";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { GitHubStrip } from "@/components/sections/GitHubStrip";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <ScrollExperience />
      <Navbar />
      <SmoothScroll>
        <main className="relative z-10 flex-1">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <ProcessSection />
          <JourneySection />
          <GitHubStrip />
          <ContactSection />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
