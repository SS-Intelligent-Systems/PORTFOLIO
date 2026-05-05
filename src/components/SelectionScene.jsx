import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useScene, AVATARS } from "../context/SceneContext";
import { AvatarCard } from "./AvatarCard";
import { DetailView } from "./DetailView";
import HackathonGallery from "./Sliding";
import { Background } from "./Background";
import { AnimatePresence, motion } from "framer-motion";

export function SelectionScene({ onOpenHackathons, onOpenProjects }) {
  const { selected } = useScene();
  const promptRef = useRef();
  const [scrollStep, setScrollStep] = useState(0); // 0: Heading, 1: Cards, 2: Sliding Gallery

  useEffect(() => {
    if (selected) return;

    let isLocked = false;
    let lockTimeout;

    // Small delay on mount before accepting the first scroll, just to be safe
    const mountTimeout = setTimeout(() => {
      isLocked = false;
    }, 1000);
    isLocked = true;

    const handleWheel = (e) => {
      if (isLocked) return;

      if (e.deltaY > 50) {
        setScrollStep(s => {
          if (s === 2) return s; // Gallery handles its own scroll and completion
          if (s < 2) {
            isLocked = true;
            clearTimeout(lockTimeout);
            lockTimeout = setTimeout(() => { isLocked = false; }, 1200); // 1.2s lock between steps
            return s + 1;
          }
          return s;
        });
      } else if (e.deltaY < -50) {
        setScrollStep(s => {
          if (s === 2) {
            // Do NOT allow scroll up to exit the gallery to prevent accidental closing.
            // The user must click the 'Back to Avatars' button.
            return s;
          }
          if (s > 0) {
            isLocked = true;
            clearTimeout(lockTimeout);
            lockTimeout = setTimeout(() => { isLocked = false; }, 1200);
            return s - 1;
          }
          return s;
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      clearTimeout(mountTimeout);
      clearTimeout(lockTimeout);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [selected]);

  useEffect(() => {
    if (!promptRef.current) return;
    if (selected) {
      gsap.to(promptRef.current, { opacity: 0, y: 10, duration: 0.3 });
    } else {
      gsap.fromTo(promptRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5 }
      );
    }
  }, [selected]);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      position: "relative",
      background: "var(--bg)",
    }}>
      <Background />


      {/* ── Main Views ─────────────────────────── */}
      <AnimatePresence>
        {!selected ? (
          <motion.div
            key="selection-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5vh",
              padding: "80px 48px 40px",
              pointerEvents: "auto",
            }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ 
                fontFamily: "Impact, sans-serif", 
                fontSize: "6vw", 
                color: "white", 
                textTransform: "uppercase", 
                letterSpacing: "0.02em", 
                margin: 0, 
                textShadow: "0 10px 30px rgba(0,0,0,0.8)",
                lineHeight: 1
              }}
            >
              MEET THE DEVELOPERS
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
              animate={{ 
                opacity: scrollStep >= 1 ? 1 : 0, 
                y: scrollStep >= 1 ? 0 : 50, 
                filter: scrollStep >= 1 ? "blur(0px)" : "blur(10px)",
                pointerEvents: scrollStep >= 1 ? "auto" : "none" 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ display: "flex", gap: "clamp(16px, 3vw, 48px)" }}
            >
              {Object.values(AVATARS).map((avatar) => (
                <AvatarCard key={avatar.id} avatar={avatar} />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: "absolute", inset: 0, zIndex: 10 }}
          >
            <DetailView />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scrollStep === 2 && !selected && (
          <motion.div
            key="sliding-gallery"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, zIndex: 50, background: "#080808" }}
          >
            {/* Adding a simple close button in case they want to go back to the avatars explicitly */}
            <button
              onClick={() => setScrollStep(1)}
              style={{
                position: "absolute", top: 24, right: 24, zIndex: 100,
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12
              }}
            >
              Back to Avatars
            </button>
            <HackathonGallery onCompleteScroll={onOpenProjects} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom prompt ──────────────────────────── */}
      {!selected && scrollStep < 2 && (
        <div
          ref={promptRef}
          onClick={() => setScrollStep(s => Math.min(s + 1, 2))}
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            pointerEvents: "auto",
          }}
        >
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.22)",
            textAlign: "center",
            lineHeight: 1.6
          }}>
            {scrollStep === 0 ? "Scroll down for profiles" : "Select a profile or scroll down"}
          </p>
          <ChevronDown />
        </div>
      )}
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ opacity: 0.2 }}>
      <path d="M1 1L8 8L15 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
