export interface Skill {
  name: string;
  category: "language" | "framework" | "tool" | "database" | "other";
  icon?: string;
}

export interface Workflow {
  name: string;
}

export const skills: Skill[] = [
  { name: "JavaScript", category: "language", icon: "javascript" },
  { name: "TypeScript", category: "language", icon: "typescript" },
  { name: "Python", category: "language", icon: "python" },
  { name: "PHP", category: "language", icon: "php" },
  { name: "HTML5", category: "language", icon: "html5" },
  { name: "CSS3", category: "language", icon: "css3" },
  { name: "Sass", category: "language", icon: "sass" },
  { name: "React", category: "framework", icon: "react" },
  { name: "Redux", category: "framework", icon: "redux" },
  { name: "Angular", category: "framework", icon: "angular" },
  { name: "AngularJS", category: "framework", icon: "angular" },
  { name: "Node.js", category: "framework", icon: "nodejs" },
  { name: "Django", category: "framework", icon: "django" },
  { name: "Express", category: "framework" },
  { name: "jQuery", category: "framework", icon: "jquery" },
  { name: "Bootstrap", category: "framework", icon: "bootstrap" },
  { name: "PostgreSQL", category: "database", icon: "postgresql" },
  { name: "MySQL", category: "database", icon: "mysql" },
  { name: "SQLite", category: "database", icon: "sqllite" },
  { name: "AWS", category: "tool", icon: "amazonwebservices" },
  { name: "Git", category: "tool", icon: "git" },
  { name: "GitHub", category: "tool", icon: "github_badge" },
  { name: "NPM", category: "tool", icon: "npm" },
  { name: "Grunt", category: "tool", icon: "grunt" },
  { name: "Jira", category: "tool", icon: "jira" },
  { name: "Trello", category: "tool", icon: "trello" }
];

export const workflows: Workflow[] = [
  { name: "Mobile-First, Responsive Design" },
  { name: "Test-Driven Development" },
  { name: "Cross Browser Testing & Debugging" },
  { name: "Cross Functional Teams" },
  { name: "Agile Development, Sprint Workflow, & Scrum Methodologies" }
];

