import { interests } from '../data/interests'
import './BeyondTheCode.css'

const BeyondTheCode = () => {
  return (
    <div className="beyond-the-code-page">
      <div className="container">
        <section className="section">
          <h1>Beyond the Code</h1>
          <p className="page-intro">
            When I'm not coding, I'm exploring my passions for wine, music, language learning, and my newest title upgrade: mother. 
            Here's a glimpse into what makes me who I am.
          </p>

          <div className="interests-grid">
            {interests.map((interest, index) => (
              <div key={index} className="interest-card">
                <h2>{interest.title}</h2>
                <p className="interest-description">{interest.description}</p>
                {interest.links && interest.links.length > 0 && (
                  <div className="interest-links">
                    {interest.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interest-link"
                      >
                        {link.text} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="beyond-cta">
            <p>
              Want to know more? Feel free to <a href="/contact">reach out</a> or check out my 
              <a href="http://blog.sarahmorrisokeefe.com" target="_blank" rel="noopener noreferrer"> blog</a> and 
              <a href="https://instagram.com/sarahmorrisokeefe" target="_blank" rel="noopener noreferrer"> Instagram</a> for more of my writing and poetry.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default BeyondTheCode
