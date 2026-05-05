import { useEffect, useRef } from "react";
import gsap from "gsap";

export function SectionPage({ section, onClose }) {
  const overlayRef = useRef();
  const panelRef = useRef();
  const contentRef = useRef();

  // Animate in
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );
    tl.fromTo(panelRef.current,
      { y: 60, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" },
      "-=0.1"
    );
    tl.fromTo(
      contentRef.current?.querySelectorAll(".reveal-item"),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    );
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, { y: 40, opacity: 0, scale: 0.96, duration: 0.35, ease: "power2.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" }, "-=0.15");
  };

  const grad = `linear-gradient(160deg, ${section.gradient[0]} 0%, ${section.gradient[1]} 100%)`;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed", inset: 0,
        zIndex: 2000,
        background: "rgba(5,8,15,0.85)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px",
      }}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        ref={panelRef}
        style={{
          width: "100%",
          maxWidth: 900,
          maxHeight: "80vh",
          overflowY: "auto",
          background: grad,
          border: `1px solid ${section.accentColor}22`,
          borderRadius: 24,
          boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 80px ${section.accentColor}18`,
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: 24, right: 24,
            width: 36, height: 36,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1,
          }}
        >×</button>

        <div ref={contentRef} style={{ padding: "52px 56px" }}>
          {/* Header */}
          <div className="reveal-item" style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 48 }}>
            <div>
              <p style={{
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: "0.35em",
                color: section.accentColor,
                marginBottom: 10,
                textTransform: "uppercase",
              }}>
                {section.index} — {section.subtitle}
              </p>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(42px, 6vw, 72px)",
                lineHeight: 1,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}>
                {section.label}
              </h1>
            </div>
          </div>

          {/* Divider */}
          <div className="reveal-item" style={{
            height: 1,
            background: `linear-gradient(90deg, ${section.accentColor}66, transparent)`,
            marginBottom: 40,
          }} />

          {/* Items grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}>
            {section.items.map((item, i) => (
              <div
                key={i}
                className="reveal-item"
                style={{
                  padding: "24px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  backdropFilter: "blur(8px)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${section.accentColor}44`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <div style={{
                  display: "inline-flex",
                  padding: "3px 10px",
                  background: `${section.accentColor}18`,
                  border: `1px solid ${section.accentColor}33`,
                  borderRadius: 6,
                  marginBottom: 14,
                }}>
                  <span style={{
                    fontFamily: "monospace",
                    fontSize: 10,
                    color: section.accentColor,
                    letterSpacing: "0.15em",
                  }}>
                    {item.tech}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#fff",
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}>
                  {item.name}
                </h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.6,
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="reveal-item" style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
            <button
              onClick={handleClose}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "0.08em",
                color: section.accentColor,
                background: `${section.accentColor}15`,
                border: `1px solid ${section.accentColor}44`,
                borderRadius: 10,
                padding: "14px 36px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.background = `${section.accentColor}25`}
              onMouseLeave={(e) => e.target.style.background = `${section.accentColor}15`}
            >
              ← Back to navigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
