import React, { useState } from 'react';
import { IMAGES } from '../constants/images';
import '../styles/Gallery.css';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: '🎭' },
    { id: 'performances', name: 'Performances', icon: '💃' },
    { id: 'temple', name: 'Chidambaram Temple', icon: '🕉️' },
    { id: 'cultural', name: 'Cultural', icon: '🎵' },
    { id: 'costumes', name: 'Costumes & Jewelry', icon: '👗' },
  ];

  const galleryItems = {
    all: [
      { id: 1, src: IMAGES.bharatanatyam.pose1, title: 'Classical Bharatanatyam Pose', category: 'performances', description: 'A graceful portrayal of traditional Bharatanatyam' },
      { id: 2, src: IMAGES.bharatanatyam.pose2, title: 'Dance Expression', category: 'performances', description: 'Capturing the essence of Abhinaya' },
      { id: 3, src: IMAGES.temple.main, title: 'Chidambaram Temple', category: 'temple', description: 'The sacred abode of Lord Nataraja' },
      { id: 4, src: IMAGES.bharatanatyam.group1, title: 'Group Performance', category: 'performances', description: 'Students performing in synchrony' },
      { id: 5, src: IMAGES.temple.gopuram, title: 'Temple Gopuram', category: 'temple', description: 'Majestic temple tower architecture' },
      { id: 6, src: IMAGES.bharatanatyam.costume1, title: 'Traditional Costume', category: 'costumes', description: 'Authentic Bharatanatyam attire' },
      { id: 7, src: IMAGES.cultural.veena, title: 'Veena', category: 'cultural', description: 'Classical South Indian string instrument' },
      { id: 8, src: IMAGES.bharatanatyam.pose3, title: 'Mudra Expression', category: 'performances', description: 'Intricate hand gestures telling stories' },
      { id: 9, src: IMAGES.temple.architecture, title: 'Temple Architecture', category: 'temple', description: 'Intricate carvings and sculptures' },
      { id: 10, src: IMAGES.cultural.mridangam, title: 'Mridangam', category: 'cultural', description: 'Traditional percussion instrument' },
      { id: 11, src: IMAGES.bharatanatyam.jewelry, title: 'Traditional Jewelry', category: 'costumes', description: 'Ornate dance jewelry and accessories' },
      { id: 12, src: IMAGES.bharatanatyam.pose4, title: 'Dance Pose', category: 'performances', description: 'Perfect form and technique' },
      { id: 13, src: IMAGES.temple.nataraja1, title: 'Lord Nataraja', category: 'temple', description: 'The cosmic dancer - inspiration for Bharatanatyam' },
      { id: 14, src: IMAGES.cultural.flowers, title: 'Temple Flowers', category: 'cultural', description: 'Sacred jasmine offerings' },
      { id: 15, src: IMAGES.bharatanatyam.group2, title: 'Student Ensemble', category: 'performances', description: 'Annual day celebration performance' },
      { id: 16, src: IMAGES.temple.pillars, title: 'Temple Pillars', category: 'temple', description: 'Architectural marvels of ancient craftsmanship' },
      { id: 17, src: IMAGES.bharatanatyam.costume2, title: 'Dance Attire', category: 'costumes', description: 'Vibrant traditional costume' },
      { id: 18, src: IMAGES.cultural.diya, title: 'Traditional Lamp', category: 'cultural', description: 'Symbol of knowledge and enlightenment' },
    ],
  };

  // Filter items by category
  const filteredItems = selectedCategory === 'all'
    ? galleryItems.all
    : galleryItems.all.filter(item => item.category === selectedCategory);

  const openLightbox = (item) => {
    setSelectedImage(item);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredItems.length;
    } else {
      newIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    }

    setSelectedImage(filteredItems[newIndex]);
  };

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="gallery-header">
        <h1>Gallery</h1>
        <p>Explore the beauty of Bharatanatyam and our cultural heritage</p>
      </div>

      {/* Category Filter */}
      <div className="gallery-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="filter-icon">{category.icon}</span>
            <span>{category.name}</span>
            <span className="filter-count">
              ({category.id === 'all'
                ? galleryItems.all.length
                : galleryItems.all.filter(item => item.category === category.id).length})
            </span>
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="gallery-item"
            onClick={() => openLightbox(item)}
          >
            <div className="gallery-image-wrapper">
              <img src={item.src} alt={item.title} loading="lazy" />
              <div className="gallery-overlay">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button className="view-btn">View Full Size</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div className="lightbox-modal" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>

            <button className="lightbox-nav prev" onClick={() => navigateImage('prev')}>
              ‹
            </button>

            <div className="lightbox-image-container">
              <img src={selectedImage.src} alt={selectedImage.title} />
              <div className="lightbox-info">
                <h2>{selectedImage.title}</h2>
                <p>{selectedImage.description}</p>
              </div>
            </div>

            <button className="lightbox-nav next" onClick={() => navigateImage('next')}>
              ›
            </button>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="gallery-stats">
        <div className="stat-card">
          <div className="stat-icon">📸</div>
          <div className="stat-number">{galleryItems.all.length}+</div>
          <div className="stat-label">Photos</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎭</div>
          <div className="stat-number">100+</div>
          <div className="stat-label">Performances</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-number">50+</div>
          <div className="stat-label">Awards Won</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌟</div>
          <div className="stat-number">12+</div>
          <div className="stat-label">Years of Excellence</div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
