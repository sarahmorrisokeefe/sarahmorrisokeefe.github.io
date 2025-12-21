import { Link, useLocation } from 'react-router-dom'
import { personalInfo } from '../data/personalInfo'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'About' },
    { path: '/experience', label: 'Experience' },
    { path: '/projects', label: 'Projects' },
    { path: '/education', label: 'Education' },
    { path: '/freelance', label: 'Freelance' },
    { path: '/contact', label: 'Contact' },
    { path: '/beyond-the-code', label: 'Beyond the Code' }
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img 
            src={personalInfo.profileImage} 
            alt={personalInfo.name}
            className="nav-profile-img"
          />
          <span className="nav-logo-text">{personalInfo.firstName} {personalInfo.lastName}</span>
        </Link>
        
        <ul className="nav-menu">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-social">
          {personalInfo.socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social-link"
              aria-label={social.name}
            >
              <span className={`icon-${social.icon}`}></span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
