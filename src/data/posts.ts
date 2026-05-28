export interface Post {
  title: string;
  description: string;
  url: string;
  pubDate: string;
  platform: 'medium' | 'substack';
  // Set to true to hide the post from the Writing section
  draft?: boolean;
}

// To add a new post teaser: add a new object to this array.
// To hide a post while keeping it for reference: set draft: true.
export const posts: Post[] = [
  {
    title: 'Next.js + React + Sanity: The Bugs Nobody Warned Me About',
    description:
      'A field report from building on React 19, Next.js 16, and Sanity v5 before the ecosystem caught up.',
    url: 'https://levelup.gitconnected.com/next-js-react-sanity-the-bugs-nobody-warned-me-about-96c912cacfdb',
    pubDate: '2026-05-22',
    platform: 'medium',
  },
  {
    title: 'I Stopped Setting Up Git Worktrees for Parallel Claude Code',
    description:
      'The Mac app does it automatically. Here’s the workflow that replaced my old terminal setup.',
    url: 'https://levelup.gitconnected.com/i-stopped-setting-up-git-worktrees-for-parallel-claude-code-07023ca5cd1c',
    pubDate: '2026-05-06',
    platform: 'medium',
  },
  {
    title: 'How to Render Music Notation in React Without Breaking on Mobile',
    description:
      "I built a music theory app with VexFlow and Capacitor. Here's what only works on desktop by default - and how to fix it.",
    url: 'https://medium.com/gitconnected/how-to-render-music-notation-in-react-without-breaking-on-mobile-9615f812a3ec',
    pubDate: '2026-04-29',
    platform: 'medium',
  },
  {
    title: 'The Mercedes Garage',
    description:
      "The first installment of a new series on Chart Position substack: The Garage. It is a series that looks at F1 teams through their birth charts: drivers, team principals, race engineers, and how all of it fits together (or doesn't).",
    url: 'https://open.substack.com/pub/chartposition/p/the-mercedes-garage?r=9tgt6&utm_campaign=post-expanded-share&utm_medium=post%20viewer',
    pubDate: '2026-04-23',
    platform: 'substack',
  },
  {
    title:
      "Supabase Free Tier Will Pause Your App. Here's the GitHub Actions Fix.",
    description:
      "You don't need a paid plan. You need a cron job and about ten minutes.",
    url: 'https://levelup.gitconnected.com/supabase-free-tier-will-pause-your-app-heres-the-github-actions-fix-8c1fd35b49ca',
    pubDate: '2026-04-22',
    platform: 'medium',
  },
  {
    title:
      "Claude Is Making Our Jobs Lonelier. Here's What I'm Doing About It.",
    description:
      'On the quiet cost of replacing collaboration with AI, and what I did about it.',
    url: 'https://medium.com/womenintechnology/claude-is-making-our-jobs-lonelier-heres-what-i-m-doing-about-it-c4e5adec7118',
    pubDate: '2026-04-17',
    platform: 'medium',
  },
  {
    title: 'Your Existing Web App Is Closer to a Mobile App Than You Think',
    description:
      'How Capacitor gets your existing React app into the App Store without a total rewrite.',
    url: 'https://medium.com/gitconnected/your-existing-web-app-is-closer-to-a-mobile-app-than-you-think-c47fd3d51742',
    pubDate: '2026-04-15',
    platform: 'medium',
  },
  {
    title:
      'What I Thought Having a Baby Would Do to My Career (And What Actually Happened)',
    description:
      'The gold star didn’t disappear. It just stopped being the point.',
    url: 'https://medium.com/womenintechnology/what-i-thought-having-a-baby-would-do-to-my-career-and-what-actually-happened-53192100c0ad',
    pubDate: '2026-04-11',
    platform: 'medium',
  },
  {
    title: 'Claude Has Many Surfaces. Here’s How I Actually Use Each One.',
    description:
      "A practical breakdown of Claude's Chat, Code, and Cowork modes for engineers who are tired of guessing.",
    url: 'https://pub.towardsai.net/claude-has-many-surfaces-heres-how-i-actually-use-each-one-df1f9ddfdae5',
    pubDate: '2026-04-05',
    platform: 'medium',
  },
  {
    title:
      '5 Front-End Accessibility Patterns Worth Getting Right the First Time',
    description:
      "These five patterns are not exotic. They're not edge cases. They're the things that make a real difference for real users.",
    url: 'https://levelup.gitconnected.com/5-front-end-accessibility-patterns-worth-getting-right-the-first-time-12af156c9297',
    pubDate: '2026-03-30',
    platform: 'medium',
  },
  {
    title: 'I Use AI Every Day and I’m Still Not Sure What It’s Good At',
    description:
      'What is AI actually reliable for — and how are you supposed to calibrate a tool that doesn’t tell you when it’s guessing?',
    url: 'https://levelup.gitconnected.com/i-use-ai-every-day-and-im-still-not-sure-what-it-s-good-at-896b700d5ad5',
    pubDate: '2026-03-24',
    platform: 'medium',
  },
  {
    title:
      'AI Didn\’t Make Me a Better Engineer. It Made Me Remember Why I Became One.',
    description:
      'A mid-career front-end engineer on using AI to stop doing everything and start loving the job again.',
    url: 'https://medium.com/gitconnected/ai-didnt-make-me-a-better-engineer-it-made-me-remember-why-i-became-one-6faab0ba1979',
    pubDate: '2026-03-16',
    platform: 'medium',
  },
  {
    title: 'Finding Purpose At Work: A Follow-Up',
    description: 'Some things I got right. Some things I didn\’t know yet.',
    url: 'https://medium.com/the-insanity-journal/finding-purpose-at-work-a-follow-up-757c5f992738',
    pubDate: '2026-03-13',
    platform: 'medium',
  },
];
