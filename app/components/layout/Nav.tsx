import { useState, useEffect } from "react";

const NAV_SECTIONS = [
  { label: "About",    id: "about"    },
  { label: "Projects", id: "projects" },
  { label: "Skills",   id: "skills"   },
];

export default function Nav() {
  const [scrolled, setScrolled]     = useState(false);
  const [currentId, setCurrentId]   = useState("hero");

  // The home page updates these events as the native scroll crosses sections.
  useEffect(() => {
    const onEnter = (e: Event) => {
      const id = (e as CustomEvent).detail?.id as string;
      setCurrentId(id ?? "hero");
      setScrolled(id !== "hero");
    };
    window.addEventListener("sectionenter", onEnter);
    return () => window.removeEventListener("sectionenter", onEnter);
  }, []);

  const SECTION_IDS = ["hero", "about", "projects", "skills", "contact"];

  const navigateTo = (id: string) => {
  const nav = (window as unknown as Record<string, { goTo?: (i: number) => void }>).PageNav;
  const idx = SECTION_IDS.indexOf(id);
  if (nav?.goTo && idx !== -1) nav.goTo(idx);
};

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      {/* Logo */}
      <a href="/" className="nav-logo" onClick={e => { e.preventDefault(); navigateTo("hero"); }}>
        <img
          src="/icon-512.png"
          alt="Reno Febri"
          className="nav-logo-img"
          onError={e => {
            // Fallback to text logo if image missing
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
            img.parentElement!.innerHTML += `
              <span class="nav-logo-dot"></span>
              <span style="font-family:var(--font-display);font-size:20px;font-weight:700;letter-spacing:0.02em">RF</span>
            `;
          }}
        />
      </a>

      {/* Links */}
      <ul className="nav-links">
        {NAV_SECTIONS.map(sec => (
          <li key={sec.id}>
            <a
              href={`#${sec.id}`}
              onClick={e => { e.preventDefault(); navigateTo(sec.id); }}
              style={currentId === sec.id ? { color: "var(--text-primary, #F0F0FA)" } : undefined}
            >
              {sec.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#contact"
            className="nav-cta"
            onClick={e => { e.preventDefault(); navigateTo("contact"); }}
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}
