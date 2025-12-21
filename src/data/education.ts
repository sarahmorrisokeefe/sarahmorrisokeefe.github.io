export interface Education {
  id: string;
  institution: string;
  degree?: string;
  field?: string;
  startDate: string;
  endDate: string;
  honors?: string;
  description?: string;
}

export const education: Education[] = [
  {
    id: "nss",
    institution: "Nashville Software School",
    degree: "Full Stack Node.JS",
    startDate: "November 2017",
    endDate: "May 2018"
  },
  {
    id: "belmont-law",
    institution: "Belmont University, College of Law",
    startDate: "August 2015",
    endDate: "May 2016"
  },
  {
    id: "belmont",
    institution: "Belmont University",
    degree: "Bachelor of Business Administration",
    field: "Double Major in Music Business and Marketing, Minor in Audio Engineering",
    startDate: "August 2011",
    endDate: "May 2015",
    honors: "Cum Laude"
  }
];

