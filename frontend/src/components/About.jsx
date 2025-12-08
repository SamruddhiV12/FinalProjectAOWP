import React from 'react';
import { Link } from 'react-router-dom';
import SharedNav from './SharedNav';
import introImg from '../assets/images/image2.jpeg';
import founderImg from '../assets/images/image3.jpg';
import heroImg from '../assets/images/image1.jpg';
import heritageImg1 from '../assets/images/image4.jpeg';
import heritageImg2 from '../assets/images/image6.jpeg';
import templeMain from '../assets/images/image1.jpg';
import templeDetail from '../assets/images/image2.jpeg';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <SharedNav />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <img src={heroImg} alt="Academy showcase" className="about-hero-bg" />
        <div className="about-hero-content">
          <h1>Our Story</h1>
          <p>Preserving the Divine Art of Bharatanatyam</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-intro">
        <div className="about-container">
          <div className="intro-grid">
            <div className="intro-image">
              <img src={introImg} alt="Bharatanatyam Performance" />
              <div className="intro-image-decoration"></div>
            </div>
            <div className="intro-content">
              <h2>Welcome to Samruddhi's Dance Academy</h2>
              <p className="intro-lead">
                Where the sacred tradition of Bharatanatyam comes alive through dedication,
                passion, and unwavering commitment to excellence.
              </p>
              <p>
                Established over a decade ago, Samruddhi's Dance Academy has been a beacon
                of classical Indian dance education. We believe that Bharatanatyam is not just
                an art form—it is a spiritual journey, a cultural heritage, and a pathway to
                self-discovery.
              </p>
              <p>
                Our academy takes its inspiration from the Chidambaram Temple, the cosmic
                abode of Lord Nataraja, the divine dancer whose eternal dance symbolizes
                the rhythmic movement of the universe itself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="about-container">
          <div className="founder-grid">
            <div className="founder-content">
              <h2>Meet Our Founder</h2>
              <h3>Guru Samruddhi</h3>
              <p>
                Guru Samruddhi is a distinguished Bharatanatyam exponent with over 15 years
                of dedicated training under renowned masters of the art form. Her journey
                began at the tender age of 5, and her passion for this divine dance has
                only intensified over the years.
              </p>
              <p>
                Trained in the traditional Margam repertoire, Guru Samruddhi has performed
                at prestigious venues across India, including temple festivals in Chidambaram,
                Madurai, and Thanjavur. Her Arangetram was held at the sacred Nataraja Temple
                in Chidambaram, marking the beginning of her journey as a performer and teacher.
              </p>
              <p>
                Her teaching philosophy centers on holistic development—combining technical
                precision with emotional expression (Abhinaya), theoretical knowledge with
                practical application, and individual growth with ensemble performance.
              </p>
              <div className="founder-achievements">
                <div className="achievement-item">
                  <div className="achievement-marker"></div>
                  <p>Natya Visharada Certification</p>
                </div>
                <div className="achievement-item">
                  <div className="achievement-marker"></div>
                  <p>100+ Stage Performances</p>
                </div>
                <div className="achievement-item">
                  <div className="achievement-marker"></div>
                  <p>500+ Students Trained</p>
                </div>
                <div className="achievement-item">
                  <div className="achievement-marker"></div>
                  <p>Certified by Sangeet Natak Akademi</p>
                </div>
              </div>
            </div>
            <div className="founder-image">
              <img src={founderImg} alt="Guru Samruddhi" />
              <div className="founder-quote">
                <p>"Dance is the hidden language of the soul. Through Bharatanatyam, we speak to the divine."</p>
                <span>— Guru Samruddhi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bharatanatyam Heritage */}
      <section className="heritage-section">
        <div className="about-container">
          <h2>The Sacred Art of Bharatanatyam</h2>
          <p className="heritage-intro">
            Bharatanatyam is one of the oldest classical dance forms of India, originating
            in the temples of Tamil Nadu over 2,000 years ago.
          </p>

          <div className="heritage-grid">
            <div className="heritage-card">
              <img src={heritageImg1} alt="Lord Nataraja" />
              <h3>Divine Origins</h3>
              <p>
                Rooted in the cosmic dance of Lord Shiva (Nataraja), Bharatanatyam embodies
                the creation, preservation, and destruction of the universe through rhythm
                and movement.
              </p>
            </div>

            <div className="heritage-card">
              <img src={heritageImg2} alt="Temple Architecture" />
              <h3>Temple Tradition</h3>
              <p>
                Originally performed in temple sanctums as offerings to deities, this sacred
                art form has evolved while maintaining its spiritual essence and devotional roots.
              </p>
            </div>

            <div className="heritage-card">
              <img src={introImg} alt="Mudras" />
              <h3>Language of Gestures</h3>
              <p>
                Bharatanatyam uses 108 Karanas (basic dance units) and countless Mudras
                (hand gestures) to tell stories from Hindu mythology and express deep emotions.
              </p>
            </div>

            <div className="heritage-card">
              <img src={founderImg} alt="Mridangam" />
              <h3>Rhythm & Music</h3>
              <p>
                Accompanied by Carnatic music, the Mridangam drum, and soulful vocals,
                Bharatanatyam synchronizes intricate footwork with complex rhythmic patterns (Tala).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chidambaram Connection */}
      <section className="chidambaram-section">
        <div className="about-container">
          <div className="chidambaram-content">
            <div className="chidambaram-text">
              <h2>Our Connection to Chidambaram</h2>
              <p>
                The Chidambaram Temple, also known as the Nataraja Temple, holds a special
                place in our academy's heart. This ancient temple is the cosmic center of
                Bharatanatyam, where Lord Shiva performed his Ananda Tandava—the dance of bliss.
              </p>
              <p>
                Every year, our academy organizes a pilgrimage to Chidambaram, where students
                have the privilege of performing in the temple's hallowed halls. This spiritual
                experience connects them directly to the origins of their art.
              </p>
              <p>
                The 108 Karanas (dance poses) depicted in the temple's sculptures serve as
                our visual textbook, reminding us that every movement in Bharatanatyam is
                not merely technical—it is sacred.
              </p>
            </div>
            <div className="chidambaram-images">
              <img src={templeMain} alt="Temple Gopuram" className="temple-img-main" />
              <img src={templeDetail} alt="Temple Pillars" className="temple-img-small" />
            </div>
          </div>
        </div>
      </section>

      {/* Academy Values */}
      <section className="values-section">
        <div className="about-container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-marker"></div>
              <h3>Tradition with Reverence</h3>
              <p>We honor the classical Margam repertoire and ancient texts like the Natyashastra while adapting to contemporary teaching methods.</p>
            </div>

            <div className="value-card">
              <div className="value-marker"></div>
              <h3>Excellence in Technique</h3>
              <p>From Aramandi (half-sitting posture) to intricate Jathis, we ensure every student masters the fundamentals with precision.</p>
            </div>

            <div className="value-card">
              <div className="value-marker"></div>
              <h3>Expressive Abhinaya</h3>
              <p>Beyond steps, we teach Rasa (emotion) and Bhava (expression), helping dancers connect emotionally with their performances.</p>
            </div>

            <div className="value-card">
              <div className="value-marker"></div>
              <h3>Cultural Ambassadors</h3>
              <p>Our students represent Indian classical arts in schools, festivals, and international stages, spreading the beauty of Bharatanatyam.</p>
            </div>

            <div className="value-card">
              <div className="value-marker"></div>
              <h3>Inclusive Community</h3>
              <p>We welcome students of all ages, backgrounds, and abilities, fostering a supportive family atmosphere.</p>
            </div>

            <div className="value-card">
              <div className="value-marker"></div>
              <h3>Continuous Growth</h3>
              <p>Through regular assessments, workshops with guest artists, and performance opportunities, we ensure constant progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="timeline-section">
        <div className="about-container">
          <h2>Our Journey</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">2012</div>
              <div className="timeline-content">
                <h3>Foundation</h3>
                <p>Samruddhi's Dance Academy was established with just 5 students and a dream to preserve Bharatanatyam.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2014</div>
              <div className="timeline-content">
                <h3>First Arangetram</h3>
                <p>Our first student completed her Arangetram (debut performance) at the age of 15—a proud moment for the academy.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2016</div>
              <div className="timeline-content">
                <h3>Chidambaram Pilgrimage</h3>
                <p>Organized our first annual trip to Chidambaram Temple, establishing a sacred tradition.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2018</div>
              <div className="timeline-content">
                <h3>100 Students Milestone</h3>
                <p>Crossed 100 active students across Basic, Intermediate, and Advanced batches.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2020</div>
              <div className="timeline-content">
                <h3>Digital Transformation</h3>
                <p>Launched online classes and digital learning portal during the pandemic, reaching students worldwide.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2023</div>
              <div className="timeline-content">
                <h3>Award Recognition</h3>
                <p>Received the "Best Classical Dance Academy" award from the State Cultural Board.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2025</div>
              <div className="timeline-content">
                <h3>500+ Students Trained</h3>
                <p>Proud to have trained over 500 students who continue to spread the art of Bharatanatyam globally.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <div className="about-container">
          <div className="cta-content">
            <h2>Begin Your Bharatanatyam Journey</h2>
            <p>Join our vibrant community of dancers and discover the transformative power of classical dance.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn-cta-primary">Enroll Now</Link>
              <Link to="/gallery" className="btn-cta-secondary">View Our Performances</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
