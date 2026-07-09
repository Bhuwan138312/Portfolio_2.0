import { useState, useEffect } from 'react';
import './Projects.css';

const projects = [
  {
    letter: 'V',
    gradient: ['#9b8ec4', '#c2b8e0'],
    title: 'Vibe Check - VS Code Extension',
    desc: 'An innovative developer wellness extension monitoring coding stress with a glassmorphism UI and AI Mentor sidebar powered by Google Gemini API.',
    tags: ['TypeScript', 'VS Code API', 'Gemini API'],
    live: '#', code: 'https://github.com/Bhuwan138312/Kalu-pandey',
  },
  {
    letter: 'S',
    gradient: ['#e87c9b', '#f0b0c5'],
    title: 'StockDesk',
    desc: 'Full-stack inventory and sales management system with real-time dashboard, purchase tracking, and automatic stock balancing.',
    tags: ['React', 'Spring Boot', 'SQLite'],
    live: '#', code: 'https://github.com/Bhuwan138312/stockdesk',
  },
  {
    letter: 'S',
    gradient: ['#6C8EBF', '#9ab5d8'],
    title: 'StorePilot',
    desc: 'Professional desktop inventory management system with integrated accounting, analytics, and daily sales/purchase records.',
    tags: ['Java', 'JavaFX', 'SQLite'],
    live: '#', code: 'https://github.com/Bhuwan138312/StorePilot_Release',
  },
  {
    letter: 'G',
    gradient: ['#7C9885', '#a8c5b0'],
    title: 'GoNepal',
    desc: 'Comprehensive JavaFX tourism management platform featuring destination discovery, guide booking, and a dedicated admin panel.',
    tags: ['Java', 'JavaFX', 'Desktop App'],
    live: '#', code: 'https://github.com/Bhuwan138312/GoNepal.java',
  },
  {
    letter: 'B',
    gradient: ['#E8A87C', '#f0c5a0'],
    title: 'Banking System Demo',
    desc: 'Fully functional banking simulation with user accounts, deposit/withdrawal transactions, savings interest, and local CSV storage.',
    tags: ['Java', 'JavaFX', 'Finance'],
    live: '#', code: 'https://github.com/Bhuwan138312/Simple_Banking_System_Demo_Javafx',
  },
  {
    letter: 'C',
    gradient: ['#7cc4b8', '#a8ddd6'],
    title: 'Course Registration',
    desc: 'JavaFX student management system with course browsing, enrollment statistics charts, and profile management.',
    tags: ['Java', 'JavaFX', 'FXML'],
    live: '#', code: 'https://github.com/Bhuwan138312/Simple_student-course-Registration_fxml',
  },
  {
    letter: 'F',
    gradient: ['#bca87c', '#d6c6a2'],
    title: 'Face Recognition Model',
    desc: 'Computer vision project implementing facial recognition, detection, and identification with image processing and feature extraction.',
    tags: ['Python', 'Machine Learning', 'CV'],
    live: '#', code: 'https://github.com/Bhuwan138312/Face-Recognition-Model',
  },
  {
    letter: 'W',
    gradient: ['#c48eb6', '#e0b8d8'],
    title: 'Wildfire Prediction',
    desc: 'Predictive machine learning project using advanced algorithms for analyzing data to forecast wildfires.',
    tags: ['Python', 'Jupyter', 'Data Science'],
    live: '#', code: 'https://github.com/Bhuwan138312/mlpc_Wildfire_Prediction.ipynv',
  },
];

export default function Projects() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="projects" className="section">
      <div className="container">
        <span className="section-tag reveal-fade">My Work</span>
        <h2 className="section-title reveal-up">Featured Projects</h2>
        <div className="projects-grid">
          {projects.slice(0, 6).map((p) => (
            <article className="project-card stagger-item" key={p.title}>
              <div className="card-img-wrap">
                <div
                  className="card-img-placeholder"
                  style={{ background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
                >
                  {p.letter}
                </div>
                <div className="card-overlay">
                  {p.live !== '#' && <a href={p.live} className="overlay-btn" target="_blank" rel="noreferrer">↗ Live Demo</a>}
                  <a href={p.code} className="overlay-btn" target="_blank" rel="noreferrer">⌥ Source</a>
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
          ))}
        </div>
        
        <div className={`projects-more-wrap ${showAll ? 'expanded' : ''}`}>
          <div className="projects-more-inner">
            <div className="projects-grid" style={{ paddingTop: '1.75rem' }}>
              {projects.slice(6).map((p) => (
                <article className="project-card stagger-item visible" key={p.title}>
                  <div className="card-img-wrap">
                    <div
                      className="card-img-placeholder"
                      style={{ background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
                    >
                      {p.letter}
                    </div>
                    <div className="card-overlay">
                      {p.live !== '#' && <a href={p.live} className="overlay-btn" target="_blank" rel="noreferrer">↗ Live Demo</a>}
                      <a href={p.code} className="overlay-btn" target="_blank" rel="noreferrer">⌥ Source</a>
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
              ))}
            </div>
          </div>
        </div>

        {projects.length > 6 && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }} className="reveal-up">
            <button className="btn btn-ghost" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less ↑' : 'Show More ↓'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
