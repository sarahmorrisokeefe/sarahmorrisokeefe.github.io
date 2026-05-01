export interface Post {
  title: string;
  // Short excerpt shown on the post teaser card (1-2 sentences)
  description: string;
  // Full URL to the post on Medium or wherever it's published
  url: string;
  pubDate: string;
  // Set to true to hide the post from the Writing section
  draft?: boolean;
}

// To add a new post teaser: add a new object to this array.
// To hide a post while keeping it for reference: set draft: true.
export const posts: Post[] = [
  {
    title: 'How to Render Music Notation in React Without Breaking on Mobile',
    description:
      "I built a music theory app with VexFlow and Capacitor. Here's what only works on desktop by default - and how to fix it.",
    url: 'https://medium.com/gitconnected/how-to-render-music-notation-in-react-without-breaking-on-mobile-9615f812a3ec',
    pubDate: '2026-04-29',
  },
  {
    title:
      'Supabase Free Tier Will Pause Your App. Here\’s the GitHub Actions Fix.',
    description:
      'You don\’t need a paid plan. You need a cron job and about ten minutes.',
    url: 'https://medium.com/gitconnected/supabase-free-tier-will-pause-your-app-heres-the-github-actions-fix-8c1fd35b49ca',
    pubDate: '2026-04-22',
  },
  {
    title:
      "Claude Is Making Our Jobs Lonelier. Here's What I'm Doing About It.",
    description:
      'On the quiet cost of replacing collaboration with AI, and what I did about it.',
    url: 'https://medium.com/womenintechnology/claude-is-making-our-jobs-lonelier-heres-what-i-m-doing-about-it-c4e5adec7118',
    pubDate: '2026-04-17',
  },
  {
    title: 'Your Existing Web App Is Closer to a Mobile App Than You Think',
    description:
      'How Capacitor gets your existing React app into the App Store without a total rewrite.',
    url: 'https://medium.com/gitconnected/your-existing-web-app-is-closer-to-a-mobile-app-than-you-think-c47fd3d51742',
    pubDate: '2026-04-15',
  },
  {
    title:
      '5 Front-End Accessibility Patterns Worth Getting Right the First Time',
    description:
      "These five patterns are not exotic. They're not edge cases. They're the things that make a real difference for real users.",
    url: 'https://levelup.gitconnected.com/5-front-end-accessibility-patterns-worth-getting-right-the-first-time-12af156c9297',
    pubDate: '2026-03-30',
    draft: false,
  },
  {
    title:
      'AI Didn\’t Make Me a Better Engineer. It Made Me Remember Why I Became One.',
    description:
      'A mid-career front-end engineer on using AI to stop doing everything and start loving the job again.',
    url: 'https://medium.com/gitconnected/ai-didnt-make-me-a-better-engineer-it-made-me-remember-why-i-became-one-6faab0ba1979',
    pubDate: '2026-03-16',
    draft: false,
  },
  {
    title: 'Finding Purpose At Work: A Follow-Up',
    description: 'Some things I got right. Some things I didn\’t know yet.',
    url: 'https://medium.com/the-insanity-journal/finding-purpose-at-work-a-follow-up-757c5f992738',
    pubDate: '2026-03-13',
    draft: false,
  },
];
