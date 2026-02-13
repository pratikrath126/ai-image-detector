export default function Hero({ onCtaClick }: { onCtaClick: () => void }) {
    return (
        <section className="hero">
            <div className="hero-orb hero-orb-1" aria-hidden="true" />
            <div className="hero-orb hero-orb-2" aria-hidden="true" />
            <div className="hero-orb hero-orb-3" aria-hidden="true" />

            <div className="hero-badge">
                <span className="hero-badge-dot" />
                Advanced AI Detection
            </div>

            <h1 className="hero-title">
                Detect{" "}
                <span className="hero-title-gradient">AI-Generated</span>
                <br />
                Images Instantly
            </h1>

            <p className="hero-subtitle">
                Advanced multi-model analysis powered by state-of-the-art neural networks.
                Identify images from DALL-E, Midjourney, Stable Diffusion, and more with
                high confidence.
            </p>

            <div className="hero-actions">
                <button className="btn btn-primary" onClick={onCtaClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload Image
                </button>
                <a className="btn btn-secondary" href="#how-it-works">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 16 16 12 12 8" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    How It Works
                </a>
            </div>
        </section>
    );
}
