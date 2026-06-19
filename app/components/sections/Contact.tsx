import { useState, type FormEvent } from 'react';
import { sendContactEmail } from '~/utils/emailjs';

type Status = 'idle' | 'sending' | 'success' | 'error';

const SOCIALS = [
  { platform: 'GitHub',    handle: 'Reno Febriyanto',     href: 'https://github.com/RenoFebriyanto',          icon: '/Assets/icons/github.png' },
  { platform: 'LinkedIn',  handle: 'Reno Febriyanto',     href: 'https://www.linkedin.com/in/renofebriyanto/', icon: '/Assets/icons/linkedin.png' },
  { platform: 'itch.io',   handle: 'catmounth.itch.io',   href: 'https://catmounth.itch.io/',                 icon: '/Assets/icons/itch-io.png' },
  { platform: 'Instagram', handle: '@norigaken',           href: 'https://www.instagram.com/norigaken/',       icon: '/Assets/icons/instagram.png' },
];

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = () => {
  const e: Partial<typeof form> = {};

  if (!form.name.trim()) {
    e.name = 'Please enter your name';
  }

  if (!form.email.trim()) {
    e.email = 'Please enter your email';
  } else if (!EMAIL_RE.test(form.email.trim())) {
    e.email = 'Please enter a valid email address';
  }

  if (!form.message.trim()) {
    e.message = 'Please write a message';
  }

  setErrors(e);
  return Object.keys(e).length === 0;
};

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setStatus('sending');

  try {
    await sendContactEmail({
      from_name:  form.name,
      from_email: form.email,
      subject:    form.subject || '(No subject)',
      message:    form.message,
    });

    setStatus('success');
  } catch (err) {
    console.error('[EmailJS]', err);
    setStatus('error');
    setTimeout(() => setStatus('idle'), 3000);
  }
};

  return (
    <section className="contact" id="contact">
      <div className="container">

        {/* Section divider */}
        <div className="section-divider reveal" />

        {/* Section label */}
        <div className="section-label reveal">
          <span className="section-label-num">04</span>
          <span className="section-label-line" />
          <span className="section-label-text">Contact</span>
        </div>

        {/* Closing statement */}
        <div className="contact-statement reveal reveal-delay-1">
          <span className="contact-eyebrow">Let's build something together</span>
          <h2 className="contact-heading">
            Get In<br />
            <span className="accent">Touch</span><span className="dim">.</span>
          </h2>
          <p className="contact-tagline">
            Open for freelance projects, collaborations, game jams, or just a good conversation
            about Game Tech and 3D. Don't hesitate to reach out.
          </p>
        </div>

        {/* Contact grid */}
        <div className="contact-grid">

          {/* Left: info */}
          <div className="contact-info reveal reveal-delay-1">
            <p className="contact-info-label">Direct Email</p>
            <a href="mailto:renofebriyanto94@gmail.com" className="contact-email">
              renofebriyanto94@gmail.com
            </a>

            <div className="contact-socials">
              {SOCIALS.map(s => (
                <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer" className="social-link">
                  <div className="social-link-left">
                    <div className="social-link-icon">
                      <img
                        src={s.icon}
                        alt={s.platform}
                        className="social-icon-img"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="social-link-info">
                      <span className="social-link-platform">{s.platform}</span>
                      <span className="social-link-handle">{s.handle}</span>
                    </div>
                  </div>
                  <span className="social-link-arrow">→</span>
                </a>
              ))}
            </div>

            <div className="contact-avail">
              <span className="contact-avail-dot" />
              <span className="contact-avail-text">Currently available for new projects</span>
            </div>
          </div>

          {/* Right: form */}
          <div className="contact-form-wrap reveal reveal-delay-2">
            {status !== 'success' ? (
              <>
                <div className="contact-form-title">Send a Message</div>
                <p className="contact-form-sub">I usually reply within 24–48 hours.</p>

                <form id="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className="form-field row-field">
                        <label className="form-label" htmlFor="cf-name">Name</label>
                        <input
                          className="form-input"
                          id="cf-name" type="text"
                          placeholder="Your name"
                          value={form.name}
                          onChange={set('name')}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'cf-name-error' : undefined}
                          style={errors.name ? { borderColor: 'rgba(255,80,80,0.6)' } : undefined}
                        />
                        {errors.name && (
                          <span className="form-error" id="cf-name-error">{errors.name}</span>
                        )}
                      </div>
                      <div className="form-field row-field">
                        <label className="form-label" htmlFor="cf-email">Email</label>
                        <input
                          className="form-input"
                          id="cf-email" type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={set('email')}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'cf-email-error' : undefined}
                          style={errors.email ? { borderColor: 'rgba(255,80,80,0.6)' } : undefined}
                        />
                        {errors.email && (
                          <span className="form-error" id="cf-email-error">{errors.email}</span>
                        )}
                      </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="cf-subject">Subject</label>
                    <input
                      className="form-input"
                      id="cf-subject" type="text"
                      placeholder="Project idea, collab, game jam…"
                      value={form.subject}
                      onChange={set('subject')}
                    />
                  </div>

                  <div className="form-field">
                        <label className="form-label" htmlFor="cf-message">Message</label>
                        <textarea
                          className="form-textarea"
                          id="cf-message"
                          placeholder="Tell me about your project or idea…"
                          value={form.message}
                          onChange={set('message')}
                          aria-invalid={!!errors.message}
                          aria-describedby={errors.message ? 'cf-message-error' : undefined}
                          style={errors.message ? { borderColor: 'rgba(255,80,80,0.6)' } : undefined}
                        />
                        {errors.message && (
                          <span className="form-error" id="cf-message-error">{errors.message}</span>
                        )}
                      </div>

                  <button
                    className="form-submit"
                    type="submit"
                    id="form-submit-btn"
                    disabled={status === 'sending'}
                    style={status === 'error' ? { background: 'rgba(220,60,60,0.85)', color: '#fff' } : undefined}
                  >
                    {status === 'sending'
                      ? 'Sending…'
                      : status === 'error'
                        ? 'Failed — Try Again'
                        : <>Send Message <span className="form-submit-arrow">→</span></>
                    }
                  </button>
                </form>
              </>
            ) : (
              <div className="form-success visible">
                <div className="form-success-icon">✦</div>
                <div className="form-success-msg">Message Sent!</div>
                <p className="form-success-sub">Thanks — I'll get back to you soon.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer inside contact section */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo">
              <img
                src="/Assets/icons/logo/icon-512.png"
                alt="Reno Febri"
                className="footer-logo-img"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <p className="footer-copy">
              &copy; {new Date().getFullYear()} Reno Febri. Built with{' '}
              <span>♥</span> &amp; vanilla JS / React.
            </p>
            <button
              className="footer-back-top"
              id="back-to-top"
              onClick={() => {
                const nav = (window as unknown as Record<string, { goTo?: (i: number) => void }>).PageNav;
                nav?.goTo?.(0);
              }}
            >
              <span className="footer-back-top-arrow">↑</span>
              Back to top
            </button>
          </div>
        </footer>

      </div>
    </section>
  );
}
