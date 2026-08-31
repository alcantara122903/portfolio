import type { PortfolioData } from "@/types/portfolio";

export const portfolio: PortfolioData = {
  personal: {
    firstName: "Ivan",
    lastName: "Alcantara",
    fullName: "Ivan Vasquez Alcantara",
    role: "Mobile & Web Developer",
    tagline: "Building systems that connect people, data, and experiences.",
    bio: "Fourth-year Information Technology student specializing in Mobile and Web Applications with hands-on experience in web and mobile development, API integration, databases, QR workflows, OCR integration, and responsive interfaces.",
    location: "Lipa City, Philippines",
    status: "Open to Internship Opportunities",
    education: "BS Information Technology",
    specialization: "Mobile & Web Applications",
    resumePath: "/resume",
    resumePdfPath: "/resume/Ivan-Alcantara-Resume.pdf",
  },

  socials: [
    {
      label: "GitHub",
      href: "https://github.com/alcantara122903",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ivan-alcantara-9265903b5",
      icon: "linkedin",
    },
    {
      label: "Email",
      href: "mailto:ivanalcantara132@gmail.com",
      icon: "email",
    },
  ],

  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Process", href: "#process" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ],

  projects: [
    {
      id: "nu-secure",
      title: "NU-SECURE",
      subtitle: "Smart Visitor Monitoring System",
      role: "Mobile & Web Application Developer · Capstone Team Member",
      summary:
        "A smart visitor monitoring system with a mobile guard application and web-based visitor monitoring portal, supporting visitor registration, QR-based identification and validation, enrollee progress tracking, office validation, and visitor exit processing.",
      contributions: [
        {
          title: "What I Worked On",
          items: [
            "Mobile application development",
            "Web platform development",
            "QR workflows",
            "API integration",
            "Database integration",
            "OCR workflow",
            "Testing",
            "Troubleshooting",
            "End-to-end workflow improvement",
          ],
        },
        {
          title: "Mobile Features",
          items: [
            "Visitor registration",
            "QR scanning",
            "Office validation",
            "Enrollee progress",
            "Visitor exit processing",
          ],
        },
        {
          title: "Web Platform",
          items: [
            "Laravel web platform and admin system",
            "Visitor Monitoring System (VMS) portal",
            "REST API endpoints for mobile integration",
            "Visitor type selection workflows",
            "Guard on-duty management interface",
            "Authentication and session handling",
            "Database migrations and backend logic",
          ],
        },
      ],
      technologies: [
        "React Native",
        "Expo",
        "TypeScript",
        "Laravel",
        "PHP",
        "Vite",
        "Supabase",
        "PostgreSQL",
        "REST API",
        "OCR",
      ],
      architecture: [
        { label: "Visitor" },
        { label: "React Native App · Web Platform" },
        { label: "Laravel REST API" },
        { label: "Supabase / PostgreSQL" },
        { label: "Office / Guard Validation" },
      ],
      team: "Four-member capstone team",
      teamNotes:
        "The team designed, tested, troubleshooted, and improved end-to-end visitor monitoring functionality.",
      featured: true,
      liveUrl: "https://www.nu-secure.com/",
      screenshotPath: "/projects/nu-secure",
      screenshotSrc: "/projects/nu-secure/guard-portal.png",
      additionalScreenshots: [
        {
          src: "/projects/nu-secure/login.png",
          alt: "NU-SECURE login screen",
          label: "Login",
        },
      ],
      webScreenshot: {
        src: "/projects/nu-secure/web-portal.png",
        alt: "NU-SECURE visitor monitoring portal",
        label: "Visitor Portal",
      },
      additionalWebScreenshots: [
        {
          src: "/projects/nu-secure/web-login.jpg",
          alt: "NU-SECURE web login screen",
          label: "Login",
        },
      ],
      webStackLayers: [
        {
          layer: "Frontend",
          technology: "Laravel Blade, JavaScript, Vite, Tailwind CSS",
        },
        {
          layer: "Backend",
          technology: "Laravel 13 (PHP 8.3)",
        },
        {
          layer: "Database",
          technology: "Supabase / PostgreSQL",
        },
        {
          layer: "Storage",
          technology: "Supabase Storage (ID scans, visitor photos)",
        },
        {
          layer: "OCR",
          technology: "OCR.space API",
        },
        {
          layer: "Auth",
          technology: "Laravel session-based auth with role-based access",
        },
      ],
      screenshotPlaceholder: "Add images to /public/projects/nu-secure/",
    },
    {
      id: "tipuno",
      title: "TIPUNO BARBERSHOP",
      subtitle: "Appointment and Online Shop System",
      label: "Full-Stack Web Development Project",
      role: "Full-Stack Developer",
      summary:
        "A PHP and MySQL web application combining appointment management and e-commerce functionality.",
      description:
        "A PHP and MySQL web application combining appointment management and e-commerce functionality.",
      features: [
        "Customer Registration",
        "Login",
        "Appointment Booking",
        "Rescheduling",
        "Cancellation",
        "Shopping Cart",
        "Checkout",
        "Inventory",
        "Order History",
      ],
      technicalImplementation: [
        "CRUD Operations",
        "Prepared Queries",
        "Password Hashing",
        "Sessions",
        "Database Transactions",
      ],
      contributions: [
        {
          title: "Technical Implementation",
          items: [
            "CRUD Operations",
            "Prepared Queries",
            "Password Hashing",
            "Sessions",
            "Database Transactions",
          ],
        },
      ],
      technologies: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
      architecture: [
        { label: "Customer" },
        { label: "Book" },
        { label: "Manage Appointment" },
        { label: "Shop" },
        { label: "Checkout" },
      ],
      screenshotPath: "/projects/tipuno",
      screenshotSrc: "/projects/tipuno/screenshot.jpg",
      screenshotPlaceholder: "Add image to /public/projects/tipuno/",
    },
    {
      id: "about-me",
      title: "ABOUT ME",
      subtitle: "Personal Portfolio — Dreamy Anime World",
      label: "Frontend Web Development Project",
      role: "Frontend Developer",
      summary:
        "A personal portfolio website showcasing life, fitness, IT journey, and creative gallery sections — built with Tailwind CSS and deployed on GitHub Pages.",
      features: [
        "About Me",
        "Profile Gallery",
        "Fitness Journey",
        "IT Journey",
        "Life Journey",
        "Responsive Navigation",
        "Media Gallery",
      ],
      contributions: [
        {
          title: "What I Built",
          items: [
            "Multi-section personal portfolio layout",
            "Tailwind CSS frontend styling",
            "Responsive navigation and page structure",
            "Image and video gallery sections",
            "GitHub Pages deployment",
          ],
        },
      ],
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "Tailwind CSS",
        "GitHub Pages",
      ],
      architecture: [
        { label: "Content Sections" },
        { label: "Tailwind UI" },
        { label: "Static Frontend" },
        { label: "GitHub Pages" },
      ],
      liveUrl: "https://alcantara122903.github.io/About_me/",
      screenshotPath: "/projects/about-me",
      screenshotSrc: "/projects/about-me/screenshot.png",
      screenshotPlaceholder: "Add image to /public/projects/about-me/",
    },
  ],

  skills: [
    {
      title: "Programming Languages",
      items: ["C", "C++", "PHP", "JavaScript", "TypeScript", "SQL"],
    },
    {
      title: "Web Development",
      items: ["Laravel", "HTML", "CSS", "Tailwind CSS"],
    },
    {
      title: "Mobile Development",
      items: ["React Native", "Expo"],
    },
    {
      title: "Databases",
      items: ["MySQL", "PostgreSQL", "Supabase"],
    },
    {
      title: "Development",
      items: [
        "REST API Integration",
        "CRUD Operations",
        "Authentication",
        "Database Management",
        "Responsive Web Development",
      ],
    },
    {
      title: "Tools",
      items: ["Git", "GitHub"],
    },
  ],

  skillFlows: [
    {
      id: "web-stack",
      steps: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
    },
    {
      id: "mobile-stack",
      steps: ["React Native", "Expo", "TypeScript"],
    },
    {
      id: "backend-stack",
      steps: ["Laravel", "PHP", "REST API"],
    },
    {
      id: "database-stack",
      steps: ["Supabase", "PostgreSQL", "SQL"],
    },
  ],

  process: [
    {
      number: "01",
      title: "Understand",
      description:
        "Understand the user, requirements, workflow, constraints, and problem.",
    },
    {
      number: "02",
      title: "Design",
      description:
        "Plan application flow, interfaces, system logic, API interactions, and database relationships.",
    },
    {
      number: "03",
      title: "Build",
      description:
        "Develop the interface and connect the frontend with APIs, authentication, system logic, and databases.",
    },
    {
      number: "04",
      title: "Test & Improve",
      description:
        "Test workflows, troubleshoot problems, identify edge cases, and improve usability.",
    },
  ],

  education: [
    {
      period: "2022 — Present",
      institution: "National University – Lipa",
      degree: "Bachelor of Science in Information Technology",
      specialization: "Mobile and Web Applications",
      location: "Lipa City, Batangas, Philippines",
    },
    {
      period: "2020 — 2022",
      institution: "Metro Manila College",
      degree: "Senior High School",
      location: "Quezon City, Metro Manila",
    },
    {
      period: "2016 — 2020",
      institution: "Llano High School",
      degree: "Junior High School",
      location: "Caloocan City, Metro Manila",
    },
  ],

  certification: {
    title: "Information Technology Specialist",
    issuer: "Certiport · Software Development",
    issued: "October 20, 2025",
    validUntil: "October 20, 2030",
    credentialId: "wn2Uu-48JR",
  },

  contact: {
    email: "ivanalcantara132@gmail.com",
    linkedin: "https://www.linkedin.com/in/ivan-alcantara-9265903b5",
    github: "https://github.com/alcantara122903",
  },

  portfolioStack: [
    { category: "Language", items: ["TypeScript"] },
    { category: "Framework", items: ["Next.js"] },
    { category: "Styling", items: ["Tailwind CSS"] },
    { category: "3D", items: ["Three.js", "React Three Fiber"] },
    { category: "Animation", items: ["Framer Motion", "Anime.js"] },
  ],

  terminal: [
    { command: "whoami", output: "Ivan Alcantara" },
    { command: "specialization", output: "Mobile & Web Applications" },
    { command: "current_focus", output: "Software Development" },
    {
      command: "stack",
      output: "React Native / Laravel / Supabase / TypeScript",
    },
    { command: "status", output: "Open to internship opportunities" },
  ],
};
