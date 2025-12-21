import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { personalInfo } from '../data/personalInfo'
import './Contact.css'

const Contact = () => {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: searchParams.get('type') || 'employment',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type) {
      setFormData(prev => ({ ...prev, inquiryType: type }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: setup with formspring or something
    const subject = encodeURIComponent(formData.subject || `Inquiry: ${formData.inquiryType}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.inquiryType}\n\nMessage:\n${formData.message}`
    )
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <div className="contact-page">
      <div className="container">
        <section className="section">
          <h1>Get In Touch</h1>
          <p className="page-intro">
            Whether you're interested in discussing employment opportunities or freelance work, I'd love to hear from you.
          </p>

          <div className="contact-content">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="contact-details">
                <div className="contact-item">
                  <strong>Email:</strong>
                  <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
                <div className="contact-item">
                  <strong>Location:</strong>
                  <span>{personalInfo.location}</span>
                </div>
              </div>

              <div className="contact-social">
                <h3>Connect With Me</h3>
                <div className="social-links">
                  {personalInfo.socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              {submitted ? (
                <div className="form-success">
                  <h2>Thank You!</h2>
                  <p>Your message has been sent. I'll get back to you as soon as possible.</p>
                  <button 
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        name: '',
                        email: '',
                        inquiryType: 'employment',
                        subject: '',
                        message: ''
                      })
                    }}
                    className="btn btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="inquiryType">Inquiry Type *</label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                    >
                      <option value="employment">Employment Opportunity</option>
                      <option value="freelance">Freelance Project</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                      placeholder="Tell me about your project or opportunity..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Contact
