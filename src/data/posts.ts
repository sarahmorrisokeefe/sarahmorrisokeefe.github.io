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
    title: "Finding Purpose at Work",
    description:
      "On what it actually means to find meaning in your work — not the LinkedIn version, but the messier, more honest one.",
    url: "https://sarahmorrisokeefe.medium.com/finding-purpose-at-work-ab10af9b0385",
    pubDate: "2024-01-03",
    draft: false,
  },
  {
    title: "The Art of Code Review: Best Practices",
    description:
      "Code review done well is a form of mentorship. A look at the habits and mindsets that make reviews genuinely useful rather than just a rubber stamp.",
    url: "https://medium.com/womenintechnology/the-art-of-code-review-best-practices-06e7260cc0a3",
    pubDate: "2023-12-05",
    draft: false,
  },
  {
    title: "A (Short) Guide to Accessibility in Front-End Engineering",
    description:
      "Accessibility isn't a checklist — it's a way of thinking about who uses what you build. A practical, no-jargon primer for front-end engineers.",
    url: "https://levelup.gitconnected.com/a-short-guide-to-accessibility-in-front-end-engineering-f7577d00da48",
    pubDate: "2023-04-18",
    draft: false,
  },
];
