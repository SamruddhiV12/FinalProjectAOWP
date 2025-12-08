import React, { useState } from 'react';
import { FEATURED_GALLERY } from '../constants/images';
import SharedNav from './SharedNav';
import '../styles/Gallery.css';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: '🎭' },
  ];

  // Filter items by category
  const filteredItems = selectedCategory === 'all'
    ? FEATURED_GALLERY
    : FEATURED_GALLERY.filter(item => item.category === selectedCategory);

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
      <SharedNav />

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
                ? FEATURED_GALLERY.length
                : FEATURED_GALLERY.filter(item => item.category === category.id).length})
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
    </div>
  );
};

export default Gallery;
