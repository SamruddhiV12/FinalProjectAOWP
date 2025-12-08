import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IMAGES, FEATURED_GALLERY } from '../constants/images';
import classPhoto from '../assets/images/class-photo-sda.jpeg';
import fullLogo from '../assets/images/full-logo-sda.jpeg';
import '../styles/LandingPageEnhanced.css';

function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const target = location.state.scrollTo;
      setTimeout(() => {
        if (target === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const galleryPreviewItems = FEATURED_GALLERY.slice(0, 3);
  const getGalleryLayout = () => '';

  const scrollToSection = (section) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavClick = (section) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } });
      return;
    }
    scrollToSection(section);
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
    <div className="landing-page-modern">
      {/* Navigation Bar */}
      <nav className={`modern-nav ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="nav-container">
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
            <button className="nav-link as-button" onClick={handleNavClick('classes')}>Classes</button>
            <Link to="/gallery" className="nav-link" onClick={() => setMenuOpen(false)}>Gallery</Link>
            <button className="nav-link as-button" onClick={handleNavClick('contact')}>Contact</button>
            <div className="nav-actions">
              <Link to="/login" className="nav-btn nav-btn-secondary" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="nav-btn nav-btn-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - CLASS PHOTO ONLY (NO TEXT) */}
      <section className="hero-modern">
        <div className="hero-image-container">
          <img
            src={classPhoto}
            alt="Samruddhi's Dance Academy Class"
            className="hero-image"
          />
        </div>
      </section>

      {/* Hero Text Section - BELOW PHOTO */}
      <section className="hero-text-section">
        <div className="container">
          <div className="hero-text-content">
            <div className="hero-badge">Classical Bharatanatyam · Pune</div>
            <h1 className="hero-title">Samruddhi's Dance Academy</h1>
            <p className="hero-subtitle">Where tradition meets excellence in classical Indian dance</p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn-hero-primary">Join the Academy</Link>
              <Link to="/about" className="btn-hero-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">10+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">100+</div>
              <div className="stat-label">Students Trained</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">50+</div>
              <div className="stat-label">Performances</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`section-modern about-section-modern animate-on-scroll ${isVisible.about ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Our Story</div>
            <h2 className="section-title">Preserving Heritage,<br />Inspiring Excellence</h2>
          </div>

          <div className="about-grid">
            <div className="about-content">
              <div className="about-text">
                <p className="lead-text">
                  Established with a vision to preserve and propagate the classical art of Bharatanatyam,
                  Samruddhi's Dance Academy has been nurturing dancers for over a decade.
                </p>
                <p>
                  Our curriculum is rooted in the traditional Margam structure, encompassing both theoretical
                  knowledge from ancient texts like Natyashastra and Abhinaya Darpana, and rigorous practical
                  training. Under the guidance of Guru Samruddhi, students are prepared for various levels of
                  examinations and stage performances.
                </p>
                <p>
                  We believe in holistic development, focusing not just on technique, but on understanding
                  the spiritual and cultural essence of each movement.
                </p>
              </div>

              <div className="feature-cards">
                <div className="feature-card">
                  <div className="feature-icon-line"></div>
                  <h3>Expert Mentorship</h3>
                  <p>Learn from Guru Samruddhi, trained in traditional Bharatanatyam with extensive performance experience</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-line"></div>
                  <h3>Holistic Curriculum</h3>
                  <p>Theory and practice combined - from Natyashastra to stage presence and cultural context</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-line"></div>
                  <h3>Performance Ready</h3>
                  <p>Regular stage performances, cultural events, and preparation for Arangetram ceremonies</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-line"></div>
                  <h3>Modern Tools</h3>
                  <p>Digital assignments, progress tracking, online materials, and flexible learning options</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className={`section-modern classes-section-modern animate-on-scroll ${isVisible.classes ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header inline">
            <div className="section-tag">Programs</div>
            <h2 className="section-title">Choose Your Path</h2>
            <p className="section-subtitle">Tailored programs for every skill level, from beginners to advanced performers</p>
          </div>

          <div className="classes-grid-modern">
            <div className="class-card-modern">
              <div className="class-header">
                <div className="class-level">Basic Level</div>
              </div>
              <h3 className="class-title">Foundation</h3>
              <p className="class-description">
                Begin your journey with fundamentals. Master Adavus, Aramandi, and basic rhythms
                while exploring Natyashastra concepts.
              </p>
              <div className="class-features">
                <div className="class-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  60-minute sessions
                </div>
                <div className="class-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Twice weekly
                </div>
                <div className="class-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Age 6 and above
                </div>
              </div>
              <Link to="/signup" className="class-cta">Enroll Now →</Link>
            </div>

            <div className="class-card-modern featured">
              <div className="popular-badge">Most Popular</div>
              <div className="class-header">
                <div className="class-level">Intermediate</div>
              </div>
              <h3 className="class-title">Advancement</h3>
              <p className="class-description">
                Elevate your skills with advanced Adavus, Jatiswaram, and Shabdam.
                Prepare for Madhyamaa examinations.
              </p>
              <div className="class-features">
                <div className="class-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  90-minute sessions
                </div>
                <div className="class-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Twice weekly
                </div>
                <div className="class-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  1-2 years experience
                </div>
              </div>
              <Link to="/signup" className="class-cta">Enroll Now →</Link>
            </div>

            <div className="class-card-modern">
              <div className="class-header">
                <div className="class-level">Advanced</div>
              </div>
              <h3 className="class-title">Mastery</h3>
              <p className="class-description">
                Perfect your craft with Varnams, Padams, and complete Margam.
                Prepare for stage performances and Arangetram.
              </p>
              <div className="class-features">
                <div className="class-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  90-minute sessions
                </div>
                <div className="class-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Twice weekly
                </div>
                <div className="class-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.666 5L7.49935 14.1667L3.33268 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  3+ years experience
                </div>
              </div>
              <Link to="/signup" className="class-cta">Enroll Now →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className={`section-modern gallery-section-modern animate-on-scroll ${isVisible.gallery ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header inline">
            <div className="section-tag">Moments</div>
            <h2 className="section-title">Gallery</h2>
            <p className="section-subtitle">Glimpses of performances, traditions, and our artistic journey</p>
          </div>

          <div className="gallery-grid-modern">
            {galleryPreviewItems.map((item, index) => (
              <div
                key={item.id}
                className={`gallery-item-modern ${getGalleryLayout(index)}`}
              >
                <img src={item.src} alt={item.title} />
                <div className="gallery-overlay-modern">
                  <div className="overlay-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-cta-modern">
            <Link to="/gallery" className="btn-modern-outline">
              View Full Gallery
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`section-modern contact-section-modern animate-on-scroll ${isVisible.contact ? 'visible' : ''}`}>
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-content">
              <div className="section-tag">Get in Touch</div>
              <h2 className="section-title">Start Your<br />Dance Journey</h2>
              <p className="contact-description">
                Join us and experience the beauty of Bharatanatyam. Limited seats available for the new batch.
              </p>

              <div className="contact-info-grid">
                <div className="contact-info-item">
                  <div className="info-text">
                    <div className="info-label">Location</div>
                    <div className="info-value">123 Temple Street, Cultural District, Pune</div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-text">
                    <div className="info-label">Phone</div>
                    <div className="info-value">+91 98765 43210</div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-text">
                    <div className="info-label">Email</div>
                    <div className="info-value">info@samruddhidance.com</div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-text">
                    <div className="info-label">Class Timings</div>
                    <div className="info-value">Mon-Sat: 4:00 PM - 8:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-cta-card">
              <div className="cta-card-content">
                <h3>Ready to begin?</h3>
                <p>Take the first step towards mastering Bharatanatyam. Enroll now and join our community of passionate dancers.</p>
                <Link to="/signup" className="btn-modern-primary">
                  Enroll Now
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-modern">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={fullLogo} alt="SDA" />
              </div>
              <h4>Samruddhi's Dance Academy</h4>
              <p>Preserving tradition, inspiring excellence in classical Bharatanatyam.</p>
            </div>

            <div className="footer-links-group">
              <h5>Quick Links</h5>
              <Link to="/about">About Us</Link>
              <a href="#classes">Classes</a>
              <Link to="/gallery">Gallery</Link>
              <a href="#contact">Contact</a>
            </div>

            <div className="footer-links-group">
              <h5>Programs</h5>
              <a href="#classes">Basic Level</a>
              <a href="#classes">Intermediate</a>
              <a href="#classes">Advanced</a>
              <Link to="/signup">Enrollment</Link>
            </div>

            <div className="footer-links-group">
              <h5>Connect</h5>
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">YouTube</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Samruddhi's Dance Academy. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
