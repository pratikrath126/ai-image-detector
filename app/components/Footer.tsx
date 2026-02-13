export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-logo">DETECTAI</div>
            <p className="footer-desc">
                Open-source AI image detection powered by Hugging Face models
            </p>
            <div className="footer-links">
                <a href="#detector">Detect</a>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a
                    href="https://github.com/pratikrath126/ai-image-detector"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
            </div>
            <p className="footer-copy">
                &copy; {new Date().getFullYear()} DetectAI. Built for educational purposes.
            </p>
        </footer>
    );
}
