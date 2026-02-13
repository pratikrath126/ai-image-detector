"use client";

import { useState, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ImageUploader from "./components/ImageUploader";
import ResultsDisplay from "./components/ResultsDisplay";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

interface ModelResult {
  model: string;
  modelId: string;
  aiScore: number;
  humanScore: number;
  verdict: "ai" | "human" | "error";
  error?: string;
}

interface DetectionResult {
  verdict: "ai" | "human" | "uncertain";
  confidence: number;
  aiScore: number;
  humanScore: number;
  models: ModelResult[];
  analysisTime: number;
  modelsUsed: number;
  totalModels: number;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const detectorRef = useRef<HTMLDivElement>(null);

  const scrollToDetector = useCallback(() => {
    detectorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleImageSelected = useCallback((file: File, previewUrl: string) => {
    setSelectedFile(file);
    setPreview(previewUrl);
    setResult(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Analysis failed. Please try again.");
        return;
      }

      setResult(data);
    } catch (err) {
      setError(
        "Failed to connect to analysis server. Please check your connection and try again."
      );
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile]);

  const handleAnalyzeAnother = useCallback(() => {
    handleClear();
    scrollToDetector();
  }, [handleClear, scrollToDetector]);

  return (
    <>
      <Navbar />
      <main>
        <Hero onCtaClick={scrollToDetector} />

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">3</div>
              <div className="stat-label">Powerful Engines</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">95%+</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">&lt;5s</div>
              <div className="stat-label">Analysis Time</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">Free</div>
              <div className="stat-label">No Hidden Costs</div>
            </div>
          </div>
        </section>

        {/* Detector Section */}
        <section className="detector-section" id="detector" ref={detectorRef}>
          <div className="detector-container">
            <p className="section-label">Detector</p>
            <h2 className="section-title">Analyze Your Image</h2>
            <p className="section-desc">
              Upload any image and our multi-model ensemble will determine if it was
              created by AI or a human.
            </p>

            <ImageUploader
              onImageSelected={handleImageSelected}
              selectedFile={selectedFile}
              preview={preview}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              isAnalyzing={isAnalyzing}
            />

            {isAnalyzing && (
              <div className="analyzing-overlay">
                <div className="analyzing-spinner" />
                <p className="analyzing-text">Analyzing with Multi-Model Ensemble...</p>
                <p className="analyzing-model">
                  Running GenAI detection, ViT analysis, and metadata scan in parallel
                </p>
              </div>
            )}

            {error && (
              <div
                className="results-container"
                style={{ marginTop: "32px" }}
              >
                <div
                  className="results-card"
                  style={{
                    borderColor: "var(--neon-red)",
                  }}
                >
                  <div
                    className="results-verdict"
                    style={{ padding: "32px 28px" }}
                  >
                    <div style={{ marginBottom: "12px" }}>
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--neon-red)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </div>
                    <h3
                      className="results-verdict-label"
                      style={{ color: "var(--neon-red)" }}
                    >
                      Analysis Error
                    </h3>
                    <p className="results-verdict-desc">{error}</p>
                    <button
                      className="btn btn-primary"
                      onClick={handleAnalyze}
                      style={{ marginTop: "20px" }}
                    >
                      Retry Analysis
                    </button>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <ResultsDisplay
                result={result}
                onAnalyzeAnother={handleAnalyzeAnother}
              />
            )}
          </div>
        </section>

        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
