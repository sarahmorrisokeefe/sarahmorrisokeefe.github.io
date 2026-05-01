export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'codepen'
  | 'twitter'
  | 'x'
  | 'instagram'
  | 'bluesky'
  | 'medium'
  | 'substack';

export interface SocialLink {
  name: string;
  url: string;
  platform: SocialPlatform;
}

export interface PersonalInfo {
  name: string;
  firstName: string;
  lastName: string;
  tagline: string;
  title: string;
  location: string;
  email: string;
  bio: string[];
  profileImage: string;
  socialLinks: SocialLink[];
}

export const personalInfo: PersonalInfo = {
  name: "Sarah O'Keefe",
  firstName: 'Sarah',
  lastName: "O'Keefe",
  tagline: 'Software Engineer. Classically trained pianist. Perpetual learner.',
  title: 'Front-End Software Engineer',
  location: 'Charlotte, NC',
  email: 'hello@okeefesarah.com',
  profileImage: '/images/profile.jpeg',
  bio: [
    "I'm a front-end software engineer based in Charlotte, NC, most recently building things at iHeartRadio with React and TypeScript. I care a lot about the craft of the interface — the small decisions that make an experience feel alive and intentional rather than just functional.",
    "Before I was an engineer, I studied music business at Belmont University (I'm a classically trained pianist, also trumpet), spent a year in law school, worked in video production, and found my way to Nashville Software School. The circuitous path left me with an unusual mix: I think like a systems designer, I write like a storyteller, and I build like someone who's genuinely delighted by the web.",
    "Outside of work, I'm in the middle of countless side quests: attempting to learn jazz piano, diving deep into the rabbit hole that is Formula 1, birdwatching with way more enthusiasm than I expected, learning German (mostly via Duolingo), meditating, and reading everything I can. I'm also a mom — my daughter Hollis, my husband Drew, and our dogs Sammy and Ty keep things lively.",
    'This site is a small corner of the internet where I keep my work, my writing, and the occasional overshare. Welcome.',
  ],
  socialLinks: [
    {
      name: 'GitHub',
      url: 'https://github.com/sarahmorrisokeefe',
      platform: 'github',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/sarahmorrisokeefe',
      platform: 'linkedin',
    },
    {
      name: 'CodePen',
      url: 'https://codepen.io/sarahmorrisokeefe',
      platform: 'codepen',
    },
    {
      name: 'X',
      url: 'https://x.com/sarahmokeefe',
      platform: 'x',
    },
    {
      name: 'Bluesky',
      url: 'https://bsky.app/profile/okeefesarah.com',
      platform: 'bluesky',
    },
    {
      name: 'Medium',
      url: 'https://blog.okeefesarah.com',
      platform: 'medium',
    },
    {
      name: 'Substack',
      url: 'https://chartposition.substack.com',
      platform: 'substack',
    },
  ],
};
