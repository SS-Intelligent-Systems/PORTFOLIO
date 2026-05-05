export function TopBar({
  title = "Portfolio",
  subtitle = "Character Selection",
  rightLabel = "2 Profiles",
  onRightClick,
  leftLabel,
  onLeftClick,
}) {
  return (
    <header style={{
      position: "absolute",
      top: 0, left: 0, right: 0,
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 36px",
      zIndex: 100,
      borderBottom: "1px solid var(--border)",
      background: "rgba(13,13,13,0.7)",
      backdropFilter: "blur(20px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 8, height: 8,
          borderRadius: "50%",
          background: "var(--accent-green)",
          boxShadow: "0 0 8px var(--accent-green)",
        }} />
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "var(--text)",
          textTransform: "uppercase",
        }}>
          {title}
        </span>
      </div>
      
      {leftLabel && (
        <div
          role="button"
          tabIndex={0}
          onClick={onLeftClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onLeftClick();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.35)",
            userSelect: "none",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        >
          <span style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
          }}>
            {leftLabel}
          </span>
        </div>
      )}
      </div>

      {/* Center title */}
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
        }}>
          {subtitle}
        </p>
      </div>

      {/* Status */}
      <div
        role={onRightClick ? "button" : undefined}
        tabIndex={onRightClick ? 0 : undefined}
        onClick={onRightClick}
        onKeyDown={(e) => {
          if (!onRightClick) return;
          if (e.key === "Enter" || e.key === " ") onRightClick();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: onRightClick ? "pointer" : "default",
          padding: onRightClick ? "10px 12px" : 0,
          borderRadius: 10,
          border: onRightClick ? "1px solid rgba(255,255,255,0.08)" : "none",
          background: onRightClick ? "rgba(0,0,0,0.35)" : "transparent",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          if (!onRightClick) return;
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
        }}
        onMouseLeave={(e) => {
          if (!onRightClick) return;
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        }}
      >
        <span style={{
          fontFamily: "monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.25)",
          textTransform: "uppercase",
        }}>
          {rightLabel}
        </span>
        <div style={{
          width: 6, height: 6,
          borderRadius: "50%",
          background: "rgba(0,229,255,0.6)",
          animation: "pulse 2s infinite",
        }} />
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </header>
  );
}
