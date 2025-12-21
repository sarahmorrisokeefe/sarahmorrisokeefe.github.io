import { education } from '../data/education'
import './Education.css'

const Education = () => {
  return (
    <div className="education-page">
      <div className="container">
        <section className="section">
          <h1>Education</h1>
          <p className="page-intro">
            My educational background, from my bootcamp experience at Nashville Software School to my studies at Belmont University.
          </p>

          <div className="education-timeline">
            {education.map((edu) => (
              <div key={edu.id} className="education-item">
                <div className="education-header">
                  <div className="education-content">
                    <h2>{edu.institution}</h2>
                    {edu.degree && (
                      <h3 className="education-degree">{edu.degree}</h3>
                    )}
                    {edu.field && (
                      <p className="education-field">{edu.field}</p>
                    )}
                    {edu.honors && (
                      <p className="education-honors">
                        <strong>Honors:</strong> {edu.honors}
                      </p>
                    )}
                    {edu.description && (
                      <p className="education-description">{edu.description}</p>
                    )}
                  </div>
                  <div className="education-date">
                    <span className="date-range">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Education
