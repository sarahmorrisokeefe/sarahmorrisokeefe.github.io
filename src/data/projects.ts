export interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  category: "capstone" | "other";
}

export const projects: Project[] = [
  {
    id: "brewify",
    name: "Brewify",
    description: "Front-End Capstone, built after the front-end portion of the NSS course.",
    githubUrl: "https://github.com/sarahmorrisokeefe/Capstone-Brewify",
    category: "capstone",
    technologies: [
      "Firebase",
      "Spotify API",
      "BreweryDB API",
      "Angular-Spotify",
      "Lodash",
      "Heroku",
      "Bootstrap",
      "Grunt Task Manager"
    ]
  },
  {
    id: "puptracker",
    name: "Puptracker",
    description: "Full-Stack Capstone, built at the end of the six month NSS course.",
    githubUrl: "https://github.com/sarahmorrisokeefe/Pup-Tracker",
    category: "capstone",
    technologies: [
      "Sequelize ORM with PostgreSQL",
      "AngularJS",
      "Node.JS",
      "Bootstrap",
      "Sass",
      "Passport (for user authentication)"
    ]
  }
];

