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
    title: "AI Didn’t Make Me a Better Engineer. It Made Me Remember Why I Became One.",
    description:
      "A mid-career front-end engineer on using AI to stop doing everything and start loving the job again.",
    url: "https://medium.com/gitconnected/ai-didnt-make-me-a-better-engineer-it-made-me-remember-why-i-became-one-6faab0ba1979",
    pubDate: "2026-03-16",
    draft: false,
  },
  {
    title: "Finding Purpose At Work: A Follow-Up",
    description:
      "Some things I got right. Some things I didn’t know yet.",
    url: "https://medium.com/the-insanity-journal/finding-purpose-at-work-a-follow-up-757c5f992738",
    pubDate: "2026-03-13",
    draft: false,
  },
  {
    title: "I'm Still Figuring Out AI Coding Tools. That's Kind of the Point.",
    description:
      "A front-end engineer’s honest take on what’s actually working, what isn’t, and why AI has made me excited about coding again.",
    url: "https://levelup.gitconnected.com/im-still-figuring-out-ai-coding-tools-that-s-kind-of-the-point-489199baffda",
    pubDate: "2026-03-12",
    draft: false,
  },
  {
    title: "A (Short) Guide to Accessibility in Front-End Engineering",
    description:
      "Accessibility isn't a checklist — it's a way of thinking about who uses what you build. A practical, no-jargon primer for front-end engineers.",
    url: "https://levelup.gitconnected.com/a-short-guide-to-accessibility-in-front-end-engineering-f7577d00da48",
    pubDate: "2023-04-18",
    draft: true,
  },
];
