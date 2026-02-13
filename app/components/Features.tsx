export default function Features() {
    const features = [
        {
            title: "Multi-Model Analysis",
            description:
                "Uses multiple AI detection models simultaneously for higher accuracy and cross-validation of results.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
        },
        {
            title: "Instant Detection",
            description:
                "Get results in seconds. Our parallel processing pipeline analyzes images with minimal latency.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
        },
        {
            title: "High Accuracy",
            description:
                "Trained on millions of real and AI-generated images. Detects outputs from DALL-E, Midjourney, SDXL, and more.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
        },
        {
            title: "Privacy First",
            description:
                "Images are processed in real-time and never stored on our servers. Your data stays private.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            ),
        },
        {
            title: "Hybrid Intelligence",
            description:
                "Combines commercial-grade APIs (Sightengine) with open-source models (Hugging Face) for maximum reliability.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
            ),
        },
        {
            title: "Web Deployable",
            description:
                "Built with Next.js for seamless deployment to Vercel, Netlify, or any modern hosting platform.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            ),
        },
    ];

    return (
        <section className="features-section" id="features">
            <p className="section-label">Capabilities</p>
            <h2 className="section-title">
                Why Choose <span className="hero-title-gradient">DetectAI</span>
            </h2>
            <p className="section-desc">
                Powered by cutting-edge machine learning models and designed for accuracy, speed, and ease of use.
            </p>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <div
                        className="feature-card"
                        key={index}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="feature-icon">{feature.icon}</div>
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-desc">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
