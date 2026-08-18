'use client';

import { useState } from 'react';
import useMagnetic from '../hooks/useMagnetic';
import useTilt from '../hooks/useTilt';
import './Projects.css';

import accessaHome from "../assets/AccessaBank/Home'.png";
import { projects } from '../data/projectsData';

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
  const { ref, tiltProps } = useTilt({ max: 5, scale: 1.02, ease: 0.10 });

  return (
    <article
      ref={ref}
      className={`featured-ux-card ${className}`}
      style={{ willChange: 'transform' }}
      {...tiltProps}
    >
      <div className="featured-content" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'inherit' }}>
        <div className="tilt-glare" style={{ zIndex: 0, borderRadius: 'inherit' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
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
