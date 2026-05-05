import React from "react";
import { motion } from "framer-motion";

export function ProjectDetail({ project: proj, onBack }) {
  if (!proj) return null;

  // UI styles for Google Play Store layout
  const textMuted = "rgba(255,255,255,0.6)";
  const bgCard = "rgba(255,255,255,0.05)";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "#080808",
        fontFamily: "'Syne', sans-serif",
        overflowY: "auto", overflowX: "hidden"
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 60px 24px" }}>
        
        {/* HERO HEADER */}
        <div style={{ display:"flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24, marginBottom: 40 }}>
          <div style={{ display:"flex", gap:20, alignItems:"center" }}>
            <div style={{ 
              width:104, height:104, borderRadius:24, 
              background:`linear-gradient(135deg, ${proj.bgColor}, #222)`, 
              border:`1px solid rgba(255,255,255,0.1)`, 
              display:"flex", alignItems:"center", justifyContent:"center", 
              fontSize:42, boxShadow:"0 12px 24px rgba(0,0,0,0.4)" 
            }}>
              {proj.title.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 6vw, 72px)", color:"#fff", margin:"0 0 6px 0", letterSpacing:"0.02em", lineHeight: 0.9 }}>{proj.title}</h1>
              <p style={{ color:proj.bgColor, margin:0, fontSize:18, fontWeight:600, letterSpacing: "0.02em" }}>{proj.tagline}</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", color:textMuted, margin:"10px 0 0 0", fontSize:11, letterSpacing: "0.15em", textTransform: "uppercase" }}>{proj.subtitle} • {proj.year}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display:"flex", gap:12 }}>
            {proj.buttons?.map((btn, i) => (
              <a key={i} href={btn.url} target="_blank" rel="noopener noreferrer" style={{
                padding:"14px 28px", borderRadius:100, textAlign:"center", textDecoration:"none", fontWeight:700,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase",
                background: i === 0 ? proj.bgColor : bgCard,
                color: i === 0 ? proj.cardText : "#fff",
                border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.1)"
              }}>
                {btn.label}
              </a>
            ))}
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 32 }}>
          
          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Image Placeholder */}
            <div style={{ 
              width:"100%", height: 340, borderRadius: 24, 
              background:`linear-gradient(to right bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`, 
              border:"1px solid rgba(255,255,255,0.05)", 
              display:"flex", alignItems:"center", justifyContent:"center", 
              position:"relative", overflow:"hidden" 
            }}>
               <div style={{ textAlign: "center" }}>
                 <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
                 <div style={{ fontFamily: "'JetBrains Mono', monospace", color: textMuted, fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase" }}>ADD PHOTOS HERE</div>
               </div>
            </div>

            {/* 🟥 4. HOW IT WORKS */}
            <section style={{ background: bgCard, padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize:28, color:"#fff", margin:"0 0 24px 0", display:"flex", alignItems:"center", gap:12, letterSpacing:"0.04em" }}>
                <span style={{ fontSize:22 }}>🟥</span> HOW IT WORKS
              </h2>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                {proj.howItWorks?.map((step, i) => (
                  <React.Fragment key={i}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, flex:1, textAlign:"center" }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:`rgba(${proj.accentRGB},0.15)`, color:proj.bgColor, display:"flex", alignItems:"center", justifyContent:"center", fontFamily: "'JetBrains Mono', monospace", fontSize:14, fontWeight:700 }}>
                        {i + 1}
                      </div>
                      <span style={{ color:"#ccc", fontSize:13, lineHeight:1.3, fontWeight:500 }}>{step}</span>
                    </div>
                    {i < proj.howItWorks.length - 1 && (
                      <div style={{ color:"rgba(255,255,255,0.2)", fontSize:18, transform:"translateY(-16px)" }}>→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </section>
            
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* 🟩 2. WHAT IT DOES */}
            <section style={{ background: bgCard, padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize:28, color:"#fff", margin:"0 0 16px 0", display:"flex", alignItems:"center", gap:12, letterSpacing:"0.04em" }}>
                <span style={{ fontSize:22 }}>🟩</span> ABOUT THIS PROJECT
              </h2>
              <p style={{ color:textMuted, fontSize:16, lineHeight:1.6, margin:0 }}>{proj.whatItDoes}</p>
            </section>

            {/* 🟨 3. KEY FEATURES */}
            <section style={{ background: bgCard, padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize:28, color:"#fff", margin:"0 0 20px 0", display:"flex", alignItems:"center", gap:12, letterSpacing:"0.04em" }}>
                <span style={{ fontSize:22 }}>🟨</span> KEY FEATURES
              </h2>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {proj.keyFeatures?.map((f, i) => (
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:proj.bgColor, marginTop:8 }} />
                    <span style={{ color:"#e2e2e2", fontSize:16, lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
              {/* 🟪 5. TECH STACK */}
              <section style={{ background: bgCard, padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize:28, color:"#fff", margin:"0 0 20px 0", display:"flex", alignItems:"center", gap:12, letterSpacing:"0.04em" }}>
                  <span style={{ fontSize:22 }}>🟪</span> TECH STACK
                </h2>
                <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
                  {proj.tech?.map((t) => (
                    <div key={t} style={{ fontFamily: "'JetBrains Mono', monospace", padding:"8px 14px", borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:proj.bgColor, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                      {t}
                    </div>
                  ))}
                </div>
              </section>

              {/* 🟫 6. RESULTS / HIGHLIGHTS */}
              <section style={{ background: bgCard, padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize:28, color:"#fff", margin:"0 0 20px 0", display:"flex", alignItems:"center", gap:12, letterSpacing:"0.04em" }}>
                  <span style={{ fontSize:22 }}>🟫</span> HIGHLIGHTS
                </h2>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {proj.highlights?.map((h, i) => (
                    <div key={i} style={{ display:"flex", gap:16, alignItems:"center", background:"rgba(255,255,255,0.03)", padding:"12px 16px", borderRadius:14 }}>
                      <span style={{ fontSize:20 }}>🏆</span>
                      <span style={{ color:"#eee", fontSize:14, fontWeight:500 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
