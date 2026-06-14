import { useEffect, useState } from 'react';

interface NavProps {
  activeIndex: number;
  scrollTo: (index: number) => void;
}

const NAV_LINKS = [
  { label: 'About',    index: 1 },
  { label: 'Projects', index: 2 },
  { label: 'Skills',   index: 3 },
  { label: 'Contact',  index: 4 },
];

export function Nav({ activeIndex, scrollTo }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const container = document.getElementById('scroll-container');
    if (!container) return;

    const handler = () => setScrolled(container.scrollTop > 40);
    container.addEventListener('scroll', handler, { passive: true });
    return () => container.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav__inner container">
        {/* Logo */}
        <button className="nav__logo" onClick={() => scrollTo(0)}>
          RF<span className="nav__logo-dot" />
        </button>

        {/* Links */}
        <ul className="nav__links">
          {NAV_LINKS.map(({ label, index }) => (
            <li key={label}>
              <button
                className={`nav__link${activeIndex === index ? ' active' : ''}`}
                onClick={() => scrollTo(index)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button className="nav__cta" onClick={() => scrollTo(4)}>
          Hire Me
        </button>
      </div>
    </nav>
  );
}