import './Experience.css';

const items = [
  {
    period: '2023 — 2027 (Expected)',
    role: 'B.Sc. in Computer Science',
    company: "Taylor's University",
    desc: "Currently pursuing my Bachelor's degree. Building a strong foundation in computer science, software engineering, and system architecture alongside practical projects.",
    tags: ['Computer Science', 'Software Engineering', 'System Design'],
    type: 'edu',
  },
  {
    period: 'Completed',
    role: '+2 Commerce',
    company: 'Devi Secondary School',
    desc: 'Completed higher secondary education majoring in Commerce. Developed a strong foundation in Accounting and Computer Science, which sparked my interest in software development.',
    tags: ['Commerce', 'Accounting', 'Computer Science'],
    type: 'edu',
  },
  {
    period: 'Completed',
    role: 'Secondary Education (Class 10)',
    company: 'Rudra Memorial Secondary School',
    desc: 'Completed foundational secondary education, building a solid base for my future academic pursuits.',
    tags: ['Secondary Education', 'Foundational Studies'],
    type: 'edu',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section section-alt">
      <div className="container">
        <span className="section-tag reveal-fade">My Background</span>
        <h2 className="section-title reveal-up">Education</h2>
        <div className="timeline">
          {items.map((item, i) => (
            <div className="timeline-item stagger-item" key={i}>
              <div className={`timeline-dot ${item.type}`} />
              <div className="timeline-content">
                <span className="timeline-period">{item.period}</span>
                <h3 className="timeline-role">{item.role}</h3>
                <span className="timeline-company">{item.company}</span>
                <p className="timeline-desc">{item.desc}</p>
                <div className="timeline-tags">
                  {item.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
