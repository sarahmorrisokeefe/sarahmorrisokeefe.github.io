export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
  responsibilities: string[];
  technologies?: string[];
}

export const experiences: Experience[] = [
  {
    id: "iheartradio",
    title: "Software Engineer",
    company: "iHeartRadio",
    startDate: "March 2020",
    endDate: "Present",
    responsibilities: [
      "Collaborate and coordinate with engineers and outside teams to create solutions for our users",
      "Write clean and maintainable front-end code for the web client at iHeartRadio",
      "Advocate for and contribute to our test suite to work towards more coverage of our code base",
      "Manage and lead our internal Team Tech Talk discussion every two weeks for the web development team",
      "Direct sponsorships and internal infrastructure for our HackDay and HackWeek programs"
    ]
  },
  {
    id: "octerra",
    title: "Software Engineer",
    company: "Octerra (previously StudioNow)",
    startDate: "May 2019",
    endDate: "February 2020",
    description: "Octerra is a software company spun out of StudioNow. We are a SaaS marketing procurement solutions company in Nashville TN.",
    responsibilities: [
      "Write clean, maintainable, reusable code that builds on new features while keeping technical debt at bay",
      "Introduce behavior-driven-development to the team via Gherkin statements, Cucumber tests for the Angular/AngularJS code, and Behave tests for the Python code",
      "Whiteboard architectural solutions with the team for back-end problems we run into",
      "Spearhead the entire release lifecycle and streamline our process for deployments",
      "Maintain NewRelic scripted browser tests to ensure all of our environments that are client-facing are working properly",
      "Create a Slack application called AlertBot that notifies the team via text and phone call if our application is down (with NewRelic alerts in Slack, SQS Queue and API Gateway on AWS, and Twilio for sending out a text to one team member on call, and eventually all team members If no one responds)"
    ]
  },
  {
    id: "studionow-qa",
    title: "Quality Assurance Engineer + Junior Software Engineer",
    company: "StudioNow",
    startDate: "September 2018",
    endDate: "May 2019",
    responsibilities: [
      "Designed and developed new tests for our main application (via python tests, unit tests, and features tests)",
      "Completed quality assurance checks on every feature and bug fix that went into production",
      "Wrote solutions to bugs on both the front-end and back-end of our main application",
      "Created easily navigable documentation for users and developers surrounding our application and tests"
    ]
  },
  {
    id: "neurotargeting",
    title: "Junior Software Engineer",
    company: "Neurotargeting",
    startDate: "May 2018",
    endDate: "September 2018",
    responsibilities: [
      "Worked on Three.JS technology to create models for the healthcare industry",
      "Helped to create an agile environment with scrum methodology",
      "Created, edited, and managed data using mySQL and MySQLWorkbench",
      "Wrote applications using PHP, Javascript, and HTML Templating with Twig"
    ]
  },
  {
    id: "coderev",
    title: "Summer Camp Instructor",
    company: "CodeREV Kids + Franklin Road Academy",
    startDate: "April 2018",
    endDate: "June 2018",
    responsibilities: [
      "Taught kids programming basics through Arduino and robotics",
      "Created and organized curriculum for kids from second grade through eighth grade",
      "Assisted in problem solving throughout Arduino programming and building the Creator Bots for the course"
    ]
  },
  {
    id: "nss-apprentice",
    title: "Apprentice Software Engineer",
    company: "Nashville Software School",
    startDate: "November 2017",
    endDate: "May 2018",
    description: "Full-time software development bootcamp focusing on full-stack development fundamentals and problem solving. The final half of the program is executed in a simulated company environment with Scrum methodology.",
    responsibilities: [
      "Daily hands-on application of development fundamentals and principles through group and individual projects reflecting real world business problems",
      "Source code version control with Git/GitHub",
      "Project management/tracking with Github Projects & Issue Tracking",
      "JavaScript fundamentals leveraging DRY, modular, readable code and reusable components",
      "DOM manipulation and AJAX calls with jQuery",
      "Built single-page applications in the AngularJS framework leveraging HTML, CSS, and JavaScript",
      "Front-end templating with Handlebars",
      "Task Automation with Grunt: Linting with JSHint, module bundling with Browserify, SASS compilation",
      "Styled applications with the CSS framework Bootstrap and wrote custom styles with SASS; CSS Grid and Flexbox",
      "Deployed applications through Firebase, GitHub Pages, and Heroku",
      "Built command line applications with Node.js and RESTful APIs with the Express framework",
      "TDD with Mocha and Chai",
      "Application design through white boarding dependencies and building ERD's",
      "Created and modified database design/content using SQLite and PostgreSQL; Node.js ORM Sequelize",
      "Team lead for our back-end company simulation project: Bangazon"
    ]
  },
  {
    id: "studionow-producer",
    title: "Line Producer",
    company: "StudioNow",
    startDate: "November 2016",
    endDate: "November 2017",
    responsibilities: [
      "Coordinated video shoots for small businesses across the world using our in-house software and creative network",
      "Managed 200+ projects each month from conception to final production",
      "Worked with software engineering team to fix issues in the reseller software that I used as a line producer",
      "Learned scrum methodology, working in an AGILE environment, and JIRA for issue/ticket management",
      "Used Adobe Photoshop and Final Cut Pro throughout the duration of my time as a line producer"
    ]
  },
  {
    id: "apple",
    title: "Technical Specialist",
    company: "Apple",
    startDate: "April 2014",
    endDate: "May 2018 (on and off)",
    responsibilities: [
      "Restored customer relationships with the company and its tech",
      "Conceptualized new ideas to implement in the workplace systems for better communication and productivity",
      "Aligned with all team members on best options for the customers",
      "Worked at multiple locations: Green Hills in Nashville, TN; Cool Springs in Franklin, TN; Southlake Town Center in Southlake, TX; SoHo in New York, NY"
    ]
  }
];

