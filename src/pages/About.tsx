import { personalInfo } from '../data/personalInfo'
import { skills, workflows } from '../data/skills'
import { Link } from 'react-router-dom'
import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <section className="about-hero section">
          <div className="about-hero-content">
            <div className="about-image-wrapper">
              <img 
                src={personalInfo.profileImage} 
                alt={personalInfo.name}
                className="about-profile-image"
              />
            </div>
            <div className="about-text">
              <h1>
                {personalInfo.firstName} <span className="text-primary">{personalInfo.lastName}</span>
              </h1>
              <p className="about-title">{personalInfo.title}</p>
              <p className="about-location">{personalInfo.location}</p>
              <p className="about-bio">{personalInfo.bio}</p>
              
              <div className="about-cta">
                <Link to="/contact" className="btn btn-primary">
                  Get In Touch
                </Link>
                <Link to="/experience" className="btn btn-outline">
                  View Experience
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="skills-section section">
          <h2>Skills & Expertise</h2>
          
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Programming Languages</h3>
              <div className="skill-tags">
                {skills
                  .filter(skill => skill.category === 'language')
                  .map(skill => (
                    <span key={skill.name} className="skill-tag">
                      {skill.name}
                    </span>
                  ))}
              </div>
            </div>

            <div className="skill-category">
              <h3>Frameworks & Libraries</h3>
              <div className="skill-tags">
                {skills
                  .filter(skill => skill.category === 'framework')
                  .map(skill => (
                    <span key={skill.name} className="skill-tag">
                      {skill.name}
                    </span>
                  ))}
              </div>
            </div>

            <div className="skill-category">
              <h3>Tools & Technologies</h3>
              <div className="skill-tags">
                {skills
                  .filter(skill => skill.category === 'tool' || skill.category === 'database')
                  .map(skill => (
                    <span key={skill.name} className="skill-tag">
                      {skill.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="workflow-section">
            <h3>Workflow & Methodologies</h3>
            <ul className="workflow-list">
              {workflows.map((workflow, index) => (
                <li key={index}>{workflow.name}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="quick-links section">
          <h2>Explore More</h2>
          <div className="quick-links-grid">
            <Link to="/experience" className="quick-link-card">
              <h3>Experience</h3>
              <p>View my full work history and career journey</p>
            </Link>
            <Link to="/projects" className="quick-link-card">
              <h3>Projects</h3>
              <p>Check out my capstone projects and other work</p>
            </Link>
            <Link to="/beyond-the-code" className="quick-link-card">
              <h3>Beyond the Code</h3>
              <p>Learn about my interests in wine, music, and language learning</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About

