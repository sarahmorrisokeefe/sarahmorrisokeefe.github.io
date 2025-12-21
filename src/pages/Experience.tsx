import { experiences } from '../data/experience'
import './Experience.css'

const Experience = () => {
  return (
    <div className="experience-page">
      <div className="container">
        <section className="section">
          <h1>Work Experience</h1>
          <p className="page-intro">
            A comprehensive overview of my professional journey, from my early days in tech to my current role as a Software Engineer.
          </p>

          <div className="experience-timeline">
            {experiences.map((exp) => (
              <div key={exp.id} className="experience-item">
                <div className="experience-header">
                  <div className="experience-title-section">
                    <h2>{exp.title}</h2>
                    <h3 className="experience-company">{exp.company}</h3>
                    {exp.location && (
                      <p className="experience-location">{exp.location}</p>
                    )}
                  </div>
                  <div className="experience-date">
                    <span className="date-range">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                </div>

                {exp.description && (
                  <p className="experience-description">{exp.description}</p>
                )}

                <ul className="experience-responsibilities">
                  {exp.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="experience-technologies">
                    <strong>Technologies:</strong>
                    <div className="tech-tags">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Experience
