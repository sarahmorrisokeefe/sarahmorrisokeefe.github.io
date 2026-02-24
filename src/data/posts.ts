export interface Post {
  title: string;
  // Short excerpt shown on the post teaser card (1-2 sentences)
  description: string;
  // Full URL to the post on blog.okeefesarah.com
  url: string;
  pubDate: string;
  // Set to true to hide the post from the Writing section
  draft?: boolean;
}

// To add a new post teaser: add a new object to this array.
// To hide a post while keeping it for reference: set draft: true.
// TODO: replace these placeholder posts with real links from blog.okeefesarah.com
export const posts: Post[] = [
  {
    title: "Post Title Here",
    description:
      "A short excerpt or description of what this post is about. One or two sentences that give the reader a reason to click through.",
    // TODO: replace with real post URL
    url: "http://blog.okeefesarah.com",
    pubDate: "2024-01-15",
    draft: false,
  },
  {
    title: "Another Post Title",
    description:
      "Another excerpt. Keep these conversational and human — write like you'd talk to a friend about the subject, not like a press release.",
    // TODO: replace with real post URL
    url: "http://blog.okeefesarah.com",
    pubDate: "2023-12-01",
    draft: false,
  },
  {
    title: "One More Post",
    description:
      "A third teaser. Three is a nice number — enough to signal that writing is an active practice, not just a box checked.",
    // TODO: replace with real post URL
    url: "http://blog.okeefesarah.com",
    pubDate: "2023-11-01",
    draft: false,
  },
];
