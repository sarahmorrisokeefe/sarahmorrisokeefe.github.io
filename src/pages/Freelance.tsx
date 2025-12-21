import { Link } from 'react-router-dom'
import './Freelance.css'

const Freelance = () => {
  return (
    <div className="freelance-page">
      <div className="container">
        <section className="section">
          <h1>Freelance Services</h1>
          <p className="page-intro">
            Available for select freelance projects. I specialize in front-end web development with a focus on React, TypeScript, and modern web technologies.
          </p>

          <div className="freelance-content">
            <div className="freelance-services">
              <h2>What I Offer</h2>
              <div className="services-grid">

                <div className='service-card'>
                  <h3>Build</h3>
                  <ul>
                    <li>Website design and development</li>
                    <li>Landing pages</li>
                    <li>Custom components and hooks (Squarespace, Wix, etc)</li>
                  </ul>
                </div>

                <div className='service-card'>
                  <h3>Improve</h3>
                  <ul>
                    <li>Website audits</li>
                    <li>Performance & UX improvements</li>
                    <li>Modernization refreshes</li>
                  </ul>
                </div>

                <div className='service-card'>
                  <h3>Support</h3>
                  <ul>
                    <li>Tech consulting</li>
                    <li>Strategy sessions</li>
                    <li>Ongoing site care</li>
                  </ul>
                </div>

                <div className='service-card'>
                  <h3>Collaborate</h3>
                  <ul>
                    <li>Developer handoff</li>
                    <li>Agency support</li>
                    <li>Design system cleanup</li>
                  </ul>
                </div>
                
                <div className='service-card'>
                  <h3>Wild card</h3>
                  <ul>
                    <p>Thinking of something else you need but don't see it listed here? Reach out and let's talk about it!</p>
                  </ul>
                </div>
              </div>
            </div>

            <div className="freelance-technologies">
              <h2>Technologies I Work With</h2>
              <div className="tech-list">
                <div className="tech-category">
                  <strong>Frontend:</strong> React, TypeScript, Redux, Angular, HTML5, CSS3, Sass
                </div>
                <div className="tech-category">
                  <strong>Backend:</strong> Node.js, Express, Python, Django, PHP
                </div>
                <div className="tech-category">
                  <strong>Databases:</strong> PostgreSQL, MySQL, SQLite
                </div>
                <div className="tech-category">
                  <strong>Tools:</strong> Git, AWS, Testing frameworks, CI/CD
                </div>
              </div>
            </div>

            <div className="freelance-cta">
              <h2>Interested in Working Together?</h2>
              <p>
                I'm currently accepting select freelance projects. Let's discuss how I can help bring your project to life.
              </p>
              <Link to="/contact?type=freelance" className="btn btn-primary">
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Freelance
