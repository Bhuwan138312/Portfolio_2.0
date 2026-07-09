import { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import './Contact.css';

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/Bhuwan138312',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, handleSubmit] = useForm('xnjqyknw');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Clear form on successful submission
  useEffect(() => {
    if (state.succeeded) {
      setForm({ name: '', email: '', message: '' });
    }
  }, [state.succeeded]);

  return (
    <section id="contact" className="section">
      <div className="container">
        <span className="section-tag reveal-fade">Say Hello</span>
        <h2 className="section-title reveal-up">Let's Work Together</h2>
        <p className="contact-sub reveal-up">
          Have a project in mind? I'd love to hear about it. Drop me a message and I'll get back within 24 hours.
        </p>
        <div className="contact-grid">
          <form className="contact-form reveal-left" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={handle} placeholder="Your full name" required />
              <ValidationError prefix="Name" field="name" errors={state.errors} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" required />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} value={form.message} onChange={handle} placeholder="Tell me about your project..." required />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={state.submitting}>
              {state.submitting ? 'Sending...' : 'Send Message'}
              {!state.submitting && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
            {state.succeeded && <p className="form-success">✓ Message sent! I'll reply soon.</p>}
          </form>

          <div className="contact-info reveal-right">
            <div className="info-card">
              <span className="info-icon">📍</span>
              <div><strong>Location</strong><p>Kathmandu, Nepal</p></div>
            </div>
            <div className="info-card">
              <span className="info-icon">✉️</span>
              <div><strong>Email</strong><p>abhistha220@gmail.com</p></div>
            </div>
            <div className="info-card">
              <span className="info-icon">💼</span>
              <div><strong>Status</strong><p>Open to opportunities</p></div>
            </div>
            <div className="social-row">
              {socials.map((s) => (
                <a key={s.name} href={s.href} className="social-btn" aria-label={s.name} target="_blank" rel="noreferrer">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
