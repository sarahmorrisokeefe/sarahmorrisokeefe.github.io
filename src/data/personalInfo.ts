export type SocialPlatform = 'github' | 'linkedin' | 'codepen' | 'twitter' | 'instagram';

export interface SocialLink {
  name: string;
  url: string;
  platform: SocialPlatform;
}

export interface PersonalInfo {
  name: string;
  firstName: string;
  lastName: string;
  // TODO: update this tagline to your preferred one-liner — it appears large in the hero
  tagline: string;
  title: string;
  location: string;
  // TODO: verify this email address is still active before launching
  email: string;
  // Array of paragraph strings — each entry renders as a <p> in the About section.
  // TODO: replace these placeholder paragraphs with your own words in your own voice.
  bio: string[];
  // TODO: swap in your actual profile photo at public/images/profile.jpeg
  profileImage: string;
  socialLinks: SocialLink[];
}

export const personalInfo: PersonalInfo = {
  name: "Sarah O'Keefe",
  firstName: "Sarah",
  lastName: "O'Keefe",
  tagline: "Front-end engineer. Classically trained pianist. Perpetual learner.",
  title: "Front-End Software Engineer at iHeartRadio",
  location: "Charlotte, NC",
  email: "hello@okeefesarah.com",
  profileImage: "/images/profile.jpeg",
  bio: [
    "I'm a front-end software engineer based in Charlotte, NC, currently building things at iHeartRadio with React and TypeScript. I care a lot about the craft of the interface — the small decisions that make an experience feel alive and intentional rather than just functional.",
    "Before I was an engineer, I studied music business at Belmont University (I'm a classically trained pianist, also trumpet), spent a year in law school, worked in video production, and found my way to Nashville Software School. The circuitous path left me with an unusual mix: I think like a systems designer, I write like a storyteller, and I build like someone who's genuinely delighted by the web.",
    "Outside of work, I'm in the middle of pilot training, working my way up climbing walls, birdwatching with way more enthusiasm than I expected, learning German and Spanish simultaneously (not recommended), meditating, and reading everything I can. I'm also a mom — my daughter Hollis and our dogs Samantha and Tyburn keep things lively.",
    "This site is a small corner of the internet where I keep my work, my writing, and the occasional overshare. Welcome.",
  ],
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/sarahmorrisokeefe",
      platform: "github",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/sarahmorrisokeefe",
      platform: "linkedin",
    },
    {
      name: "CodePen",
      url: "https://codepen.io/sarahmorrisokeefe",
      platform: "codepen",
    },
    {
      // TODO: verify this Twitter/X URL is still active
      name: "Twitter",
      url: "https://twitter.com/sarahmokeefe",
      platform: "twitter",
    },
  ],
};
