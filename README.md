# Ivan Alcantara Portfolio

Premium 3D developer portfolio for Ivan Vasquez Alcantara — Mobile & Web Developer and fourth-year BS Information Technology student at National University – Lipa.

Built to showcase academic projects, system architecture thinking, and internship readiness.

## Tech Stack

- **Language:** TypeScript
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **3D:** Three.js, React Three Fiber, Drei
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## Project Structure

```
src/
├── app/              # Next.js App Router pages & metadata
├── components/       # UI, sections, 3D, animations
├── data/             # Centralized portfolio content
├── types/            # TypeScript interfaces
├── hooks/            # Custom React hooks
├── lib/              # Utilities & constants
└── styles/           # Global CSS effects
```

## Portfolio Sections

Home · About · Projects · Skills · Process · Journey · Contact

## Deployment

Deploy to [Vercel](https://vercel.com) by connecting this repository. No environment variables are required.

Update `SITE_URL` in `src/lib/constants.ts` after deploying.

## Updating Content

All personal info, projects, skills, and contact details live in **`src/data/portfolio.ts`**. Edit that file to update content across the site.

Types are defined in **`src/types/portfolio.ts`**.

## Project Screenshots

Add images to:

- `public/projects/nu-secure/` — NU-SECURE capstone project
- `public/projects/tipuno/` — Tipuno Barbershop project

Then reference them in `portfolio.ts` or extend `DeviceMockup` to load real images.

## Résumé

Place your PDF at:

`public/resume/Ivan-Alcantara-Resume.pdf`
