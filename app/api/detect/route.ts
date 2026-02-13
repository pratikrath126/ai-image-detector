import { NextRequest, NextResponse } from "next/server";
import { client } from "@gradio/client";

/* ==========================================================================
   MULTI-ENGINE AI IMAGE DETECTOR
   
   Detection engines:
   1. Sightengine GenAI        — Commercial AI generation detector
   2. Sightengine Deepfake     — Deepfake face manipulation detector
   3. Ateeqq/ai-image-detector — Hugging Face Space (ViT/CNN via Gradio)
   4. Local Metadata Engine    — Privacy-first metadata & entropy analysis
   ========================================================================== */

// ─── Ateeqq Space (Gradio) ───────────────────────────────────────────────

async function queryAteeqqSpace(
    imageBlob: Blob
): Promise<{
    aiScore: number;
    humanScore: number;
    label: string;
    confidences?: Record<string, number>
} | null> {
    try {
        const app = await client("Ateeqq/ai-image-detector", {
            hf_token: process.env.HF_API_TOKEN as `hf_${string}`
        } as any);

        const result = await app.predict("/predict", [
            imageBlob,
        ]);

        // Result format: data[0] is label object {"Real": 0.9, "Fake": 0.1}
        const data = result.data as any[];
        const predictions = data[0]; // {"Real": 0.99, "Fake": 0.01} or similar

        let aiScore = 0;
        let humanScore = 0;

        if (predictions && typeof predictions === 'object') {
            const label = predictions.label;
            const confidences = predictions.confidences;

            if (Array.isArray(confidences)) {
                const aiConf = confidences.find((c: any) => c.label.toLowerCase().includes('ai'))?.confidence || 0;
                const humanConf = confidences.find((c: any) => c.label.toLowerCase().includes('hum'))?.confidence || 0;

                aiScore = aiConf;
                humanScore = humanConf;
            } else if (label) {
                // Fallback if structured confidence not available
                if (label.toLowerCase().includes('ai')) aiScore = 0.99;
                else humanScore = 0.99;
            }

            // Normalize if they don't sum to 1
            const total = aiScore + humanScore;
            if (total > 0) {
                aiScore = aiScore / total;
                humanScore = humanScore / total;
            }
        }

        return {
            aiScore: Math.round(aiScore * 10000) / 100,
            humanScore: Math.round(humanScore * 10000) / 100,
            label: aiScore > humanScore ? "Fake" : "Real",
            confidences: predictions
        };

    } catch (error) {
        console.error("Ateeqq Space Error:", error);
        return null;
    }
}

// ─── Sightengine API ─────────────────────────────────────────────────────

async function querySightengine(
    imageBlob: Blob
): Promise<{
    genai: { aiScore: number; humanScore: number } | null;
} | null> {
    const apiUser = process.env.SIGHTENGINE_API_USER;
    const apiSecret = process.env.SIGHTENGINE_API_SECRET;

    if (!apiUser || !apiSecret) return null;

    try {
        const formData = new FormData();
        formData.append("media", imageBlob, "image.jpg");
        formData.append("models", "genai");
        formData.append("api_user", apiUser);
        formData.append("api_secret", apiSecret);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        const response = await fetch("https://api.sightengine.com/1.0/check.json", {
            method: "POST",
            body: formData,
            signal: controller.signal,
        });

        clearTimeout(timeout);
        if (!response.ok) return null;

        const data = await response.json();
        if (data.status !== "success") return null;

        const genaiVal = data.type?.ai_generated;

        return {
            genai:
                genaiVal !== undefined
                    ? {
                        aiScore: Math.round(genaiVal * 10000) / 100,
                        humanScore: Math.round((1 - genaiVal) * 10000) / 100,
                    }
                    : null,
        };
    } catch {
        return null;
    }
}

// ─── Local Metadata Engine ───────────────────────────────────────────────

async function analyzeImageMetadata(
    imageBlob: Blob
): Promise<{ aiScore: number; humanScore: number; details: string }> {
    /* ... (Same implementation as before) ... */
    const buffer = await imageBlob.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let aiSignals = 0;
    let signalDetails: string[] = [];

    // 1. Check JPEG EXIF
    const isJPEG = bytes[0] === 0xff && bytes[1] === 0xd8;
    const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50;

    if (isJPEG) {
        let hasExif = false;
        for (let i = 0; i < Math.min(bytes.length, 2000); i++) {
            if (bytes[i] === 0x45 && bytes[i + 1] === 0x78 && bytes[i + 2] === 0x69 && bytes[i + 3] === 0x66) {
                hasExif = true;
                break;
            }
        }
        if (!hasExif) {
            aiSignals += 20;
            signalDetails.push("No EXIF metadata (common in AI images)");
        } else {
            signalDetails.push("EXIF metadata present");
        }
    }

    // 2. Check for AI tool markers
    const headerSize = Math.min(bytes.length, 15000);
    const metaStr = new TextDecoder("ascii", { fatal: false }).decode(bytes.slice(0, headerSize));
    const aiMarkers = [
        "DALL", "Midjourney", "Stable Diffusion", "ComfyUI", "A1111",
        "NovelAI", "nai_generated", "dreamstudio", "invoke-ai",
        "sd-metadata", "Dream Studio", "Flux", "SDXL",
    ];
    for (const marker of aiMarkers) {
        if (metaStr.toLowerCase().includes(marker.toLowerCase())) {
            aiSignals += 60;
            signalDetails.push(`AI tool marker found: "${marker}"`);
            break;
        }
    }

    // 3. PNG-specific checks
    if (isPNG) {
        const pngMeta = metaStr.toLowerCase();
        if (pngMeta.includes("parameters") && (pngMeta.includes("steps") || pngMeta.includes("sampler"))) {
            aiSignals += 55;
            signalDetails.push("Stable Diffusion parameters detected");
        }
        if (pngMeta.includes("prompt") && pngMeta.includes("negative")) {
            aiSignals += 50;
            signalDetails.push("AI prompt metadata found");
        }
    }

    // 4. Entropy analysis
    const sampleSize = Math.min(bytes.length, 20000);
    const freq = new Array(256).fill(0);
    for (let i = 0; i < sampleSize; i++) {
        freq[bytes[i]]++;
    }
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
        if (freq[i] > 0) {
            const p = freq[i] / sampleSize;
            entropy -= p * Math.log2(p);
        }
    }
    if (entropy > 7.5 && entropy < 7.95) {
        aiSignals += 8;
        signalDetails.push(`High entropy (${entropy.toFixed(2)}) suggests AI processing`);
    }

    // 5. File size heuristic
    if (isJPEG && bytes.length > 200000 && bytes.length < 800000) {
        aiSignals += 5;
    }

    // Cap human confidence for non-standard files without strong signals
    const finalAiScore = Math.min(aiSignals, 99);
    let finalHumanScore = 100 - finalAiScore;

    // If no AI signals found but also no strong human signals (like EXIF), reduce confidence
    if (finalAiScore < 10 && !isJPEG) {
        finalHumanScore = 80; // Cap at 80% for PNGs without AI markers
    }

    let summary: string;
    if (finalAiScore >= 50) summary = signalDetails[0] || "AI indicators detected";
    else if (finalAiScore >= 20) summary = signalDetails[0] || "Minor AI indicators found";
    else summary = "No strong AI indicators in metadata";

    return {
        aiScore: Math.round(finalAiScore * 100) / 100,
        humanScore: Math.round(finalHumanScore * 100) / 100,
        details: summary,
    };
}


// ─── Main API Route ──────────────────────────────────────────────────────

interface ModelResultEntry {
    model: string;
    modelId: string;
    architecture: string;
    weight: number;
    aiScore: number;
    humanScore: number;
    verdict: "ai" | "human" | "error";
    error?: string;
    details?: string;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "No image file provided" }, { status: 400 });
        }

        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Please upload JPEG, PNG, WebP, GIF, or BMP." },
                { status: 400 }
            );
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const imageBlob = new Blob([arrayBuffer], { type: file.type });

        const startTime = Date.now();

        // ─── Run all engines in parallel ──────────────────────────
        const [sightengineResult, ateeqqResult, metadataResult] = await Promise.all([
            querySightengine(imageBlob),
            queryAteeqqSpace(imageBlob),
            analyzeImageMetadata(imageBlob),
        ]);

        const analysisTime = Date.now() - startTime;

        // ─── Assemble results ─────────────────────────────────────
        const modelResults: ModelResultEntry[] = [];

        // 1. Sightengine GenAI
        if (sightengineResult?.genai) {
            modelResults.push({
                model: "Sightengine GenAI",
                modelId: "sightengine/genai",
                architecture: "Commercial AI Generator Detector",
                weight: 1.0,
                aiScore: sightengineResult.genai.aiScore,
                humanScore: sightengineResult.genai.humanScore,
                verdict: sightengineResult.genai.aiScore > 50 ? "ai" : "human",
            });
        }

        // 2. Sightengine Deepfake - REMOVED per user request

        // 3. Ateeqq Space (New!)
        if (ateeqqResult) {
            modelResults.push({
                model: "Ateeqq AI Detector",
                modelId: "ateeqq/ai-vs-human",
                architecture: "Hugging Face Space (ViT/CNN)",
                weight: 0.9,
                aiScore: ateeqqResult.aiScore,
                humanScore: ateeqqResult.humanScore,
                verdict: ateeqqResult.aiScore > ateeqqResult.humanScore ? "ai" : "human",
            });
        } else {
            // Log failure but don't crash
            console.warn("Ateeqq Space failed or returned null");
            modelResults.push({
                model: "Ateeqq AI Detector",
                modelId: "ateeqq/ai-vs-human",
                architecture: "Hugging Face Space",
                weight: 0,
                aiScore: 0,
                humanScore: 0,
                verdict: "error",
                error: "Engine unavailable (timeout or connection error)",
            });
        }

        // 4. Local Analysis
        modelResults.push({
            model: "Metadata Analyzer",
            modelId: "local/metadata",
            architecture: "Local Heuristic Engine",
            weight: 0.3,
            aiScore: metadataResult.aiScore,
            humanScore: metadataResult.humanScore,
            verdict: metadataResult.aiScore > metadataResult.humanScore ? "ai" : "human",
            details: metadataResult.details,
        });

        // ─── ENSEMBLE Logic ───────────────────────────────────────
        const successfulModels = modelResults.filter((m) => m.verdict !== "error");

        if (successfulModels.length === 0) {
            return NextResponse.json(
                { error: "All detection services are currently unavailable." },
                { status: 503 }
            );
        }

        let weightedAiScore = 0;
        let totalWeight = 0;

        for (const model of successfulModels) {
            weightedAiScore += model.aiScore * model.weight;
            totalWeight += model.weight;
        }

        const combinedAiScore = totalWeight > 0 ? weightedAiScore / totalWeight : 0;
        const combinedHumanScore = 100 - combinedAiScore;

        // Majority vote
        const aiVotes = successfulModels.filter((m) => m.verdict === "ai").length;
        const humanVotes = successfulModels.filter((m) => m.verdict === "human").length;
        const totalVotes = aiVotes + humanVotes;
        const majorityAgreement = totalVotes > 0 ? Math.max(aiVotes, humanVotes) / totalVotes : 0;

        // Final verdict
        let finalVerdict: "ai" | "human" | "uncertain";
        if (Math.abs(combinedAiScore - combinedHumanScore) < 10 && majorityAgreement < 0.7) {
            finalVerdict = "uncertain";
        } else {
            finalVerdict = combinedAiScore > combinedHumanScore ? "ai" : "human";
        }

        const confidenceScore = Math.min(99.9, Math.max(combinedAiScore, combinedHumanScore) + (majorityAgreement > 0.8 ? 2 : 0));

        const consensusLevel = majorityAgreement >= 0.8 ? "strong" : majorityAgreement >= 0.6 ? "moderate" : "weak";

        return NextResponse.json({
            verdict: finalVerdict,
            confidence: Math.round(confidenceScore * 100) / 100,
            aiScore: Math.round(combinedAiScore * 100) / 100,
            humanScore: Math.round(combinedHumanScore * 100) / 100,
            models: modelResults.map((m) => ({
                model: m.model,
                modelId: m.modelId,
                architecture: m.architecture,
                aiScore: m.aiScore,
                humanScore: m.humanScore,
                verdict: m.verdict,
                error: m.error,
                details: m.details,
            })),
            ensemble: {
                method: "weighted_average_vote",
                totalModels: modelResults.length,
                successfulModels: successfulModels.length,
                aiVotes,
                humanVotes,
                majorityAgreement: Math.round(majorityAgreement * 100),
                consensusLevel,
            },
            analysisTime,
            modelsUsed: successfulModels.length,
        });

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: "Internal server error during analysis" },
            { status: 500 }
        );
    }
}
