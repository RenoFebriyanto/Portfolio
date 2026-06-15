export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <p className="footer__copy">
            &copy; {year}{" "}
            <span>Reno Febriyanto</span>
            {" "}&mdash; Built with React Router &amp; Three.js
          </p>
          <div className="footer__links">
            <a
              href="https://github.com/RenoFebriyanto"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/renofebriyanto/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              LinkedIn
            </a>
            <a
              href="https://catmounth.itch.io"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              itch.io
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
