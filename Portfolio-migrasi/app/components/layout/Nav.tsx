import { useState, useEffect } from "react";
import { NavLink } from "react-router";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Projects", to: "/#projects" },
  { label: "Skills", to: "/#skills" },
  { label: "Contact", to: "/#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (to: string) => {
    setMenuOpen(false);
    if (to.startsWith("/#")) {
      const id = to.replace("/#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <a href="/" className="nav__logo">
          <span className="nav__logo-bracket">[</span>
          <span className="nav__logo-name">YourName</span>
          <span className="nav__logo-bracket">]</span>
        </a>

        <nav className={`nav__links${menuOpen ? " nav__links--open" : ""}`}>
          {navLinks.map((link) => (
            <button
              key={link.label}
              className="nav__link"
              onClick={() => handleNavClick(link.to)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          className={`nav__burger${menuOpen ? " nav__burger--open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}