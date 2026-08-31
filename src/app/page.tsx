import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollExperience } from "@/components/scroll/ScrollExperience";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { CertificationSection } from "@/components/sections/CertificationSection";
import { GitHubSection } from "@/components/sections/GitHubSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <ScrollExperience />
      <Navbar />
      <main className="relative z-10 flex-1">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ProcessSection />
        <EducationSection />
        <CertificationSection />
        <GitHubSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
