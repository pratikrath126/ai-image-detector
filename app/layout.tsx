import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Image Detector — Detect AI-Generated Images Instantly",
  description:
    "Advanced AI-powered image analysis tool that detects AI-generated images from DALL-E, Midjourney, Stable Diffusion, and more. Free, fast, and accurate.",
  keywords: [
    "AI image detector",
    "deepfake detector",
    "AI generated image",
    "fake image detector",
    "DALL-E detector",
    "Midjourney detector",
    "Stable Diffusion detector",
  ],
  openGraph: {
    title: "AI Image Detector — Detect AI-Generated Images Instantly",
    description:
      "Advanced AI-powered image analysis that detects AI-generated images with high accuracy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="grid-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
