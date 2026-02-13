"use client";

import { useRef, useState, useCallback } from "react";

interface ImageUploaderProps {
    onImageSelected: (file: File, preview: string) => void;
    selectedFile: File | null;
    preview: string | null;
    onAnalyze: () => void;
    onClear: () => void;
    isAnalyzing: boolean;
}

export default function ImageUploader({
    onImageSelected,
    selectedFile,
    preview,
    onAnalyze,
    onClear,
    isAnalyzing,
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFile = useCallback(
        (file: File) => {
            const validTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
                "image/bmp",
            ];
            if (!validTypes.includes(file.type)) {
                alert("Please upload a valid image (JPEG, PNG, WebP, GIF, or BMP)");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert("File too large. Maximum size is 10MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                onImageSelected(file, reader.result as string);
            };
            reader.readAsDataURL(file);
        },
        [onImageSelected]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <div>
            {!selectedFile ? (
                <div
                    className={`upload-zone ${dragOver ? "drag-over" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                    }}
                >
                    <div className="upload-zone-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <p className="upload-zone-title">
                        Drop your image here or click to browse
                    </p>
                    <p className="upload-zone-subtitle">
                        Drag and drop or click to select an image for analysis
                    </p>
                    <p className="upload-zone-formats">
                        JPEG &bull; PNG &bull; WebP &bull; GIF &bull; BMP &bull; Max 10MB
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFile(file);
                        }}
                    />
                </div>
            ) : (
                <div className="image-preview-container">
                    <div className="image-preview-card">
                        <div className="image-preview-header">
                            <div className="image-preview-info">
                                <div className="image-preview-info-dot" />
                                <span className="image-preview-name">{selectedFile.name}</span>
                                <span className="image-preview-size">
                                    {formatFileSize(selectedFile.size)}
                                </span>
                            </div>
                            <div className="image-preview-actions">
                                <button onClick={onClear} disabled={isAnalyzing}>
                                    Remove
                                </button>
                            </div>
                        </div>
                        <div className="image-preview-img-wrapper">
                            {preview && (
                                <img src={preview} alt="Preview of uploaded image" />
                            )}
                        </div>
                        <div className="image-preview-analyze-btn">
                            <button
                                className="btn btn-primary"
                                onClick={onAnalyze}
                                disabled={isAnalyzing}
                                style={{ width: "100%" }}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <svg className="analyzing-inline-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 0.8s linear infinite" }}>
                                            <path d="M21 12a9 9 0 11-6.219-8.56" />
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        Analyze Image
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
