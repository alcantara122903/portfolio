import type { PortfolioData } from "@/types/portfolio";

export const portfolio: PortfolioData = {
  personal: {
    firstName: "Ivan",
    lastName: "Alcantara",
    fullName: "Ivan Vasquez Alcantara",
    role: "Mobile & Web Developer",
    tagline: "Building systems that connect people, data, and experiences.",
    bio: "Fourth-year Information Technology student specializing in Mobile and Web Applications — shipping real workflows across React Native, Laravel APIs, and databases.",
    location: "Lipa City, Philippines",
    status: "Open to Internship · Mobile & Web · 2026",
    availability: "Available for internship opportunities in 2026",
    focusAreas: [
      "Mobile development",
      "Web development",
      "Full-stack systems",
    ],
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
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
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
        "A production-facing visitor monitoring system connecting a React Native guard app and Laravel web portal through REST APIs, QR validation, OCR ID capture, and a shared Supabase/PostgreSQL database.",
      outcomes: [
        "Owned mobile + web feature work spanning registration, QR scanning, office validation, enrollee progress, and visitor exit flows.",
        "Integrated REST APIs so guard devices and the VMS portal stayed in sync on the same visitor lifecycle.",
        "Hardened real campus workflows through testing, troubleshooting, and end-to-end UX fixes with a four-member team.",
      ],
      contributions: [
        {
          title: "What I Owned",
          items: [
            "Mobile application development (React Native / Expo)",
            "Web platform features on the Laravel VMS portal",
            "QR identification and validation flows",
            "REST API integration between mobile and backend",
            "Database-backed visitor lifecycle updates",
            "OCR ID-scan workflow support",
            "Testing, troubleshooting, and workflow polish",
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
            "Laravel admin / VMS portal surfaces",
            "REST endpoints for mobile clients",
            "Visitor type and guard on-duty workflows",
            "Auth sessions and role-aware access",
            "Migrations and backend visitor logic",
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
        "Designed, tested, and improved end-to-end visitor monitoring for real campus use.",
      featured: true,
      liveUrl: "https://www.nu-secure.com/",
      caseStudyPath: "/projects/nu-secure",
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
      label: "Supporting Project",
      role: "Full-Stack Developer",
      summary:
        "A PHP and MySQL web app combining appointment booking with a simple online shop — focused on CRUD flows, sessions, and transactional checkout.",
      reflection:
        "This project sharpened fundamentals: secure password hashing, prepared queries, session auth, and keeping appointments + cart state consistent in MySQL.",
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
      contributions: [
        {
          title: "What I Built",
          items: [
            "Appointment booking, reschedule, and cancellation flows",
            "Cart, checkout, and order history",
            "CRUD with prepared queries and password hashing",
            "Session-based auth and MySQL transactions",
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
      compact: true,
      screenshotPath: "/projects/tipuno",
      screenshotSrc: "/projects/tipuno/screenshot.jpg",
      screenshotPlaceholder: "Add image to /public/projects/tipuno/",
    },
    {
      id: "about-me",
      title: "ABOUT ME",
      subtitle: "Personal Portfolio — Dreamy Anime World",
      label: "Supporting Project",
      role: "Frontend Developer",
      summary:
        "An earlier personal site exploring layout, Tailwind styling, and GitHub Pages deployment — useful practice before this Systems Lab portfolio.",
      reflection:
        "Taught me responsive section structure, visual hierarchy, and shipping a static site. The current portfolio is the stronger representation of my stack.",
      features: [
        "Multi-section layout",
        "Profile & media galleries",
        "Responsive navigation",
        "GitHub Pages deploy",
      ],
      contributions: [
        {
          title: "What I Learned",
          items: [
            "Composable page sections in plain HTML/CSS/JS",
            "Tailwind utility styling at speed",
            "Responsive nav and media galleries",
            "Static hosting on GitHub Pages",
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
      compact: true,
      liveUrl: "https://alcantara122903.github.io/About_me/",
      screenshotPath: "/projects/about-me",
      screenshotSrc: "/projects/about-me/screenshot.png",
      screenshotPlaceholder: "Add image to /public/projects/about-me/",
    },
  ],

  skills: [
    {
      title: "Languages",
      items: ["TypeScript", "JavaScript", "PHP", "SQL", "C", "C++"],
    },
    {
      title: "Frontend & Mobile",
      items: ["React", "Next.js", "React Native", "Expo", "Tailwind CSS", "HTML", "CSS"],
    },
    {
      title: "Backend & Data",
      items: ["Laravel", "REST APIs", "MySQL", "PostgreSQL", "Supabase"],
    },
    {
      title: "Practices",
      items: [
        "Authentication",
        "CRUD & transactions",
        "API integration",
        "Responsive UI",
        "Testing & troubleshooting",
      ],
    },
    {
      title: "Tools",
      items: ["Git", "GitHub", "Vite"],
    },
  ],

  skillFlows: [
    {
      id: "web-stack",
      steps: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
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
    { category: "Framework", items: ["Next.js", "React"] },
    { category: "Styling", items: ["Tailwind CSS"] },
    { category: "3D", items: ["Three.js", "React Three Fiber"] },
    { category: "Animation", items: ["Framer Motion", "Anime.js"] },
  ],

  terminal: [
    { command: "whoami", output: "Ivan Alcantara" },
    { command: "specialization", output: "Mobile & Web Applications" },
    { command: "current_focus", output: "Software Development Internship" },
    {
      command: "stack",
      output: "React Native / Laravel / Supabase / TypeScript / Next.js",
    },
    { command: "status", output: "Open to internship · Mobile & Web · 2026" },
  ],
};
