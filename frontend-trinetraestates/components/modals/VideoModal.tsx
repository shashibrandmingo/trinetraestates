"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ULTRA-LUXURY RESPONSIVE VIDEO MODAL — REFINED MINIMAL UI
 * ─────────────────────────────────────────────────────────────────────────────
 * - 100% Focus on Video: Heavy bottom content block removed/streamlined
 * - Full Video Display: Height adjusted (485px - 500px, max-h-[78vh]) so top/bottom never cut
 * - Laptop & All-Device Optimized: Fits comfortably within 600px - 650px laptop viewports
 * - By Default: Autoplay ON (if native MP4) & Muted ON (with sleek Unmute button)
 * - Seamless Instagram Reel Embed Fallback (fully visible, zero clipping)
 * - Ultra-Luxury Design: Deep glassmorphism, subtle gold ambient glow, integrated close button
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  videoSrc: string; // e.g. "/videos/our-story.mp4"
  instagramUrl: string; // e.g. "https://www.instagram.com/reel/DdFKpL0T0Gm/"
  instagramEmbedUrl: string; // e.g. "https://www.instagram.com/reel/DdFKpL0T0Gm/embed/"
}

export default function VideoModal({
  isOpen,
  onClose,
  title,
  subtitle,
  videoSrc,
  instagramUrl,
  instagramEmbedUrl,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  // Reset state and handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsMuted(true);
      setIsPlaying(true);
      setUseFallback(false);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, onClose]);

  // Handle Autoplay when opened
  useEffect(() => {
    if (isOpen && videoRef.current && !useFallback) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  }, [isOpen, useFallback]);

  if (!isOpen) return null;

  // Toggle Mute / Unmute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Toggle Play / Pause
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      {/* Dark Luxury Blur Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-[fadeIn_0.2s_ease-out]"
      />

      {/* Modal Card — Ultra-clean, tight vertical rhythm, 100% video focus */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[340px] sm:max-w-[360px] max-h-[92vh] bg-[#0c0c0c]/95 border border-[var(--color-gold)]/35 rounded-2xl p-2.5 sm:p-3 shadow-[0_24px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(198,153,96,0.15)] z-10 flex flex-col items-center my-auto animate-[fadeIn_0.2s_ease-out]"
      >
        {/* Top Decorative Gold Line */}
        <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />

        {/* ── HEADER BAR: Compact Title + Integrated Close Button ── */}
        <div className="w-full flex items-center justify-between pb-2 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] shadow-[0_0_8px_rgba(198,153,96,0.6)] shrink-0" />
            <span className="text-[12px] sm:text-[12.5px] font-medium text-white/95 tracking-wide truncate">
              {title}
            </span>
          </div>

          {/* Integrated Luxury Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-[var(--color-gold)] text-white hover:text-black flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md shrink-0 ml-2"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        </div>

        {/* ── VIDEO / REEL CONTAINER: Height calibrated to show full reel without cut ── */}
        <div className="relative w-full h-[485px] sm:h-[500px] max-h-[77vh] rounded-xl overflow-hidden bg-black border border-white/10 shadow-inner flex items-center justify-center">
          {!useFallback ? (
            <>
              {/* Native HTML5 Video Player */}
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                preload="auto"
                onClick={togglePlay}
                onError={() => {
                  // Fallback seamlessly to Instagram Reel embed if local file is missing
                  setUseFallback(true);
                }}
                className="w-full h-full object-cover rounded-xl cursor-pointer"
              />

              {/* Play / Pause Overlay Indicator */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-10"
                >
                  <span className="w-12 h-12 rounded-full bg-[var(--color-gold)]/90 text-[#0a0100] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <i className="fa-solid fa-play text-sm ml-0.5" />
                  </span>
                </div>
              )}

              {/* Floating Bottom Controls */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="pointer-events-auto px-2.5 py-1 rounded-full bg-black/75 hover:bg-black border border-white/20 text-white text-[10.5px] flex items-center gap-1.5 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  <i className={isPlaying ? "fa-solid fa-pause text-[10px]" : "fa-solid fa-play text-[10px]"} />
                  <span className="text-[10px] font-medium">{isPlaying ? "Pause" : "Play"}</span>
                </button>

                {/* Mute / Unmute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="pointer-events-auto px-3 py-1 rounded-full bg-black/85 hover:bg-black border border-[var(--color-gold)] text-white text-[10.5px] flex items-center gap-1.5 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                  aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                >
                  <i
                    className={
                      isMuted
                        ? "fa-solid fa-volume-xmark text-[var(--color-gold)] text-[11px]"
                        : "fa-solid fa-volume-high text-[var(--color-gold)] text-[11px]"
                    }
                  />
                  <span className="text-[10.5px] font-semibold text-[var(--color-gold)]">
                    {isMuted ? "Unmute Sound" : "Mute"}
                  </span>
                </button>
              </div>
            </>
          ) : (
            /* Responsive Instagram Reel Embed — Sized to show entire reel card */
            <iframe
              className="w-full h-full border-0"
              src={instagramEmbedUrl}
              title={title}
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>

        {/* ── MINIMAL FOOTER BAR: Single-line subtle branding & direct link ── */}
        <div className="w-full flex items-center justify-between pt-2 px-1 text-[11px]">
          <span className="text-white/50 text-[10px] font-light truncate">
            {subtitle ? subtitle : "Commercial Excellence • Noida"}
          </span>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10.5px] text-[var(--color-gold)] hover:underline font-medium transition-colors shrink-0 ml-2"
          >
            <i className="fa-brands fa-instagram text-[11px]" />
            <span>Open Reel</span>
          </a>
        </div>
      </div>
    </div>
  );
}
