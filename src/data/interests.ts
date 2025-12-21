export interface Interest {
  title: string;
  description: string;
  links?: {
    text: string;
    url: string;
  }[];
}

export const interests: Interest[] = [
  {
    title: "Wine",
    description: "I'm currently a Wine & Spirit Education Trust level two student, which essentially boils down to a passion for learning about wine and how it's made and distributed.",
    links: [
      {
        text: "WSET Global",
        url: "https://www.wsetglobal.com/"
      }
    ]
  },
  {
    title: "Music",
    description: "I've grown up around music everywhere, from playing trumpet and being drum major of my high school marching band, to jamming in college with small jam bands here and there. I still pick up the piano, trumpet, and guitar pretty frequently and enjoy writing songs as well."
  },
  {
    title: "Language Learning",
    description: "I'm currently learning German and Spanish on Duolingo, and I'm always looking for new languages to learn. I'm also a big fan of learning about different cultures and traditions.",
    links: [
      {
        text: "Duolingo",
        url: "https://www.duolingo.com/profile/okeefesarah"
      }
    ]
  },
  {
    title: "Guardian ad Litem",
    description: "I am an active volunteer for the Charlotte Mecklenburg Guardian ad Litem program.",
    links: [
      {
        text: "Mecklenburg Guardian ad Litem",
        url: "https://www.nccourts.gov/programs/guardian-ad-litem/volunteer-for-gal"
      }
    ]
  },
  {
    title: "Life",
    description: "During the down time between writing, working, drinking wine, etc., you can usually find me hanging out with my husband, Drew, our daughter, Hollis, and our two dogs, Samantha and Tyburn."
  }
];

