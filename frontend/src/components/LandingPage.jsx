import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/images';
import classPhoto from '../assets/images/class-photo-sda.jpeg';
import fullLogo from '../assets/images/full-logo-sda.jpeg';
import '../styles/LandingPageEnhanced.css';

function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

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

  return (
    <div className="landing-page-modern">
      {/* Navigation Bar */}
      <nav className={`modern-nav ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="brand">
            <div className="brand-logo">
              <img src={fullLogo} alt="SDA" />
            </div>
            <span className="brand-text">Samruddhi's Dance Academy</span>
          </Link>
          <div className="nav-menu">
            <Link to="/about" className="nav-link">About</Link>
            <a href="#classes" className="nav-link">Classes</a>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <a href="#contact" className="nav-link">Contact</a>
            <div className="nav-actions">
              <Link to="/login" className="nav-btn nav-btn-secondary">Login</Link>
              <Link to="/signup" className="nav-btn nav-btn-primary">Get Started</Link>
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
                  <div className="feature-icon">🎭</div>
                  <h3>Expert Mentorship</h3>
                  <p>Learn from Guru Samruddhi, trained in traditional Bharatanatyam with extensive performance experience</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📚</div>
                  <h3>Holistic Curriculum</h3>
                  <p>Theory and practice combined - from Natyashastra to stage presence and cultural context</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🎪</div>
                  <h3>Performance Ready</h3>
                  <p>Regular stage performances, cultural events, and preparation for Arangetram ceremonies</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💻</div>
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
          <div className="section-header centered">
            <div className="section-tag">Programs</div>
            <h2 className="section-title">Choose Your Path</h2>
            <p className="section-subtitle">Tailored programs for every skill level, from beginners to advanced performers</p>
          </div>

          <div className="classes-grid-modern">
            <div className="class-card-modern">
              <div className="class-header">
                <div className="class-icon">🌱</div>
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
                <div className="class-icon">🔥</div>
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
                <div className="class-icon">⭐</div>
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
          <div className="section-header centered">
            <div className="section-tag">Moments</div>
            <h2 className="section-title">Gallery</h2>
            <p className="section-subtitle">Glimpses of performances, traditions, and our artistic journey</p>
          </div>

          <div className="gallery-grid-modern">
            <div className="gallery-item-modern large">
              <img src={IMAGES.bharatanatyam.pose2} alt="Classical Performance" />
              <div className="gallery-overlay-modern">
                <div className="overlay-content">
                  <h4>Classical Performance</h4>
                  <p>Traditional Bharatanatyam showcase</p>
                </div>
              </div>
            </div>
            <div className="gallery-item-modern">
              <img src={IMAGES.temple.main} alt="Chidambaram Temple" />
              <div className="gallery-overlay-modern">
                <div className="overlay-content">
                  <h4>Sacred Spaces</h4>
                  <p>Chidambaram Temple</p>
                </div>
              </div>
            </div>
            <div className="gallery-item-modern">
              <img src={IMAGES.bharatanatyam.group1} alt="Group Performance" />
              <div className="gallery-overlay-modern">
                <div className="overlay-content">
                  <h4>Group Performance</h4>
                  <p>Ensemble excellence</p>
                </div>
              </div>
            </div>
            <div className="gallery-item-modern">
              <img src={IMAGES.temple.nataraja1} alt="Lord Nataraja" />
              <div className="gallery-overlay-modern">
                <div className="overlay-content">
                  <h4>Lord Nataraja</h4>
                  <p>The cosmic dancer</p>
                </div>
              </div>
            </div>
            <div className="gallery-item-modern tall">
              <img src={IMAGES.bharatanatyam.pose3} alt="Dance Expression" />
              <div className="gallery-overlay-modern">
                <div className="overlay-content">
                  <h4>Expression</h4>
                  <p>Abhinaya in motion</p>
                </div>
              </div>
            </div>
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
                  <div className="info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="info-text">
                    <div className="info-label">Location</div>
                    <div className="info-value">123 Temple Street, Cultural District, Pune</div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="info-text">
                    <div className="info-label">Phone</div>
                    <div className="info-value">+91 98765 43210</div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="info-text">
                    <div className="info-label">Email</div>
                    <div className="info-value">info@samruddhidance.com</div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
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
