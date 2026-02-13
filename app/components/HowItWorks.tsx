export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Upload Image",
            description: "Drag and drop or click to upload any image you want to analyze.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
            ),
        },
        {
            number: "02",
            title: "AI Analysis",
            description: "Multiple neural networks analyze pixels, patterns, and artifacts simultaneously.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            ),
        },
        {
            number: "03",
            title: "Cross-Validate",
            description: "Results from multiple models are compared and aggregated for reliability.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            ),
        },
        {
            number: "04",
            title: "Get Results",
            description: "View detailed verdict with confidence scores and per-model breakdown.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
        },
    ];

    return (
        <section className="how-section" id="how-it-works">
            <p className="section-label">Process</p>
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">
                Our pipeline leverages state-of-the-art vision transformers to provide reliable detection results in seconds.
            </p>

            <div className="how-steps">
                {steps.map((step, index) => (
                    <div className="how-step" key={index}>
                        <div className="how-step-number">{step.number}</div>
                        <div className="how-step-icon">{step.icon}</div>
                        <h3 className="how-step-title">{step.title}</h3>
                        <p className="how-step-desc">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
