export interface PersonalInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  status: string;
  education: string;
  specialization: string;
  resumePath: string;
  resumePdfPath: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "email";
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ProjectContribution {
  title: string;
  items: string[];
}

export interface ArchitectureStep {
  label: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  label?: string;
  summary: string;
  description?: string;
  features?: string[];
  technicalImplementation?: string[];
  contributions: ProjectContribution[];
  technologies: string[];
  architecture: ArchitectureStep[];
  team?: string;
  teamNotes?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  screenshotPath?: string;
  screenshotSrc?: string;
  additionalScreenshots?: { src: string; alt: string; label: string }[];
  webScreenshot?: {
    src: string;
    alt: string;
    label: string;
  };
  additionalWebScreenshots?: { src: string; alt: string; label: string }[];
  webStackLayers?: { layer: string; technology: string }[];
  screenshotPlaceholder: string;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface SkillFlow {
  id: string;
  steps: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface EducationEntry {
  period: string;
  institution: string;
  degree: string;
  specialization?: string;
  location: string;
}

export interface Certification {
  title: string;
  issuer: string;
  issued: string;
  validUntil: string;
  credentialId: string;
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
}

export interface PortfolioStackItem {
  category: string;
  items: string[];
}

export interface TerminalLine {
  command: string;
  output: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  socials: SocialLink[];
  navigation: NavItem[];
  projects: Project[];
  skills: SkillCategory[];
  skillFlows: SkillFlow[];
  process: ProcessStep[];
  education: EducationEntry[];
  certification: Certification;
  contact: ContactInfo;
  portfolioStack: PortfolioStackItem[];
  terminal: TerminalLine[];
}
