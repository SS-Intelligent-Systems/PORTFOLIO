/**
 * ProjectsGallery.jsx  —  Active Theory Cylindrical Helix
 * ══════════════════════════════════════════════════════════════
 *  INSTALL:
 *    npm install three @react-three/fiber @react-three/drei gsap framer-motion
 *
 *  FONTS — paste into public/index.html  <head>:
 *    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
 *
 *  HOW THE EFFECT WORKS:
 *  ─────────────────────
 *  Cards live at positions on a 3-D HELIX:
 *    x = R·sin(i·θ),  y = -i·yStep,  z = R·cos(i·θ)
 *  Each card calls lookAt(0,y,0) so it always faces the camera.
 *
 *  On scroll the entire helix GROUP:
 *    • rotates around Y  →  sweeps cards diagonally left/right
 *    • translates up Y   →  cards rise from below
 *  Together these two motions create the exact Active-Theory
 *  "diagonal conveyor on a tilted cylinder" feel.
 *
 *  Click a card → Spring zoom + Framer-Motion detail modal.
 * ══════════════════════════════════════════════════════════════
 */

"use client"; // remove if not Next.js

import React, {
  useRef, useState, useEffect, useMemo, useCallback, Suspense,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";

// ─────────────────────────────────────────────────────────
//  DATA  ← swap with real projects
// ─────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1, title: "ACCESSAI", subtitle: "AI / NLP", year: "2024",
    role: "Full-Stack + ML", status: "LIVE",
    tagline: "Government docs made human.",
    description: "AI-powered plain-language converter using custom NLP pipelines and LLMs. Built in 36 hrs at HackMIT, demoed to 400+ attendees.",
    tech: ["Python", "FastAPI", "React", "OpenAI"],
    colorHex: "#c9a84c", accentRGB: "201,168,76", bgColor: "#0f0a00",
    link: "https://github.com",
  },
  {
    id: 2, title: "COSYNC", subtitle: "Real-time / DevTools", year: "2024",
    role: "Frontend + Architecture", status: "OPEN SOURCE",
    tagline: "Zero merge conflicts. Ever.",
    description: "CRDT-based collaborative code editor with AI conflict resolution. Won Infrastructure Track at HackIllinois.",
    tech: ["TypeScript", "WebSockets", "Redis", "Yjs"],
    colorHex: "#4fc3f7", accentRGB: "79,195,247", bgColor: "#001525",
    link: "https://github.com",
  },
  {
    id: 3, title: "SIGNBRIDGE", subtitle: "Computer Vision", year: "2022",
    role: "ML Engineer", status: "AWARD WINNER",
    tagline: "94% ASL accuracy, live.",
    description: "Custom vision transformer on 50k+ ASL samples. Real-time sign language interpretation. Won Best AI/ML at CalHacks 2022.",
    tech: ["PyTorch", "MediaPipe", "FastAPI", "WebRTC"],
    colorHex: "#a78bfa", accentRGB: "167,139,250", bgColor: "#0c0018",
    link: "https://github.com",
  },
  {
    id: 4, title: "PEERLEND", subtitle: "FinTech / Web3", year: "2023",
    role: "Solidity + Frontend", status: "TESTNET",
    tagline: "On-chain credit. No bank.",
    description: "Decentralized micro-lending with smart contract escrow and on-chain credit scoring. Won Best FinTech at PennApps 2023.",
    tech: ["Solidity", "React", "ethers.js", "IPFS"],
    colorHex: "#34d399", accentRGB: "52,211,153", bgColor: "#001a0f",
    link: "https://github.com",
  },
  {
    id: 5, title: "MINDWAVE", subtitle: "Health Tech / ML", year: "2024",
    role: "iOS + ML", status: "PROTOTYPE",
    tagline: "Stress detected. CBT triggered.",
    description: "Wearable mental health companion analyzing HRV data with on-device CoreML — zero cloud exposure.",
    tech: ["Swift", "CoreML", "Flutter", "HealthKit"],
    colorHex: "#f87171", accentRGB: "248,113,113", bgColor: "#120000",
    link: "https://github.com",
  },
  {
    id: 6, title: "GREENCI", subtitle: "DevOps / Green Tech", year: "2023",
    role: "Backend + DevOps", status: "PUBLISHED",
    tagline: "CO₂ cost of every deploy.",
    description: "GitHub Actions carbon-footprint tracker for cloud infra. Surfaces CO₂ estimates in PR comments automatically.",
    tech: ["Go", "Prometheus", "Terraform", "AWS"],
    colorHex: "#86efac", accentRGB: "134,239,172", bgColor: "#002000",
    link: "https://github.com",
  },
];

// ─────────────────────────────────────────────────────────
//  HELIX CONSTANTS
// ─────────────────────────────────────────────────────────
const R          = 3.6;   // cylinder radius
const Y_STEP     = 1.7;   // vertical drop per card
const ANGLE_STEP = (Math.PI * 2) / 4.5; // angular gap

function helixPos(i) {
  const a = i * ANGLE_STEP;
  return { x: R * Math.sin(a), y: -i * Y_STEP, z: R * Math.cos(a), angle: a };
}

// ─────────────────────────────────────────────────────────
//  SINGLE CARD
// ─────────────────────────────────────────────────────────
function Card3D({ proj, index, active, hovered, onClick, onHover }) {
  const grp   = useRef();
  const mesh  = useRef();
  const glow  = useRef();
  const pos   = useMemo(() => helixPos(index), [index]);

  useEffect(() => {
    if (!grp.current) return;
    grp.current.position.set(pos.x, pos.y, pos.z);
    grp.current.lookAt(0, pos.y, 0);
  }, [pos]);

  useFrame(({ clock }) => {
    if (!mesh.current || !glow.current) return;
    const t = clock.elapsedTime;
    const ts = active ? 1.13 : hovered ? 1.06 : 1.0;
    mesh.current.scale.lerp(new THREE.Vector3(ts, ts, ts), 0.09);
    glow.current.material.opacity = active
      ? 0.22 + Math.sin(t * 2.2) * 0.06
      : hovered ? 0.12 : 0.0;
    mesh.current.children.forEach(c => {
      if (c.material) c.material.opacity = active ? 1 : hovered ? 0.88 : 0.55;
    });
  });

  const col = new THREE.Color(proj.colorHex);

  return (
    <group ref={grp}>
      {/* Glow halo */}
      <mesh ref={glow} position={[0, 0, -0.06]}>
        <planeGeometry args={[2.3, 3.1]} />
        <meshBasicMaterial color={col} transparent opacity={0} />
      </mesh>

      {/* Main card body */}
      <RoundedBox
        ref={mesh}
        args={[1.95, 2.75, 0.045]}
        radius={0.09}
        smoothness={4}
        onClick={(e) => { e.stopPropagation(); onClick(index); }}
        onPointerEnter={(e) => { e.stopPropagation(); onHover(index); document.body.style.cursor = "pointer"; }}
        onPointerLeave={(e) => { e.stopPropagation(); onHover(-1); document.body.style.cursor = "auto"; }}
      >
        <meshStandardMaterial
          color={proj.bgColor}
          roughness={0.12}
          metalness={0.65}
          transparent
          opacity={0.6}
        />
      </RoundedBox>

      {/* Accent top line */}
      <mesh position={[0, 1.34, 0.027]}>
        <planeGeometry args={[1.55, 0.013]} />
        <meshBasicMaterial color={proj.colorHex} transparent opacity={0.95} />
      </mesh>

      {/* Subtitle */}
      <Text position={[-0.8, 0.82, 0.028]} fontSize={0.08}
        color={proj.colorHex} anchorX="left" anchorY="middle" letterSpacing={0.14}>
        {`${proj.subtitle.toUpperCase()} · ${proj.year}`}
      </Text>

      {/* Title */}
      <Text position={[-0.8, 0.46, 0.028]} fontSize={0.26}
        color="#ffffff" anchorX="left" anchorY="middle" letterSpacing={0.02} maxWidth={1.65}>
        {proj.title}
      </Text>

      {/* Tagline */}
      <Text position={[-0.8, 0.05, 0.028]} fontSize={0.088}
        color="rgba(255,255,255,0.45)" anchorX="left" anchorY="top" maxWidth={1.65} lineHeight={1.5}>
        {proj.tagline}
      </Text>

      {/* Status top-right */}
      <Text position={[0.8, 1.08, 0.028]} fontSize={0.072}
        color={proj.colorHex} anchorX="right" anchorY="middle" letterSpacing={0.16}>
        {proj.status}
      </Text>

      {/* Tech labels */}
      {proj.tech.slice(0, 3).map((t, i) => (
        <Text key={t} position={[-0.8 + i * 0.64, -0.96, 0.028]} fontSize={0.066}
          color="rgba(255,255,255,0.3)" anchorX="left" anchorY="middle" letterSpacing={0.05}>
          {t}
        </Text>
      ))}

      {/* Bottom divider */}
      <mesh position={[0, -1.16, 0.027]}>
        <planeGeometry args={[1.55, 0.007]} />
        <meshBasicMaterial color={proj.colorHex} transparent opacity={0.28} />
      </mesh>

      {/* CTA when active */}
      {active && (
        <Text position={[0.8, -1.07, 0.028]} fontSize={0.072}
          color={proj.colorHex} anchorX="right" anchorY="middle" letterSpacing={0.1}>
          {"TAP TO OPEN →"}
        </Text>
      )}

      {/* Watermark number */}
      <Text position={[0.7, 0.05, 0.021]} fontSize={0.52}
        color={proj.colorHex} anchorX="right" anchorY="middle" fillOpacity={0.045}>
        {String(index + 1).padStart(2, "0")}
      </Text>
    </group>
  );
}

// ─────────────────────────────────────────────────────────
//  HELIX SPINE TUBE
// ─────────────────────────────────────────────────────────
function HelixSpine() {
  const geo = useMemo(() => {
    const pts = [];
    const steps = PROJECTS.length * 12;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * (PROJECTS.length - 1);
      const a = t * ANGLE_STEP;
      pts.push(new THREE.Vector3(R * 0.82 * Math.sin(a), -t * Y_STEP, R * 0.82 * Math.cos(a)));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 120, 0.007, 6, false);
  }, []);

  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────
//  PARTICLES
// ─────────────────────────────────────────────────────────
function Particles() {
  const pts = useMemo(() => {
    const a = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      a[i*3]   = (Math.random()-0.5)*26;
      a[i*3+1] = (Math.random()-0.5)*26;
      a[i*3+2] = (Math.random()-0.5)*26;
    }
    return a;
  }, []);
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.012;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pts, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#ffffff" transparent opacity={0.28} sizeAttenuation />
    </points>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE — helix rotates + rises on scroll
// ─────────────────────────────────────────────────────────
function Scene({ scrollRef, activeIndex, hoveredIndex, onCardClick, onCardHover }) {
  const helixRef = useRef();

  useFrame(({ camera, clock }) => {
    const prog  = scrollRef.current;           // 0 → 1
    const N     = PROJECTS.length;
    const tCard = prog * (N - 1);              // fractional card index

    // Rotate helix Y → brings target card to front
    const targetRotY = -tCard * ANGLE_STEP;
    helixRef.current.rotation.y +=
      (targetRotY - helixRef.current.rotation.y) * 0.055;

    // Raise helix → cards "rise" into view from below
    const targetY = tCard * Y_STEP;
    helixRef.current.position.y +=
      (targetY - helixRef.current.position.y) * 0.055;

    // Gentle camera breathing
    const t = clock.elapsedTime;
    camera.position.x += (Math.sin(t * 0.17) * 0.1 - camera.position.x) * 0.04;
    camera.position.y += (Math.cos(t * 0.13) * 0.07 - camera.position.y) * 0.04;

    // Zoom in when card is active
    const targetZ = activeIndex >= 0 ? 4.1 : 6.5;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} />
      <pointLight position={[-5, 2, -5]} intensity={0.9} color="#4fc3f7" />
      <pointLight position={[5, -2, 5]}  intensity={0.7} color="#a78bfa" />
      <fog attach="fog" args={["#030308", 9, 24]} />

      <Particles />

      <group ref={helixRef}>
        <HelixSpine />
        {PROJECTS.map((proj, i) => (
          <Card3D
            key={proj.id}
            proj={proj} index={i}
            active={activeIndex === i}
            hovered={hoveredIndex === i}
            onClick={onCardClick}
            onHover={onCardHover}
          />
        ))}
      </group>
    </>
  );
}

// ─────────────────────────────────────────────────────────
//  DETAIL MODAL
// ─────────────────────────────────────────────────────────
function Modal({ proj, onClose }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.84)",
        backdropFilter: "blur(30px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, fontFamily: "'Syne', sans-serif",
      }}
    >
      <motion.div
        initial={{ y: 70, scale: 0.86, rotateX: "14deg" }}
        animate={{ y: 0, scale: 1, rotateX: "0deg" }}
        exit={{ y: 40, scale: 0.93, opacity: 0 }}
        transition={{ type: "spring", stiffness: 230, damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: `linear-gradient(145deg, ${proj.bgColor} 0%, #080808 100%)`,
          border: `1px solid rgba(${proj.accentRGB},0.22)`,
          borderRadius: 28, maxWidth: 660, width: "100%",
          maxHeight: "88vh", overflowY: "auto", position: "relative",
          boxShadow: `0 0 100px rgba(${proj.accentRGB},0.13), 0 60px 130px rgba(0,0,0,0.9)`,
        }}
      >
        {/* top accent */}
        <div style={{
          position: "absolute", top: 0, left: 48, right: 48, height: 2,
          background: `linear-gradient(90deg,transparent,${proj.colorHex},transparent)`,
        }}/>

        {/* close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 18, right: 18,
          width: 38, height: 38, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.5)", fontSize: 17,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>

        <div style={{ padding: "42px 42px 38px" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
            color: `rgba(${proj.accentRGB},.7)`, marginBottom: 10,
          }}>{proj.subtitle} · {proj.year} · {proj.role}</div>

          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(42px,7vw,70px)", lineHeight: 0.92,
            color: "#fff", letterSpacing: "0.02em", marginBottom: 6,
          }}>{proj.title}</div>

          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 20, color: proj.colorHex,
            letterSpacing: "0.04em", marginBottom: 28,
          }}>{proj.tagline}</div>

          <div style={{ height:1, marginBottom:24,
            background:`linear-gradient(90deg,rgba(${proj.accentRGB},.22),transparent)` }}/>

          <p style={{ fontSize:15, lineHeight:1.75,
            color:"rgba(255,255,255,0.58)", marginBottom:30 }}>{proj.description}</p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:24 }}>
            {[{ l:"Role",v:proj.role },{ l:"Status",v:proj.status }].map(m=>(
              <div key={m.l} style={{
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:12, padding:"13px 16px",
              }}>
                <div style={{
                  fontFamily:"'JetBrains Mono',monospace",
                  fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",
                  color:"rgba(255,255,255,0.27)",marginBottom:5,
                }}>{m.l}</div>
                <div style={{ fontSize:13,color:"#fff",fontWeight:700 }}>{m.v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom:28 }}>
            <div style={{
              fontFamily:"'JetBrains Mono',monospace",fontSize:9,
              letterSpacing:"0.22em",textTransform:"uppercase",
              color:"rgba(255,255,255,0.27)",marginBottom:10,
            }}>Tech Stack</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
              {proj.tech.map(t=>(
                <span key={t} style={{
                  background:`rgba(${proj.accentRGB},.1)`,
                  border:`1px solid rgba(${proj.accentRGB},.25)`,
                  borderRadius:100,padding:"7px 15px",
                  fontFamily:"'JetBrains Mono',monospace",
                  fontSize:11,color:proj.colorHex,
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display:"flex",gap:10 }}>
            <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{
              flex:1,padding:"13px 0",borderRadius:12,textAlign:"center",
              background:`rgba(${proj.accentRGB},.12)`,
              border:`1px solid rgba(${proj.accentRGB},.3)`,
              color:proj.colorHex,textDecoration:"none",
              fontFamily:"'JetBrains Mono',monospace",
              fontSize:11,letterSpacing:"0.13em",textTransform:"uppercase",
            }}>GitHub →</a>
            <button onClick={onClose} style={{
              padding:"13px 22px",borderRadius:12,
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.08)",
              color:"rgba(255,255,255,0.38)",cursor:"pointer",
              fontFamily:"'JetBrains Mono',monospace",
              fontSize:11,letterSpacing:"0.13em",textTransform:"uppercase",
            }}>Close</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
//  HUD
// ─────────────────────────────────────────────────────────
function HUD({ currentIndex, project }) {
  const N = PROJECTS.length;
  return (
    <>
      {/* Left info */}
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex}
          initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x:-10 }} transition={{ duration:0.35 }}
          style={{
            position:"fixed", left:36, top:"50%", transform:"translateY(-50%)",
            zIndex:200, pointerEvents:"none",
          }}
        >
          <div style={{
            fontFamily:"'JetBrains Mono',monospace",
            fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",
            color:`rgba(${project.accentRGB},.7)`,marginBottom:7,
          }}>{project.subtitle}</div>
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(26px,3vw,38px)",color:"#fff",
            lineHeight:1,letterSpacing:"0.03em",marginBottom:5,
          }}>{project.title}</div>
          <div style={{
            width:38,height:2,marginBottom:7,
            background:`linear-gradient(90deg,${project.colorHex},transparent)`,
          }}/>
          <div style={{
            fontFamily:"'Syne',sans-serif",
            fontSize:12,color:"rgba(255,255,255,0.38)",
          }}>{project.year}</div>
        </motion.div>
      </AnimatePresence>

      {/* Right counter + progress */}
      <div style={{
        position:"fixed", right:36, top:"50%", transform:"translateY(-50%)",
        zIndex:200, pointerEvents:"none",
        display:"flex", flexDirection:"column", alignItems:"center", gap:8,
      }}>
        <div style={{ width:1, height:110, background:"rgba(255,255,255,0.1)", position:"relative" }}>
          <motion.div
            animate={{ height:`${(currentIndex/(N-1))*100}%` }}
            transition={{ type:"spring", stiffness:100, damping:20 }}
            style={{ position:"absolute",top:0,left:0,right:0, background:project.colorHex }}
          />
        </div>
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:13, color:project.colorHex, letterSpacing:"0.1em",
        }}>{String(currentIndex+1).padStart(2,"0")}</div>
        <div style={{
          fontFamily:"'JetBrains Mono',monospace",
          fontSize:9, color:"rgba(255,255,255,0.2)", letterSpacing:"0.1em",
        }}>/ {String(N).padStart(2,"0")}</div>
        <motion.div
          animate={{ y:[0,7,0] }}
          transition={{ repeat:Infinity, duration:2, ease:"easeInOut" }}
          style={{
            marginTop:18,
            fontFamily:"'JetBrains Mono',monospace",
            fontSize:9, letterSpacing:"0.14em", color:"rgba(255,255,255,0.2)",
            writingMode:"vertical-rl", textTransform:"uppercase",
          }}
        >Scroll ↓</motion.div>
      </div>

      {/* Bottom dots */}
      <div style={{
        position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)",
        display:"flex", gap:9, zIndex:200, alignItems:"center",
      }}>
        {PROJECTS.map((_,i)=>(
          <motion.div key={i}
            animate={{
              width: i===currentIndex ? 26 : 6,
              background: i===currentIndex ? project.colorHex : "rgba(255,255,255,0.18)",
            }}
            transition={{ duration:0.3 }}
            style={{ height:6, borderRadius:3 }}
          />
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────
//  ROOT EXPORT
// ─────────────────────────────────────────────────────────
export default function ProjectsGallery() {
  const scrollRef   = useRef(0);  // live 0→1 progress, no re-render
  const wheelBuf    = useRef(0);  // accumulated wheel delta
  const rafRef      = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndex,  setActiveIndex]  = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [modalProj,    setModalProj]    = useState(null);

  // ── Smooth wheel accumulator → scroll progress ──────────
  useEffect(() => {
    const N = PROJECTS.length;

    const onWheel = (e) => {
      e.preventDefault();
      wheelBuf.current += e.deltaY * 0.0008;
      wheelBuf.current = Math.max(0, Math.min(1, wheelBuf.current));
    };

    const tick = () => {
      // Ease scrollRef toward wheelBuf
      scrollRef.current += (wheelBuf.current - scrollRef.current) * 0.08;
      const idx = Math.round(scrollRef.current * (N - 1));
      setCurrentIndex(Math.max(0, Math.min(N - 1, idx)));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Touch swipe
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e) => { startY = e.touches[0].clientY; };
    const onTouchMove  = (e) => {
      const dy = startY - e.touches[0].clientY;
      wheelBuf.current = Math.max(0, Math.min(1,
        wheelBuf.current + dy * 0.004));
      startY = e.touches[0].clientY;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
    };
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (modalProj) return;
      const step = 1 / (PROJECTS.length - 1);
      if (e.key === "ArrowDown" || e.key === "ArrowRight")
        wheelBuf.current = Math.min(1, wheelBuf.current + step);
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")
        wheelBuf.current = Math.max(0, wheelBuf.current - step);
      if (e.key === "Escape") { setActiveIndex(-1); setModalProj(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalProj]);

  const handleClick = useCallback((idx) => {
    const same = activeIndex === idx;
    setActiveIndex(same ? -1 : idx);
    if (!same) setModalProj(PROJECTS[idx]);
  }, [activeIndex]);

  const handleHover = useCallback((idx) => { setHoveredIndex(idx); }, []);

  const curProj = PROJECTS[currentIndex];

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#030308;overflow:hidden;color:#fff;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        ::-webkit-scrollbar{display:none;}
      `}</style>

      {/* ── WEBGL CANVAS ── */}
      <div style={{ position:"fixed", inset:0, zIndex:1 }}>
        <Canvas
          camera={{ position:[0,0,6.5], fov:58, near:0.1, far:100 }}
          gl={{ antialias:true, alpha:false, powerPreference:"high-performance" }}
          style={{ background:"#030308" }}
          onPointerMissed={() => { setActiveIndex(-1); }}
        >
          <Suspense fallback={null}>
            <Scene
              scrollRef={scrollRef}
              activeIndex={activeIndex}
              hoveredIndex={hoveredIndex}
              onCardClick={handleClick}
              onCardHover={handleHover}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── HEADER ── */}
      <div style={{
        position:"fixed",top:0,left:0,right:0,zIndex:300,
        padding:"22px 40px",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        background:"linear-gradient(to bottom,rgba(3,3,8,.88),transparent)",
        pointerEvents:"none",
      }}>
        <div style={{
          fontFamily:"'JetBrains Mono',monospace",
          fontSize:11,letterSpacing:"0.2em",color:"rgba(255,255,255,0.35)",
          display:"flex",alignItems:"center",gap:9,
        }}>
          <div style={{ width:7,height:7,background:"#00ff88",
            borderRadius:"50%",animation:"pulse 2s infinite" }}/>
          PORTFOLIO
        </div>
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:16,letterSpacing:"0.3em",color:"rgba(255,255,255,0.32)",
        }}>PROJECTS</div>
        <div style={{
          fontFamily:"'JetBrains Mono',monospace",
          fontSize:10,letterSpacing:"0.15em",color:"rgba(255,255,255,0.2)",
        }}>{PROJECTS.length} WORKS</div>
      </div>

      {/* ── HUD ── */}
      <HUD currentIndex={currentIndex} project={curProj} />

      {/* ── MODAL ── */}
      <AnimatePresence>
        {modalProj && (
          <Modal key="modal" proj={modalProj}
            onClose={() => { setModalProj(null); setActiveIndex(-1); }} />
        )}
      </AnimatePresence>
    </>
  );
}
