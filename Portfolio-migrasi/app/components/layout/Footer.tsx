export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <p className="footer__copy">
          © {new Date().getFullYear()} <span>Reno Febriyanto</span> — Built with React Router v7 + Three.js
        </p>
        <nav className="footer__links">
          <a className="footer__link" href="https://github.com/RenoFebriyanto" target="_blank" rel="noreferrer">GitHub</a>
          <a className="footer__link" href="https://linkedin.com/in/renofebriyanto/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="footer__link" href="https://catmounth.itch.io" target="_blank" rel="noreferrer">itch.io</a>
        </nav>
      </div>
    </footer>
  );
}