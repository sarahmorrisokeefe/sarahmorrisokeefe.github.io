export type ProjectCategory = 'project' | 'experiment' | 'work';

export interface Project {
  id: string;
  name: string;
  // 2-3 sentences — conversational, not a job description
  description: string;
  githubUrl?: string;
  // Optional label for the GitHub link (defaults to "GitHub")
  githubLabel?: string;
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
    id: 'cadence',
    name: 'Cadence',
    description:
      'A gamified music theory study app for beginners through AP Music Theory. Learn notation, rhythm, scales, intervals, and chords through bite-sized lessons, instant feedback, and a progression system that keeps you coming back.',
    githubUrl: 'https://github.com/sarahmorrisokeefe/cadence',
    liveUrl: 'https://cadence-music-theory.vercel.app',
    featured: true,
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    year: '2026',
    category: 'project',
  },
  {
    id: 'avalora',
    name: 'Avalora',
    description:
      'A live band website built on a reusable Next.js + Sanity platform I designed so any band can run their own site — shows, releases, press — and edit everything themselves through an embedded CMS, no code required. Avalora is the first client on it: the template repo is open source, while each band’s own site and content stay private.',
    githubUrl: 'https://github.com/sarahmorrisokeefe/band-site-template',
    githubLabel: 'Template on GitHub',
    liveUrl: 'https://www.avaloraband.com',
    featured: false,
    technologies: ['Next.js', 'Sanity', 'TypeScript', 'Tailwind CSS'],
    year: '2026',
    category: 'work',
  },
  {
    id: 'formula-one-data-vis',
    name: 'Formula One Data Visualization',
    description:
      'An interactive data visualization app exploring F1 race and driver statistics. I built this to dig into a dataset I found genuinely interesting and to practice building something visually expressive — charts that reward curiosity rather than just display numbers.',
    githubUrl: 'https://github.com/sarahmorrisokeefe/formula-one-data-vis',
    liveUrl: 'https://formula-one-data-vis.vercel.app',
    featured: false,
    technologies: ['React', 'TypeScript', 'D3.js'],
    year: '2026',
    category: 'experiment',
  },
  {
    id: 'dashboard-codepen',
    name: 'Dashboard UI — Design Study',
    description:
      "A CodePen dashboard component that's less about functionality and more about aesthetic: how data-heavy UI can still feel calm, considered, and human. This is the kind of design work I enjoy most — opinionated, detail-forward, and with a clear point of view.",
    codepenUrl: 'https://codepen.io/sarahmorrisokeefe/pen/LENezoW',
    featured: false,
    technologies: ['HTML', 'CSS', 'JavaScript'],
    year: '2025',
    category: 'experiment',
  },
];
