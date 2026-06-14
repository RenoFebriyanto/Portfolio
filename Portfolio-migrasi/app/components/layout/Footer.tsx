export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">
          &copy; {year}{" "}
          <span className="footer__name">Reno Febriyanto</span>
          {" "}&mdash; Built with React Router, Three.js &amp; GSAP
        </p>
        <div className="footer__links">
          
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
          
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}