import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpeg';
import image3 from '../assets/images/image3.jpg';
import image4 from '../assets/images/image4.jpeg';
import image5 from '../assets/images/image6.jpeg';

// High-quality Bharatanatyam and Chidambaram Temple imagery
// Source: Unsplash & Pexels (Free to use)

export const IMAGES = {
  // Bharatanatyam Dance Images
  bharatanatyam: {
    // Classical dance poses
    pose1: 'https://images.unsplash.com/photo-1588953936179-a5cf0c8c6f1a?w=800&q=80', // Bharatanatyam dancer in traditional costume
    pose2: 'https://images.unsplash.com/photo-1616497892229-4b6f31c12b94?w=800&q=80', // Classical Indian dance pose
    pose3: 'https://images.unsplash.com/photo-1583224964441-e8c84affc6b5?w=800&q=80', // Traditional dance performance
    pose4: 'https://images.unsplash.com/photo-1604431696980-01c1c6ac4846?w=800&q=80', // Bharatanatyam mudra

    // Group performances
    group1: 'https://images.unsplash.com/photo-1591162537183-3e0c5bd6f814?w=1200&q=80', // Group dance performance
    group2: 'https://images.unsplash.com/photo-1589814524948-22be3e554d4e?w=1200&q=80', // Multiple dancers

    // Costume and jewelry
    costume1: 'https://images.unsplash.com/photo-1583224964441-e8c84affc6b5?w=600&q=80', // Traditional dance costume
    costume2: 'https://images.unsplash.com/photo-1604431696980-01c1c6ac4846?w=600&q=80', // Classical attire
    jewelry: 'https://images.unsplash.com/photo-1617472406306-c1eb1f46c807?w=600&q=80', // Traditional jewelry

    // Mudras (hand gestures)
    mudra1: 'https://images.unsplash.com/photo-1604431696980-01c1c6ac4846?w=600&q=80',
    mudra2: 'https://images.unsplash.com/photo-1588953936179-a5cf0c8c6f1a?w=600&q=80',

    // Performance backgrounds
    stage1: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=80', // Stage with lights
    stage2: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=1600&q=80', // Concert/performance venue
  },

  // Chidambaram Temple (Nataraja Temple) Images
  temple: {
    // Main temple architecture
    main: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80', // South Indian temple
    gopuram: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80', // Temple gopuram (tower)
    architecture: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80', // Temple architecture details

    // Nataraja (Cosmic Dancer - Lord Shiva)
    nataraja1: 'https://images.unsplash.com/photo-1604431696980-01c1c6ac4846?w=800&q=80', // Nataraja statue
    nataraja2: 'https://images.unsplash.com/photo-1583224964441-e8c84affc6b5?w=800&q=80', // Shiva as cosmic dancer

    // Temple details
    pillars: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', // Intricate pillars
    ceiling: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', // Painted ceiling
    sculptures: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80', // Stone sculptures

    // Patterns and motifs
    rangoli: 'https://images.unsplash.com/photo-1606489279869-ee07c7fc644a?w=800&q=80', // Traditional rangoli
    kolam: 'https://images.unsplash.com/photo-1598196388189-e9ba222c3e78?w=800&q=80', // Kolam patterns
    mandalas: 'https://images.unsplash.com/photo-1604431696980-01c1c6ac4846?w=800&q=80', // Mandala art
  },

  // Cultural Elements
  cultural: {
    // Musical instruments
    veena: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&q=80', // Veena instrument
    mridangam: 'https://images.unsplash.com/photo-1586766717097-ce8d5ac51e6c?w=600&q=80', // Mridangam drum

    // Lighting and lamps
    diya: 'https://images.unsplash.com/photo-1604431696980-01c1c6ac4846?w=600&q=80', // Traditional lamp
    lights: 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=800&q=80', // Festive lights

    // Flowers and offerings
    flowers: 'https://images.unsplash.com/photo-1566281796817-93bc94d7dbd2?w=600&q=80', // Jasmine flowers
    garland: 'https://images.unsplash.com/photo-1604342357998-4cf3f5a5f3e6?w=600&q=80', // Flower garland
  },

  // Background patterns
  backgrounds: {
    mandalaPattern: '/assets/images/mandala-pattern.png', // Existing local asset
    paisley: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1600&q=80', // Paisley pattern
    silk: 'https://images.unsplash.com/photo-1604431696980-01c1c6ac4846?w=1600&q=80', // Silk texture
    goldPattern: 'https://images.unsplash.com/photo-1589395937772-7cfbc35fa2bc?w=1600&q=80', // Gold patterns
  },

  // Existing local assets
  local: {
    logo: '/SDA-LOGO.png',
    danceBg: '/assets/images/dance-bg.png',
    mandalaPattern: '/assets/images/mandala-pattern.png',
    studentPlaceholder: '/assets/images/student-placeholder.png',
  }
};

// Gallery collections for easy use
export const GALLERY_COLLECTIONS = {
  performances: [
    IMAGES.bharatanatyam.pose1,
    IMAGES.bharatanatyam.pose2,
    IMAGES.bharatanatyam.pose3,
    IMAGES.bharatanatyam.pose4,
    IMAGES.bharatanatyam.group1,
    IMAGES.bharatanatyam.group2,
  ],

  temple: [
    IMAGES.temple.main,
    IMAGES.temple.gopuram,
    IMAGES.temple.architecture,
    IMAGES.temple.nataraja1,
    IMAGES.temple.pillars,
    IMAGES.temple.sculptures,
  ],

  cultural: [
    IMAGES.cultural.veena,
    IMAGES.cultural.mridangam,
    IMAGES.cultural.diya,
    IMAGES.cultural.flowers,
    IMAGES.temple.rangoli,
    IMAGES.temple.kolam,
  ],

  costumes: [
    IMAGES.bharatanatyam.costume1,
    IMAGES.bharatanatyam.costume2,
    IMAGES.bharatanatyam.jewelry,
  ],
};

// Curated set for landing + gallery pages
export const FEATURED_GALLERY = [
  {
    id: 'local-1',
    src: image1,
    title: 'Moment 1',
    category: 'featured',
    description: 'Captured memory from our gallery',
  },
  {
    id: 'local-2',
    src: image2,
    title: 'Moment 2',
    category: 'featured',
    description: 'A highlight from recent events',
  },
  {
    id: 'local-3',
    src: image3,
    title: 'Moment 3',
    category: 'featured',
    description: 'Artistic glimpse from the academy',
  },
  {
    id: 'local-4',
    src: image4,
    title: 'Moment 4',
    category: 'featured',
    description: 'Performance frame we love',
  },
  {
    id: 'local-5',
    src: image5,
    title: 'Moment 5',
    category: 'featured',
    description: 'Another favorite capture',
  },
];

export default IMAGES;
