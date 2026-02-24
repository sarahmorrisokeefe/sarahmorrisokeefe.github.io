export type ProjectCategory = 'work' | 'experiment' | 'capstone';

export interface Project {
  id: string;
  name: string;
  // 2-3 sentences — conversational, not a job description
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  codepenUrl?: string;
  // featured: true = shown in the large top card slot
  featured: boolean;
  technologies: string[];
  year: string;
  category: ProjectCategory;
}

export const projects: Project[] = [
  {
    id: "pilot-path",
    name: "Pilot Path",
    description:
      "A tool built out of personal necessity — I'm in pilot training, and I wanted something purpose-built for tracking progress, study sessions, and flight hours that didn't feel like a spreadsheet. A React + TypeScript app with a clean, focused UI that gets out of your way.",
    githubUrl: "https://github.com/sarahmorrisokeefe/pilot-path",
    liveUrl: "https://pilotpath.vercel.app",
    featured: true,
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    year: "2024",
    category: "work",
  },
  {
    id: "formula-one-data-vis",
    name: "Formula One Data Visualization",
    description:
      "An interactive data visualization app exploring F1 race and driver statistics. I built this to dig into a dataset I found genuinely interesting and to practice building something visually expressive — charts that reward curiosity rather than just display numbers.",
    githubUrl: "https://github.com/sarahmorrisokeefe/formula-one-data-vis",
    liveUrl: "https://formula-one-data-vis.vercel.app",
    featured: false,
    technologies: ["React", "TypeScript", "D3.js"],
    year: "2024",
    category: "experiment",
  },
  {
    id: "dashboard-codepen",
    name: "Dashboard UI — Design Study",
    description:
      "A CodePen dashboard component that's less about functionality and more about aesthetic: how data-heavy UI can still feel calm, considered, and human. This is the kind of design work I enjoy most — opinionated, detail-forward, and with a clear point of view.",
    codepenUrl: "https://codepen.io/sarahmorrisokeefe/pen/LENezoW",
    featured: false,
    technologies: ["HTML", "CSS", "JavaScript"],
    year: "2024",
    category: "experiment",
  },
  {
    id: "puptracker",
    name: "Puptracker",
    description:
      "A full-stack capstone project from Nashville Software School. A dog care tracking app with authentication, built with Node.js, AngularJS, and PostgreSQL.",
    githubUrl: "https://github.com/sarahmorrisokeefe/puptracker",
    featured: false,
    technologies: ["Node.js", "AngularJS", "PostgreSQL", "Passport"],
    year: "2018",
    category: "capstone",
  },
];
