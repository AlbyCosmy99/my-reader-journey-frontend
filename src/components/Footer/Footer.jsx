import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-line">
          &copy; 2024 <strong>MyReaderJourney</strong>.
          All rights reserved.
        </p>

        <p className="footer-line">
          Created with care by{' '}
          <a
            href="https://www.linkedin.com/in/andrei-albudev/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Albu Cosmin Andrei
          </a>
        </p>

        <p className="footer-line tech">
          <span className="dot" /> React &nbsp;
          <span className="dot" /> Bootstrap &nbsp;
          <span className="dot" /> Express.js &nbsp;
          <span className="dot" /> MongoDB &nbsp;
          <span className="dot" /> Love for books
        </p>
      </div>
    </footer>
  );
}
