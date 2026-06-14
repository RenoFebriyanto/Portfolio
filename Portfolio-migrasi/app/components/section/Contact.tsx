import { useState, type FormEvent } from 'react';
import { sendContactEmail } from '~/utils/emailjs';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    from_name: '', from_email: '', subject: '', message: '',
  });

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await sendContactEmail(form);
      setStatus('success');
      setForm({ from_name: '', from_email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="section scrollable contact" id="contact">
      <div className="container">
        <div className="contact__inner">

          {/* Left — info */}
          <div className="contact__info reveal">
            <p className="section-label">04 — Contact</p>
            <h2 className="section-heading">Let's Work Together</h2>

            <p className="contact__body">
              Have a project in mind? Looking for a collaborator in game dev, 3D, or interactive
              web? I'd love to hear from you.
            </p>

            <div className="contact__details">
              <div className="contact__detail">
                <span className="contact__detail-icon">✉</span>
                <div>
                  <span className="contact__detail-label">Email</span>
                  <span className="contact__detail-value">
                    <a href="mailto:renofebriyanto94@gmail.com">renofebriyanto94@gmail.com</a>
                  </span>
                </div>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-icon">📍</span>
                <div>
                  <span className="contact__detail-label">Location</span>
                  <span className="contact__detail-value">Indonesia</span>
                </div>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-icon">🎮</span>
                <div>
                  <span className="contact__detail-label">itch.io</span>
                  <span className="contact__detail-value">
                    <a href="https://catmounth.itch.io" target="_blank" rel="noreferrer">catmounth.itch.io</a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="contact__form-wrapper reveal">
            <form className="contact__form" onSubmit={handleSubmit} noValidate>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.from_name}
                    onChange={set('from_name')}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={form.from_email}
                    onChange={set('from_email')}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Project inquiry / Collaboration / ..."
                  required
                  value={form.subject}
                  onChange={set('subject')}
                />
              </div>

              <div className="form-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  placeholder="Tell me about your project..."
                  required
                  value={form.message}
                  onChange={set('message')}
                />
              </div>

              {status === 'success' && (
                <p className="form-status success">Message sent! I'll get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="form-status error">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                className="form-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending...' : 'Send Message →'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}