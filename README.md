# Sarah O'Keefe - Personal Website

A modern, React + TypeScript personal website showcasing my experience, projects, and interests.

## Features

- ✅ Resume-first design - About page showcases background, skills, and personality
- ✅ Experience page - Full work history with all roles
- ✅ Projects page - Capstone projects (Brewify, Puptracker) and other work
- ✅ Education section - Nashville Software School, Belmont University
- ✅ Freelance page - Information about freelance services
- ✅ Contact form - With options for both employment and freelance inquiries
- ✅ Personal touch - "Beyond the Code" section with wine, music, and poetry interests

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Modern CSS** - Custom styling with CSS variables

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment

This site is configured for GitHub Pages. After building, the `dist` folder can be deployed to GitHub Pages.

## Project Structure

```
├── src/
│   ├── components/     # Reusable components (Layout, Navigation)
│   ├── data/          # TypeScript data modules
│   ├── pages/         # Page components
│   ├── App.tsx        # Main app component with routing
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── legacy/            # Original HTML/CSS files (preserved)
├── index.html         # HTML entry point
└── vite.config.ts     # Vite configuration
```

## Data Management

All content is stored in TypeScript modules under `src/data/`:
- `personalInfo.ts` - Personal information and social links
- `experience.ts` - Work experience
- `education.ts` - Educational background
- `projects.ts` - Projects and portfolio items
- `skills.ts` - Skills and technologies
- `interests.ts` - Personal interests

## License

ISC
