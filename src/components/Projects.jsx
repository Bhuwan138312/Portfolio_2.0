'use client';

import { useState } from 'react';
import useMagnetic from '../hooks/useMagnetic';
import useTilt from '../hooks/useTilt';
import './Projects.css';

import accessaHome from "../assets/AccessaBank/Home'.png";
import accessaPayment from '../assets/AccessaBank/Payment.png';
import accessaHelp from '../assets/AccessaBank/Help.png';
import accessaProfile from '../assets/AccessaBank/Profile.png';

import careEaseHome from '../assets/CareEase/Home.png';
import careEaseCreate from '../assets/CareEase/Create Account.png';
import careEaseLogs from '../assets/CareEase/appointment logs.png';

import edulinkHome from '../assets/Edulink-X/Home (1).png';
import edulinkChat from '../assets/Edulink-X/Chatspace.png';
import edulinkVideo from '../assets/Edulink-X/videobook.png';

import prividHome from '../assets/PrivID/Home Page.png';
import prividWallet from '../assets/PrivID/Wallet.png';
import prividVerify from '../assets/PrivID/verifying 2.png';

import prividDeskHome from '../assets/PrivID_Desktop/First Page.png';
import prividDeskWallet from '../assets/PrivID_Desktop/Credentials.png';
import prividDeskActivity from '../assets/PrivID_Desktop/Activities.png';

import parkfindHome from '../assets/ParkFind/home.png';
import parkfind2nd from '../assets/ParkFind/2nd.png';
import parkfindDetails from '../assets/ParkFind/details.png';

const projects = [
  {
    isFeatured: true,
    title: 'Accessa Bank',
    desc: 'A modern mobile banking UI/UX prototype focused on accessibility. Designed to make banking easier for users with physical disabilities compared to traditional apps.',
    tags: ['Figma', 'UI/UX', 'Accessibility First'],
    figma: 'https://www.figma.com/design/e3XuF3YuWN5iweJVnzRjNw/Untitled?node-id=44-1613&t=zJswSQuZtFA2mS0l-1',
    category: 'UI/UX',
    images: [accessaPayment, accessaHome, accessaHelp],
    features: [
      'Accessibility-first design',
      'Wallet loading & transfers',
      'QR Code Scanning for payments',
      'Bill payments & mobile top-up'
    ]
  },
  {
    isFeatured: true,
    title: 'PrivID',
    desc: 'A mobile digital identity wallet UI/UX prototype designed to let users securely store, manage, and share digital credentials using privacy-focused selective disclosure.',
    tags: ['Figma', 'UI/UX', 'Digital Identity', 'Security'],
    figma: 'https://www.figma.com/design/ZQEBwFH3ZFlcGZ1t4HmASw/HCI_Group_E?node-id=9-2&t=Dplm5xYM33SJtKY8-1',
    category: 'UI/UX',
    images: [prividWallet, prividHome, prividVerify],
    features: [
      'Privacy-first selective disclosure',
      'QR-based credential sharing',
      'Secure document scanning',
      'Identity verification flows'
    ]
  },
  {
    isFeatured: true,
    isWIP: true,
    title: 'ParkFind',
    desc: 'A mobile parking finder app UI/UX prototype designed to help users quickly find nearby spaces, compare options, and view detailed information. (Work in Progress)',
    tags: ['Figma', 'UI/UX', 'Discovery App'],
    figma: 'https://www.figma.com/design/WZ6KC5IiWqlfvWaKEbgNTe/Untitled?node-id=10-337&t=3TlQG1DfbQvXwGXM-1',
    category: 'UI/UX',
    images: [parkfind2nd, parkfindHome, parkfindDetails],
    features: [
      'Interactive map-based discovery',
      'Real-time parking listings & prices',
      'Detailed parking space information',
      'Quick and intuitive navigation'
    ]
  },
  {
    isFeatured: true,
    deviceType: 'desktop',
    title: 'PrivID Desktop',
    desc: 'The desktop web application version of the PrivID digital identity wallet, offering a comprehensive dashboard for managing credentials and monitoring identity verifications on larger screens.',
    tags: ['Figma', 'UI/UX', 'Desktop App', 'Security'],
    figma: 'https://www.figma.com/design/ZQEBwFH3ZFlcGZ1t4HmASw/HCI_Group_E?node-id=9-2&t=Dplm5xYM33SJtKY8-1',
    category: 'UI/UX',
    images: [prividDeskActivity, prividDeskWallet, prividDeskHome],
    features: [
      'Comprehensive desktop dashboard',
      'Detailed credential management',
      'Advanced activity monitoring',
      'Secure web-based verification'
    ]
  },
  {
    isFeatured: true,
    title: 'CareEase',
    desc: 'CareEase is a simple and user-friendly healthcare UI/UX prototype focusing on making essential healthcare services easy to access and navigate through a clean mobile interface.',
    tags: ['Figma', 'UI/UX', 'Healthcare'],
    figma: 'https://www.figma.com/design/yObCFarjl0xwz1QDXNczil/Untitled?node-id=0-1&t=Hr7DfCEqALzbPYSl-1',
    category: 'UI/UX',
    images: [careEaseCreate, careEaseHome, careEaseLogs],
    features: [
      'Simple appointment booking',
      'Emergency assistance & calling',
      'Medicine & health records',
      'Accessibility-focused settings'
    ]
  },
  {
    isFeatured: true,
    title: 'EduLinkX',
    desc: 'A child-focused e-learning platform UI/UX prototype designed to make learning more engaging through interactive courses, live classes, and multimedia resources.',
    tags: ['Figma', 'UI/UX', 'E-Learning'],
    figma: 'https://www.figma.com/design/WcMyZE4l0IIHoS9ZzlpeqD/Untitled?node-id=215-404&t=k3QMlMs7yE9rWKc4-1',
    category: 'UI/UX',
    images: [edulinkVideo, edulinkHome, edulinkChat],
    features: [
      'Child-friendly engaging UI',
      'Multimedia & interactive books',
      'Live classes & video calling',
      'Educational chat system'
    ]
  },
  {
    letter: 'V',
    gradient: ['#9b8ec4', '#c2b8e0'],
    title: 'Vibe Check - VS Code Extension',
    desc: 'An innovative developer wellness extension monitoring coding stress with a glassmorphism UI and AI Mentor sidebar powered by Google Gemini API.',
    tags: ['TypeScript', 'VS Code API', 'Gemini API'],
    live: '#', code: 'https://github.com/Bhuwan138312/Kalu-pandey',
    category: 'Backend'
  },
  {
    letter: 'S',
    gradient: ['#e87c9b', '#f0b0c5'],
    title: 'StockDesk',
    desc: 'Full-stack inventory and sales management system with real-time dashboard, purchase tracking, and automatic stock balancing.',
    tags: ['React', 'Spring Boot', 'SQLite'],
    live: '#', code: 'https://github.com/Bhuwan138312/stockdesk',
    category: 'Backend'
  },
  {
    letter: 'S',
    gradient: ['#6C8EBF', '#9ab5d8'],
    title: 'StorePilot',
    desc: 'Professional desktop inventory management system with integrated accounting, analytics, and daily sales/purchase records.',
    tags: ['Java', 'JavaFX', 'SQLite'],
    live: '#', code: 'https://github.com/Bhuwan138312/StorePilot_Release',
    category: 'Backend'
  },
  {
    letter: 'G',
    gradient: ['#39653F', '#a8c5b0'],
    title: 'GoNepal',
    desc: 'Comprehensive JavaFX tourism management platform featuring destination discovery, guide booking, and a dedicated admin panel.',
    tags: ['Java', 'JavaFX', 'Desktop App'],
    live: '#', code: 'https://github.com/Bhuwan138312/GoNepal.java',
    category: 'Backend'
  },
  {
    letter: 'B',
    gradient: ['#E8A87C', '#f0c5a0'],
    title: 'Banking System Demo',
    desc: 'Fully functional banking simulation with user accounts, deposit/withdrawal transactions, savings interest, and local CSV storage.',
    tags: ['Java', 'JavaFX', 'Finance'],
    live: '#', code: 'https://github.com/Bhuwan138312/Simple_Banking_System_Demo_Javafx',
    category: 'Backend'
  },
  {
    letter: 'C',
    gradient: ['#7cc4b8', '#a8ddd6'],
    title: 'Course Registration',
    desc: 'JavaFX student management system with course browsing, enrollment statistics charts, and profile management.',
    tags: ['Java', 'JavaFX', 'FXML'],
    live: '#', code: 'https://github.com/Bhuwan138312/Simple_student-course-Registration_fxml',
    category: 'Backend'
  },
  {
    letter: 'F',
    gradient: ['#bca87c', '#d6c6a2'],
    title: 'Face Recognition Model',
    desc: 'Computer vision project implementing facial recognition, detection, and identification with image processing and feature extraction.',
    tags: ['Python', 'Machine Learning', 'CV'],
    live: '#', code: 'https://github.com/Bhuwan138312/Face-Recognition-Model',
    category: 'Backend'
  },
  {
    letter: 'W',
    gradient: ['#c48eb6', '#e0b8d8'],
    title: 'Wildfire Prediction',
    desc: 'Predictive machine learning project using advanced algorithms for analyzing data to forecast wildfires.',
    tags: ['Python', 'Jupyter', 'Data Science'],
    live: '#', code: 'https://github.com/Bhuwan138312/mlpc_Wildfire_Prediction.ipynv',
    category: 'Backend'
  },
];

/* ── Single card with its own tilt instance ─── */
function ProjectCard({ p, className = '' }) {
  const { ref, tiltProps } = useTilt({ max: 12, scale: 1.04, ease: 0.10 });

  return (
    <article
      ref={ref}
      className={`project-card ${className}`}
      style={{ willChange: 'transform' }}
      {...tiltProps}
    >
      {/* Glare overlay — position updated by useTilt */}
      <div className="tilt-glare" />

      <div className="card-img-wrap">
        <div
          className="card-img-placeholder"
          style={{ background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
        >
          {p.letter}
        </div>
        <div className="card-overlay">
          {p.live !== '#' && (
            <a href={p.live} className="overlay-btn" target="_blank" rel="noreferrer">↗ Live Demo</a>
          )}
          {p.figma ? (
            <a href={p.figma} className="overlay-btn" target="_blank" rel="noreferrer">🎨 Figma</a>
          ) : (
            <a href={p.code} className="overlay-btn" target="_blank" rel="noreferrer">⌥ Source</a>
          )}
        </div>
      </div>

      <div className="card-body">
        <h3>{p.title}</h3>
        <p>{p.desc}</p>
        <div className="card-tags">
          {p.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </article>
  );
}

/* ── Featured UX Project Card ─── */
function FeaturedUXCard({ p, className = '' }) {
  return (
    <article className={`featured-ux-card ${className}`}>
      <div className="featured-content">
        <div className="featured-badge">Featured UI/UX Design</div>
        <h3>{p.title}</h3>
        <p className="featured-desc">{p.desc}</p>
        
        <ul className="featured-features">
          {p.features?.map((f, i) => (
            <li key={i}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              {f}
            </li>
          ))}
        </ul>

        <div className="featured-actions">
          {p.figma ? (
            <a 
              href={p.figma} 
              className="btn btn-primary" 
              target="_blank" 
              rel="noreferrer"
              style={p.isWIP ? { opacity: 0.85, borderStyle: 'dashed', borderWidth: '2px' } : {}}
            >
              {p.isWIP ? '🚧 Work in Progress' : '🎨 View in Figma'}
            </a>
          ) : (
            <button className="btn btn-primary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              🚧 Work in Progress
            </button>
          )}
        </div>
      </div>
      
      {p.deviceType === 'desktop' ? (
        <div className="desktop-visuals">
          {p.images?.map((img, i) => (
            <div key={i} className={`desktop-frame d-frame-${i}`}>
              <img src={img.src || img} alt={`${p.title} screen ${i + 1}`} />
            </div>
          ))}
        </div>
      ) : (
        <div className="featured-visuals">
          {p.images?.map((img, i) => (
            <div key={i} className={`mockup-frame frame-${i}`}>
              <img src={img.src || img} alt={`${p.title} screen ${i + 1}`} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

/* ── Section ──────────────────────────────────── */
export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState('UI/UX');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const magToggle = useMagnetic(0.35);

  const categories = ['UI/UX', 'Backend'];

  const filteredProjects = projects.filter(
    (p) => p.category === activeCategory
  );

  const featuredProjects = filteredProjects.filter(p => p.isFeatured);
  const regularProjects = filteredProjects.filter(p => !p.isFeatured);

  const handleCarouselScroll = (e) => {
    const el = e.target;
    const snapPoint = el.scrollWidth - el.clientWidth;
    if (snapPoint > 0) {
      const index = Math.round((el.scrollLeft / snapPoint) * (featuredProjects.length - 1));
      if (index !== activeCarouselIndex) {
        setActiveCarouselIndex(index);
      }
    }
  };

  const scrollCarousel = (dir) => {
    const el = document.getElementById('featured-carousel-scroll');
    if (el) {
      el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="projects-header reveal-up">
          <div>
            <span className="section-tag">My Work</span>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Projects</h2>
          </div>
          
          <div className="projects-filter">
            <div 
              className="filter-slider" 
              style={{ 
                transform: activeCategory === 'UI/UX' ? 'translateX(0)' : 'translateX(100%)' 
              }} 
            />
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setShowAll(false); // Reset show more on filter change
                  setActiveCarouselIndex(0); // Reset carousel index
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="projects-content reveal-up">
          {featuredProjects.length > 0 && (
          <div className="featured-carousel-wrap tab-transition" key={`feat-${activeCategory}`}>
            
            {featuredProjects.length > 1 && (
              <div className="carousel-indicators">
                {featuredProjects.map((_, i) => (
                  <button 
                    key={i} 
                    className={`carousel-dot ${activeCarouselIndex === i ? 'active' : ''}`}
                    onClick={() => {
                      const el = document.getElementById('featured-carousel-scroll');
                      if (el) {
                        const snapPoint = el.scrollWidth - el.clientWidth;
                        const scrollPos = (i / (featuredProjects.length - 1)) * snapPoint;
                        el.scrollTo({ left: scrollPos, behavior: 'smooth' });
                      }
                    }}
                    aria-label={`Go to project ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <div 
              id="featured-carousel-scroll" 
              className="featured-carousel"
              onScroll={handleCarouselScroll}
            >
              {featuredProjects.map((p, i) => (
                <div key={p.title} className={`carousel-item ${activeCarouselIndex === i ? 'active' : ''}`}>
                  <FeaturedUXCard p={p} />
                </div>
              ))}
            </div>
            
            {activeCarouselIndex > 0 && (
              <button 
                className="carousel-prev-btn"
                onClick={() => scrollCarousel(-1)}
                aria-label="Previous Featured Project"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}

            {activeCarouselIndex < featuredProjects.length - 1 && (
              <button 
                className="carousel-next-btn"
                onClick={() => scrollCarousel(1)}
                aria-label="Next Featured Project"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </div>
        )}

        {regularProjects.length > 0 && (
          <div className="projects-grid tab-transition" key={`reg-${activeCategory}`} style={{ marginTop: featuredProjects.length > 0 ? '3rem' : '0' }}>
            {regularProjects.slice(0, 6).map((p) => (
              <div key={p.title} className="stagger-item visible">
                <ProjectCard p={p} />
              </div>
            ))}
          </div>
        )}

        <div className={`projects-more-wrap ${showAll ? 'expanded' : ''}`}>
          <div className="projects-more-inner">
            <div className="projects-grid" style={{ paddingTop: '1.75rem' }}>
              {regularProjects.slice(6).map((p) => (
                <div key={p.title} className="stagger-item visible">
                  <ProjectCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>

        {regularProjects.length > 6 && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }} className="reveal-up">
            <button
              ref={magToggle.ref}
              {...magToggle.magneticProps}
              className="btn btn-ghost"
              style={{ willChange: 'transform' }}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less ↑' : 'Show More ↓'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
