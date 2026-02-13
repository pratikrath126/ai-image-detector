"use client";

interface ModelResult {
    model: string;
    modelId: string;
    architecture?: string;
    aiScore: number;
    humanScore: number;
    verdict: "ai" | "human" | "error";
    error?: string;
}

interface EnsembleInfo {
    method: string;
    totalModels: number;
    successfulModels: number;
    aiVotes: number;
    humanVotes: number;
    majorityAgreement: number;
    consensusLevel: string;
}

interface DetectionResult {
    verdict: "ai" | "human" | "uncertain";
    confidence: number;
    aiScore: number;
    humanScore: number;
    models: ModelResult[];
    ensemble?: EnsembleInfo;
    analysisTime: number;
    modelsUsed: number;
    totalModels: number;
}

interface ResultsDisplayProps {
    result: DetectionResult;
    onAnalyzeAnother: () => void;
}

export default function ResultsDisplay({
    result,
    onAnalyzeAnother,
}: ResultsDisplayProps) {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (result.confidence / 100) * circumference;

    const verdictLabels: Record<string, string> = {
        ai: "AI GENERATED",
        human: "LIKELY REAL",
        uncertain: "UNCERTAIN",
    };

    const verdictDescriptions: Record<string, string> = {
        ai: "Our multi-model ensemble indicates this image was likely created by an AI model such as DALL-E, Midjourney, or Stable Diffusion.",
        human: "Our multi-model ensemble indicates this image is likely an authentic photograph or human-created artwork.",
        uncertain: "The models disagree. The image shows characteristics of both AI-generated and authentic content.",
    };

    const consensusColors: Record<string, string> = {
        strong: "var(--neon-green)",
        moderate: "var(--neon-amber)",
        weak: "var(--neon-red)",
    };

    return (
        <div className="results-container">
            <div className="results-card">
                {/* Header */}
                <div className="results-header">
                    <span className="results-header-label">Ensemble Analysis Complete</span>
                    <span className="results-header-time">
                        {result.analysisTime}ms &bull; {result.modelsUsed}/{result.totalModels} models
                    </span>
                </div>

                {/* Verdict */}
                <div className="results-verdict">
                    <div className="results-gauge-wrapper">
                        <svg className="results-gauge" viewBox="0 0 100 100">
                            <circle className="results-gauge-bg" cx="50" cy="50" r="45" />
                            <circle
                                className={`results-gauge-fill ${result.verdict}`}
                                cx="50"
                                cy="50"
                                r="45"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                            />
                        </svg>
                        <div className="results-gauge-text">
                            <div className={`results-gauge-percent ${result.verdict}`}>
                                {result.confidence.toFixed(1)}%
                            </div>
                            <div className="results-gauge-sublabel">confidence</div>
                        </div>
                    </div>

                    <h3 className={`results-verdict-label ${result.verdict}`}>
                        {verdictLabels[result.verdict]}
                    </h3>
                    <p className="results-verdict-desc">
                        {verdictDescriptions[result.verdict]}
                    </p>

                    {/* Ensemble Consensus Badge */}
                    {result.ensemble && (
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "16px",
                                padding: "6px 16px",
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "999px",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "var(--text-secondary)",
                            }}
                        >
                            <span
                                style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: consensusColors[result.ensemble.consensusLevel] || "var(--text-muted)",
                                    boxShadow: `0 0 8px ${consensusColors[result.ensemble.consensusLevel] || "transparent"}`,
                                }}
                            />
                            {result.ensemble.consensusLevel.toUpperCase()} CONSENSUS &bull;{" "}
                            {result.ensemble.aiVotes} AI / {result.ensemble.humanVotes} Real votes &bull;{" "}
                            {result.ensemble.majorityAgreement}% agreement
                        </div>
                    )}
                </div>

                {/* Model Breakdown */}
                <div className="results-models">
                    <h4 className="results-models-title">
                        Individual Model Results ({result.modelsUsed} models)
                    </h4>
                    {result.models.map((model, index) => (
                        <div className="model-result" key={index}>
                            {model.error ? (
                                <div className="model-result-header">
                                    <div>
                                        <span className="model-result-name">{model.model}</span>
                                        {model.architecture && (
                                            <span
                                                style={{
                                                    display: "block",
                                                    fontFamily: "var(--font-mono)",
                                                    fontSize: "0.65rem",
                                                    color: "var(--text-muted)",
                                                    marginTop: "2px",
                                                }}
                                            >
                                                {model.architecture}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className="model-result-badge"
                                        style={{
                                            background: "rgba(100,100,100,0.1)",
                                            color: "var(--text-muted)",
                                            border: "1px solid rgba(100,100,100,0.2)",
                                        }}
                                    >
                                        Unavailable
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className="model-result-header">
                                        <div>
                                            <span className="model-result-name">{model.model}</span>
                                            {model.architecture && (
                                                <span
                                                    style={{
                                                        display: "block",
                                                        fontFamily: "var(--font-mono)",
                                                        fontSize: "0.65rem",
                                                        color: "var(--text-muted)",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    {model.architecture}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`model-result-badge ${model.verdict}`}>
                                            {model.verdict === "ai"
                                                ? `AI ${model.aiScore.toFixed(1)}%`
                                                : `Real ${model.humanScore.toFixed(1)}%`}
                                        </span>
                                    </div>
                                    <div className="model-result-bar-container">
                                        <div
                                            className={`model-result-bar ${model.verdict === "ai" ? "ai" : "human"}`}
                                            style={{
                                                width: `${model.verdict === "ai" ? model.aiScore : model.humanScore}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="model-result-scores">
                                        <span className="model-result-score">
                                            AI: {model.aiScore.toFixed(1)}%
                                        </span>
                                        <span className="model-result-score">
                                            Real: {model.humanScore.toFixed(1)}%
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="results-footer">
                    <button className="btn btn-primary" onClick={onAnalyzeAnother}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Analyze Another Image
                    </button>
                </div>
            </div>
        </div>
    );
}
