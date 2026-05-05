import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Background } from "./Background";

function useSliding3DTransforms(scrollerRef) {
  const rafRef = useRef(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll("[data-hackathon-card]"));
    if (cards.length === 0) return;

    const apply = () => {
      rafRef.current = 0;
      const sRect = scroller.getBoundingClientRect();
      const centerX = sRect.left + sRect.width / 2;

      for (const el of cards) {
        const r = el.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = (cardCenter - centerX) / sRect.width; // ~[-0.5..0.5]
        const abs = Math.min(1, Math.abs(dist) * 2);

        const rotateY = dist * -38;
        const translateZ = 170 * (1 - abs);
        const scale = 1 - abs * 0.18;
        const opacity = 1 - abs * 0.55;

        el.style.transform = `perspective(1400px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        el.style.opacity = String(opacity);
      }
    };

    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(apply);
    };

    apply();
    scroller.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [scrollerRef]);
}

function HackathonCard({ item }) {
  return (
    <div
      data-hackathon-card
      className="hack-card-outer"
      style={{
        width: 360,
        height: 240,
        flex: "0 0 auto",
        transformStyle: "preserve-3d",
        transition: "transform 220ms ease, opacity 220ms ease",
      }}
    >
      <div
        className="hack-card"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 18,
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
          border: "1px solid var(--border)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
          overflow: "hidden",
          cursor: "default",
        }}
      >
        {/* Front */}
        <div
          className="hack-face"
          style={{
            position: "absolute",
            inset: 0,
            padding: 18,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {item.year} • {item.location}
            </p>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: item.accent,
                opacity: 0.9,
              }}
            >
              {item.track}
            </span>
          </div>

          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: 22,
              letterSpacing: "0.02em",
              color: "var(--text)",
              lineHeight: 1.1,
            }}
          >
            {item.name}
          </h3>

          <p style={{ margin: 0, color: "rgba(255,255,255,0.62)", fontSize: 13, lineHeight: 1.45 }}>
            {item.project}
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto" }}>
            {item.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid rgba(${item.accentRgb}, 0.2)`,
                  color: item.accent,
                  background: `linear-gradient(180deg, rgba(${item.accentRgb}, 0.12), transparent)`,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 120,
              height: 120,
              background: `radial-gradient(circle at 20% 20%, rgba(${item.accentRgb}, 0.16), transparent 60%)`,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Back */}
        <div
          className="hack-face hack-back"
          style={{
            position: "absolute",
            inset: 0,
            padding: 18,
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: 10,
            background: "rgba(0,0,0,0.35)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontSize: 11,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Rank
          </p>
          <div
            style={{
              fontFamily: "Impact, sans-serif",
              fontSize: 44,
              lineHeight: 1,
              textTransform: "uppercase",
              color: item.accent,
              textShadow: `0 0 22px rgba(${item.accentRgb}, 0.14)`,
            }}
          >
            {item.rank}
          </div>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.5 }}>
            {item.rankNote}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HackathonsPage({ onBack }) {
  const scrollerRef = useRef(null);

  const hackathons = useMemo(
    () => [
      {
        id: "h1",
        year: "2025",
        location: "Pune",
        track: "AI",
        name: "SmartOps Hackathon",
        project: "Built an AI support triage tool that routes tickets + drafts replies with guardrails.",
        tags: ["LLM", "RAG", "FastAPI"],
        rank: "Winner",
        rankNote: "1st place • Best end-to-end demo",
        accent: "var(--accent-l)",
        accentRgb: "var(--accent-l-rgb)",
      },
      {
        id: "h2",
        year: "2025",
        location: "Mumbai",
        track: "Web",
        name: "BuildFest",
        project: "Realtime portfolio builder with cinematic transitions + structured content blocks.",
        tags: ["React", "Motion", "UI"],
        rank: "Runner-up",
        rankNote: "2nd place • Best design execution",
        accent: "var(--accent-r)",
        accentRgb: "var(--accent-r-rgb)",
      },
      {
        id: "h3",
        year: "2024",
        location: "Online",
        track: "IoT",
        name: "InnovateX",
        project: "Energy monitoring dashboard with anomaly alerts and a minimal ops workflow.",
        tags: ["Dash", "Alerts", "Charts"],
        rank: "Finalist",
        rankNote: "Top 10 • Strong problem framing",
        accent: "var(--accent-l)",
        accentRgb: "var(--accent-l-rgb)",
      },
      {
        id: "h4",
        year: "2024",
        location: "Bangalore",
        track: "FinTech",
        name: "Payments Sprint",
        project: "Fraud scoring prototype with explainable signals and a review queue.",
        tags: ["Scoring", "Queue", "XAI"],
        rank: "Winner",
        rankNote: "1st place • Best technical depth",
        accent: "var(--accent-r)",
        accentRgb: "var(--accent-r-rgb)",
      },
    ],
    [],
  );

  useSliding3DTransforms(scrollerRef);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "var(--bg)",
      }}
    >
      <Background />


      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          padding: "132px 48px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          zIndex: 5,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: "Impact, sans-serif",
                fontSize: "4.2vw",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                lineHeight: 1,
                color: "white",
                textShadow: "0 10px 30px rgba(0,0,0,0.8)",
              }}
            >
              Hackathons
            </h1>
            <p
              style={{
                margin: "10px 0 0 0",
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "monospace",
                fontSize: 11,
              }}
            >
              Hover a card to flip and reveal rank
            </p>
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.28)",
              fontFamily: "monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Scroll →
          </div>
        </div>

        <div
          ref={scrollerRef}
          style={{
            marginTop: 10,
            position: "relative",
            overflowX: "auto",
            overflowY: "hidden",
            padding: "18px 12px 22px",
            display: "flex",
            gap: 18,
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {hackathons.map((h) => (
            <div key={h.id} style={{ scrollSnapAlign: "center" }} className="hack-snap">
              <HackathonCard item={h} />
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>3D sliding window</span>
          <span>Flip on hover</span>
        </div>
      </motion.div>

      <style>{`
        .hack-card-outer:hover .hack-card { transform: rotateY(180deg); }
        .hack-card-outer { will-change: transform, opacity; }
        .hack-card { will-change: transform; }
        .hack-face { transform-style: preserve-3d; }
        /* Keep scrollbars tiny like the rest of the site */
        .hack-snap::-webkit-scrollbar { height: 2px; }
      `}</style>
    </div>
  );
}
