import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import fullLogo from '../assets/images/full-logo-sda.jpeg';
import '../styles/SharedNav.css';

function SharedNav() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const sendToSection = (section) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } });
      return;
    }
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleHome = () => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'top' } });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`shared-nav ${scrollY > 50 ? 'scrolled' : ''}`}>
      <div className="shared-nav-container">
        <Link to="/" className="brand" onClick={handleHome}>
          <div className="brand-logo">
            <img src={fullLogo} alt="SDA" />
          </div>
          <span className="brand-text">Samruddhi's Dance Academy</span>
        </Link>
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </button>
        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
          <button className="nav-link as-button" onClick={() => sendToSection('classes')}>Classes</button>
          <Link to="/gallery" className="nav-link" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <button className="nav-link as-button" onClick={() => sendToSection('contact')}>Contact</button>
          <div className="nav-actions">
            <Link to="/login" className="nav-btn nav-btn-secondary" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="nav-btn nav-btn-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SharedNav;
