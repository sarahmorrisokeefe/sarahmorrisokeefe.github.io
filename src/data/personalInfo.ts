export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface PersonalInfo {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  profileImage: string;
  socialLinks: SocialLink[];
}

export const personalInfo: PersonalInfo = {
  name: "Sarah O'Keefe",
  firstName: "Sarah",
  lastName: "O'Keefe",
  title: "Software Engineer + Developer Advocate",
  location: "Charlotte, North Carolina",
  email: "hello@okeefesarah.com",
  bio: "I am a front-end software engineer and developer advocate currently working with React and Typescript.",
  profileImage: "/legacy/img/Optimized-fullsizeoutput_1900.jpeg",
  socialLinks: [
    {
      name: "Twitter",
      url: "https://twitter.com/sarahmokeefe",
      icon: "twitter"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/sarahmorrisokeefe",
      icon: "linkedin"
    },
    {
      name: "GitHub",
      url: "https://www.github.com/sarahmorrisokeefe",
      icon: "github"
    },
    {
      name: "Blog",
      url: "http://blog.okeefesarah.com",
      icon: "medium"
    }
  ]
};

