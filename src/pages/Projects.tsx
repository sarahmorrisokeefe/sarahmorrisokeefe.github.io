import { projects } from '../data/projects'
import './Projects.css'

const Projects = () => {
  const capstoneProjects = projects.filter(p => p.category === 'capstone')
  const otherProjects = projects.filter(p => p.category === 'other')

  return (
    <div className="projects-page">
      <div className="container">
        <section className="section">
          <h1>Projects</h1>
          <p className="page-intro">
            A showcase of my work, including capstone projects from Nashville Software School and other development work.
          </p>

          {capstoneProjects.length > 0 && (
            <div className="projects-section">
              <h2>Capstone Projects</h2>
              <div className="projects-grid">
                {capstoneProjects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <h3>{project.name}</h3>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                          aria-label={`View ${project.name} on GitHub`}
                        >
                          <span className="icon-github"></span> GitHub
                        </a>
                      )}
                    </div>
                    <p className="project-description">{project.description}</p>
                    <div className="project-technologies">
                      <strong>Technologies:</strong>
                      <div className="tech-tags">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherProjects.length > 0 && (
            <div className="projects-section">
              <h2>Other Projects</h2>
              <div className="projects-grid">
                {otherProjects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <h3>{project.name}</h3>
                      <div className="project-links">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                          >
                            <span className="icon-github"></span> GitHub
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                          >
                            <span className="icon-external"></span> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="project-description">{project.description}</p>
                    <div className="project-technologies">
                      <strong>Technologies:</strong>
                      <div className="tech-tags">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Projects
