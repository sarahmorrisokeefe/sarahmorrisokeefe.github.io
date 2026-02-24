export type ProjectCategory = 'work' | 'experiment' | 'capstone';

export interface Project {
  id: string;
  name: string;
  // 2-3 sentences — conversational, not a job description
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  // TODO: replace PLACEHOLDER with your actual CodePen username
  codepenUrl?: string;
  // featured: true = shown in the large top card slot
  featured: boolean;
  technologies: string[];
  year: string;
  category: ProjectCategory;
}

// TODO: add your recent projects — the two placeholders are here for structure.
// Replace or expand them with real work. The capstone projects (brewify, puptracker)
// are kept as historical context.
export const projects: Project[] = [
  {
    id: "featured-placeholder",
    name: "Your Featured Project",
    // TODO: replace with a real recent project description
    description:
      "A placeholder for your most notable recent work. Describe what it does, the problem it solves, and what made it interesting to build. Two or three sentences works well — enough to give a reader a reason to click through.",
    githubUrl: "https://github.com/sarahmorrisokeefe",
    liveUrl: undefined,
    codepenUrl: "https://codepen.io/sarahmorrisokeefe",
    featured: true,
    technologies: ["React", "TypeScript", "CSS"],
    year: "2024",
    category: "work",
  },
  {
    id: "experiment-placeholder",
    name: "Side Project or Experiment",
    // TODO: replace with a real side project, experiment, or open source contribution
    description:
      "A placeholder for a side project or creative coding experiment. This is a great spot to show work that lives outside your day job — a UI challenge, an open source contribution, a weekend project that got out of hand.",
    githubUrl: "https://github.com/sarahmorrisokeefe",
    featured: false,
    technologies: ["JavaScript", "CSS", "SVG"],
    year: "2024",
    category: "experiment",
  },
  {
    id: "brewify",
    name: "Brewify",
    description:
      "A front-end capstone project from Nashville Software School. Brewify pairs beers with music by combining the Spotify API and BreweryDB — because why not. Built with Angular and Firebase.",
    githubUrl: "https://github.com/sarahmorrisokeefe/brewify",
    featured: false,
    technologies: ["Angular", "Firebase", "Spotify API", "BreweryDB"],
    year: "2018",
    category: "capstone",
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
