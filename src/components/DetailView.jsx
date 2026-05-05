import { useMemo, useState } from "react";
import { useScene, AVATARS } from "../context/SceneContext";
import { AnimatePresence, motion } from "framer-motion";

export function DetailView() {
  const { selected, deselect } = useScene();
  const avatar = AVATARS[selected];
  const [contactOpen, setContactOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  const avatarId = avatar?.id;
  const resumeHref = avatarId === "Sanket"
    ? "/resume/sanket%20resume%20final%20(2).pdf"
    : "resume\\Resume__updated.pdf";

  const contactLinks = useMemo(() => {
    if (avatarId === "Shravanya") {
      return [
        { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/in/shravanya-andhale-b729a2314/" },
        { label: "Instagram", short: "ig", href: "https://www.instagram.com/" },
        { label: "GitHub", short: "gh", href: "https://github.com/Shravanya178" },
        { label: "Call", short: "☎", href: "tel:+919653345310" },
      ];
    }

    return [
      { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/in/sanket-patil1708/" },
      { label: "Instagram", short: "ig", href: "https://www.instagram.com/" },
      { label: "GitHub", short: "gh", href: "https://github.com/sanketp09" },
      { label: "Call", short: "☎", href: "tel:+919152030715" },
    ];
  }, [avatarId]);

  if (!avatar) return null;

  return (
    <motion.div
      key="detail-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        pointerEvents: "auto",
        zIndex: 50,
        backgroundColor: "rgba(22,22,24,0.9)",
        backdropFilter: "blur(20px)",
      }}
    >
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        {/* Left Cards Lines */}
        <ElbowLine start={["25%", "36%"]} mid={["35%", "36%"]} end={["41%", "45%"]} avatar={avatar} delay={0.3} />
        <ElbowLine start={["25%", "64%"]} mid={["35%", "64%"]} end={["41%", "55%"]} avatar={avatar} delay={0.4} />
        
        {/* Right Cards Lines */}
        <ElbowLine start={["75%", "28%"]} mid={["65%", "28%"]} end={["59%", "38%"]} avatar={avatar} delay={0.3} />
        <ElbowLine start={["75%", "50%"]} mid={["65%", "50%"]} end={["59%", "50%"]} avatar={avatar} delay={0.4} />
        <ElbowLine start={["75%", "72%"]} mid={["65%", "72%"]} end={["59%", "62%"]} avatar={avatar} delay={0.5} />

        {/* Connection Nodes on the Photo */}
        <motion.g 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          fill={avatar.accent}
        >
          <circle cx="41%" cy="45%" r="5" style={{ filter: `drop-shadow(0 0 4px ${avatar.accent})` }} />
          <circle cx="41%" cy="55%" r="5" style={{ filter: `drop-shadow(0 0 4px ${avatar.accent})` }} />
          <circle cx="59%" cy="38%" r="5" style={{ filter: `drop-shadow(0 0 4px ${avatar.accent})` }} />
          <circle cx="59%" cy="50%" r="5" style={{ filter: `drop-shadow(0 0 4px ${avatar.accent})` }} />
          <circle cx="59%" cy="62%" r="5" style={{ filter: `drop-shadow(0 0 4px ${avatar.accent})` }} />
        </motion.g>
      </svg>

      {/* Big grey background text watermark */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        className="bg-text" 
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "15vw",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          color: "rgba(100, 100, 100, 0.08)", // Very subtle grey text
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 0,
          textTransform: "uppercase"
        }}
      >
        {avatar.name.split(" ")[0]}
      </motion.div>

      <button
        onClick={deselect}
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          padding: "12px 24px",
          background: "black",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.6)",
          borderRadius: 30,
          cursor: "pointer",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: "0.1em",
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => { e.target.style.color = "white"; e.target.style.borderColor = avatar.accent; e.target.style.boxShadow = `0 0 15px ${avatar.accentDim}`; }}
        onMouseLeave={(e) => { e.target.style.color = "rgba(255,255,255,0.6)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
      >
        ← BACK TO SELECTION
      </button>

      {/* Grid Layout for Bento Box */}
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "grid",
        gridTemplateColumns: "1fr min(400px, 35vw) 1fr",
        gap: 32,
        width: "100%",
        maxWidth: 1400,
        height: "80vh",
        alignItems: "center",
        perspective: 1500
      }}>
        
        {/* LEFT CARDS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, justifyContent: "center" }}>
          <motion.div 
            initial={{ opacity: 0, x: -50, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="info-card" style={cardStyle(avatar)}
          >
            <h3 style={titleStyle(avatar.accent)}>EXPERIENCE</h3>
            <ul style={listStyle}>
              {avatar.data.experience.map((item, i) => (
                <li key={i} style={listItemStyle(avatar.accent)}>
                  <span style={{ color: avatar.accent, marginTop: 2 }}>▹</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -50, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="info-card" style={cardStyle(avatar)}
          >
            <h3 style={titleStyle(avatar.accent)}>STRENGTHS</h3>
            <ul style={listStyle}>
              {avatar.data.strengths.map((item, i) => (
                <li key={i} style={listItemStyle(avatar.accent)}>
                  <span style={{ color: avatar.accent, marginTop: 2 }}>▹</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* CENTER PHOTO */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, height: "100%" }}>
          <motion.div className="center-photo" 
            style={{
              height: "100%",
              maxHeight: 650,
              background: "transparent",
              boxShadow: "none",
              border: "none", // Invisible borders
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end"
            }}
          >
            <motion.img 
              layoutId={`photo-${avatar.id}`}
              src={avatar.photo}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                zIndex: 1
              }} 
            />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                position: "relative",
                zIndex: 2,
                padding: "0 20px 20px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                perspective: 1200
              }}
            >
              <h2 style={{ 
                fontFamily: "var(--font-display)", fontSize: 36, margin: "0 0 8px 0", color: "white",
                textShadow: "0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.8)"
              }}>
                {avatar.name}
              </h2>
              <p style={{ 
                color: avatar.accent, fontSize: 14, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.15em",
                textShadow: "0 2px 10px rgba(0,0,0,0.8)"
              }}>
                {avatar.title}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, rotateX: -18 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              perspective: 1200,
              justifyContent: "flex-start",
            }}
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
              <motion.button
                type="button"
                onClick={() => setResumeOpen(true)}
                whileHover={{ y: -2, rotateX: 8, rotateY: -10, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                style={actionButtonStyle(true)}
              >
                Resume
              </motion.button>

              <AnimatePresence mode="wait" initial={false}>
                {!contactOpen ? (
                  <motion.button
                    key="contact-main"
                    type="button"
                    onClick={() => setContactOpen(true)}
                    initial={{ opacity: 0, y: 18, rotateX: -24, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, rotateX: 30, scale: 0.85 }}
                    whileHover={{ y: -2, rotateX: 8, rotateY: 10, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 250, damping: 18 }}
                    style={actionButtonStyle(false)}
                  >
                    Contact Me
                  </motion.button>
                ) : (
                  <motion.div
                    key="contact-split"
                    initial={{ opacity: 0, y: 16, rotateX: -36, scale: 0.86 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, rotateX: 28, scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", transformStyle: "preserve-3d" }}
                  >
                    {contactLinks.map((link, index) => (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                        initial={{ opacity: 0, y: 16, rotateX: -30, rotateY: 14, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 240, damping: 16, delay: index * 0.05 }}
                        whileHover={{ y: -2, rotateX: 10, rotateY: -8, scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        style={miniActionButtonStyle(avatar.accent)}
                        aria-label={link.label}
                        title={link.label}
                      >
                        <SocialIcon type={link.label} />
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {contactOpen && (
              <motion.button
                type="button"
                onClick={() => setContactOpen(false)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Close contacts
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* RIGHT CARDS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, justifyContent: "center" }}>
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="info-card" style={cardStyle(avatar)}
          >
            <h3 style={titleStyle(avatar.accent)}>ABOUT</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontSize: 14, margin: 0 }}>
              {avatar.data.about}
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="info-card" style={cardStyle(avatar)}
          >
            <h3 style={titleStyle(avatar.accent)}>ACHIEVEMENTS</h3>
            <ul style={listStyle}>
              {avatar.data.achievements.map((item, i) => (
                <li key={i} style={listItemStyle(avatar.accent)}>
                  <span style={{ color: avatar.accent, marginTop: 2 }}>▹</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="info-card" style={cardStyle(avatar)}
          >
            <h3 style={titleStyle(avatar.accent)}>SKILLS</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {avatar.data.skills.map((skill, i) => (
                <span key={i} style={{
                  background: avatar.accentDim,
                  color: avatar.accent,
                  border: `1px solid ${avatar.accent}40`,
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                  fontWeight: 500
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      <AnimatePresence>
        {resumeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(14px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 16, scale: 0.98, rotateX: 6 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              style={{
                width: "min(1100px, 96vw)",
                height: "min(88vh, 960px)",
                background: "#0b0b0d",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 28,
                boxShadow: "0 30px 120px rgba(0,0,0,0.6)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: avatar.accent, boxShadow: `0 0 10px ${avatar.accent}` }} />
                  <span style={{ fontFamily: "var(--font-display)", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                    Resume Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setResumeOpen(false)}
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "10px 16px",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
              <iframe
                title="Resume"
                src={resumeHref}
                style={{ width: "100%", flex: 1, border: 0, background: "#111" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const cardStyle = (avatar) => ({
  background: "#000000",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  border: "1px solid rgba(255,255,255,0.05)",
  position: "relative",
  overflow: "hidden"
});

const titleStyle = (accent) => ({
  fontFamily: "var(--font-display)",
  fontSize: 12,
  letterSpacing: "0.2em",
  color: accent,
  marginBottom: 16,
  marginTop: 0,
});

const listStyle = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: 12
};

const listItemStyle = (accent) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  fontSize: 14,
  color: "rgba(255,255,255,0.7)",
  lineHeight: 1.4
});

const actionButtonStyle = (primary) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: primary ? 150 : 118,
  padding: "12px 18px",
  borderRadius: 999,
  border: primary ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(0,229,255,0.28)",
  background: primary ? "rgba(255,255,255,0.06)" : "rgba(0,229,255,0.08)",
  color: "#fff",
  textDecoration: "none",
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease",
  boxShadow: primary ? "0 10px 30px rgba(0,0,0,0.25)" : "0 0 0 1px rgba(0,229,255,0.08) inset",
});

const miniActionButtonStyle = (accent) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0,
  width: 58,
  height: 58,
  padding: 0,
  borderRadius: 999,
  border: `1px solid ${accent}55`,
  background: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))`,
  boxShadow: `0 12px 24px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.08)`,
  color: "#fff",
  textDecoration: "none",
  backdropFilter: "blur(10px)",
  transformStyle: "preserve-3d",
  position: "relative",
  overflow: "hidden",
  transition: "width 220ms ease, transform 180ms ease, box-shadow 180ms ease, background 180ms ease",
  transformStyle: "preserve-3d",
});

function SocialIcon({ type }) {
  const common = {
    width: 22,
    height: 22,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" style={common}>
        <path d="M6.5 9.5V18" />
        <path d="M6.5 6.75v.25" />
        <path d="M10 18v-4.8c0-1.7 1.1-3 2.8-3 1.7 0 2.7 1.1 2.7 3V18" />
        <path d="M10 13.2V18" />
        <rect x="4" y="4" width="16" height="16" rx="3" />
      </svg>
    );
  }

  if (type === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" style={common}>
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "GitHub") {
    return (
      <svg viewBox="0 0 24 24" style={common}>
        <path d="M9 19c-4 1.2-4-2-5-2" />
        <path d="M15 22v-3.2c0-.8.3-1.4.8-1.9-2.6-.3-5.4-1.3-5.4-6a4.7 4.7 0 0 1 1.2-3.3 4.3 4.3 0 0 1 .1-3.2s1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C23 2.3 24 2.6 24 2.6a4.3 4.3 0 0 1 .1 3.2 4.7 4.7 0 0 1 1.2 3.3c0 4.7-2.8 5.7-5.4 6 .5.5.8 1.1.8 1.9V22" />
        <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" style={common}>
      <path d="M22 16.9v2.7a2 2 0 0 1-2.2 2 18 18 0 0 1-7.8-2.8 17.7 17.7 0 0 1-5.4-5.4A18 18 0 0 1 3.8 5.6 2 2 0 0 1 5.8 3.4h2.7a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L10 10.4a14 14 0 0 0 3.6 3.6l.6-.6a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

const miniSymbolStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  height: 20,
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.9)",
  fontFamily: "var(--font-body)",
  fontSize: 10,
  lineHeight: 1,
  flexShrink: 0,
};

const GlowLine = ({ x1, y1, x2, y2, avatar, delay = 0 }) => (
  <g>
    <motion.line 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.25 }}
      transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
      x1={x1} y1={y1} x2={x2} y2={y2}
      fill="none" stroke={avatar.accent} strokeWidth="10" 
      style={{ filter: "blur(4px)" }}
    />
    <motion.line 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.9 }}
      transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
      x1={x1} y1={y1} x2={x2} y2={y2}
      fill="none" stroke={avatar.accent} strokeWidth="3" 
    />
  </g>
);

const ElbowLine = ({ start, mid, end, avatar, delay }) => (
  <g>
    <GlowLine x1={start[0]} y1={start[1]} x2={mid[0]} y2={mid[1]} avatar={avatar} delay={delay} />
    <GlowLine x1={mid[0]} y1={mid[1]} x2={end[0]} y2={end[1]} avatar={avatar} delay={delay + 0.3} />
  </g>
);
