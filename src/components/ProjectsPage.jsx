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
    id: 1, title: "ReClaim", subtitle: "Sustainability / AI", year: "2026",
    role: "Core Developer", status: "LIVE",
    tagline: "AI-driven material intelligence system that converts lab waste into verified innovation opportunities.",
    colorHex: "#071739", accentRGB: "7,23,57", bgColor: "#071739", cardText: "#FFFFFF", cardMuted: "#CDD5DB", cardAccent: "#A4B5C4",
    buttons: [{ label: "GitHub", url: "#" }, { label: "Live Demo", url: "#" }, { label: "APK", url: "#" }],
    whatItDoes: "ReClaim is an AI-powered platform that detects, evaluates, and reallocates surplus lab materials to students. It helps institutions reduce waste and enables students to access affordable materials for projects through intelligent, automated decision-making.",
    keyFeatures: ["Material Passport with defect + safety assessment", "Innovation Readiness Score (0–100)", "AI-based student–material matching", "Autonomous allocation workflows", "Lifecycle tracking with learning feedback"],
    howItWorks: ["Lab uploads material", "AI analyzes & generates passport", "System matches with student", "Material allocated & lifecycle tracked"],
    tech: ["Flutter", "FastAPI", "Supabase", "Firebase", "Computer Vision", "AI Engine"],
    highlights: ["Converts waste into structured innovation opportunities", "Introduces Material Passport + Readiness Scoring", "Autonomous decision system (not a marketplace)", "Scalable from campuses to industry (SDG 9 aligned)", "Enables measurable reuse and sustainability impact"],
    link: "https://github.com/Shravanya178/Reclaim_ECOM.git",
  },
  {
    id: 2, title: "ResQLink", subtitle: "Disaster Response", year: "2025",
    role: "Developer", status: "LIVE",
    tagline: "Saving lives when networks fail.",
    colorHex: "#4B6382", accentRGB: "75,99,130", bgColor: "#4B6382", cardText: "#FFFFFF", cardMuted: "#CDD5DB", cardAccent: "#E3C39D",
    buttons: [{ label: "GitHub", url: "#" }, { label: "Live Demo", url: "#" }, { label: "APK Download", url: "#" }],
    whatItDoes: "ResQLink is an offline-first disaster response mobile app that enables communication and coordination even when internet and cellular networks fail. It is designed for victims, volunteers, and emergency responders to share SOS alerts, detect survivors using AI, and manage rescue operations in real time.",
    keyFeatures: ["SOS Alert & Bluetooth Mesh Communication", "Emergency Beacon (Flashlight + Siren + Vibration)", "AI-based Survivor Detection (Drone & Camera)", "Situations Board for Incident Coordination", "Offline Maps with Hazard-Aware Routing"],
    howItWorks: ["User sends SOS", "System broadcasts via Bluetooth mesh", "Nearby devices relay message", "Responders view incident & take action"],
    tech: ["Flutter", "SQLite", "Bluetooth LE", "ML Kit", "TFLite / YOLO"],
    highlights: ["Fully offline-capable disaster response system", "Works without internet using peer-to-peer mesh networking", "Integrates AI detection with real-time coordination", "Multi-role system (Victim, Volunteer, Responder, Drone Operator)", "Combines communication, AI, and routing in a single platform"],
    link: "https://github.com/ShravanyaA17/ResQLink.git",
  },
  {
    id: 3, title: "Kisaan Vaani", subtitle: "AgriTech", year: "2025",
    role: "Developer", status: "LIVE",
    tagline: "Empowering farmers with voice-driven smart assistance.",
    colorHex: "#A4B5C4", accentRGB: "164,181,196", bgColor: "#A4B5C4", cardText: "#071739", cardMuted: "#4B6382", cardAccent: "#071739",
    buttons: [{ label: "GitHub", url: "#" }, { label: "Demo Video", url: "#" }],
    whatItDoes: "Kisaan Vaani is a voice-based platform that helps farmers access agricultural information, government schemes, and market prices in their local language. Designed for rural farmers with low digital literacy.",
    keyFeatures: ["Voice-based interaction (no typing required)", "Multilingual support for regional languages", "Crop advisory & weather updates", "Government scheme awareness", "Simple, accessible UI"],
    howItWorks: ["User speaks query", "Speech-to-text processes input", "Backend fetches info", "Response converted to local voice"],
    tech: ["Python", "Speech APIs", "NLP", "Text-to-Speech"],
    highlights: ["Improves accessibility for non-tech users", "Bridges information gap in rural areas", "Voice-first design for inclusivity", "High real-world social impact"],
    link: "https://github.com/ShravanyaA17/Kisaan-Vaani.git",
  },
  {
    id: 4, title: "Socio Suraag", subtitle: "Data Intelligence", year: "2025",
    role: "Developer", status: "LIVE",
    tagline: "Detecting hidden social issues through data intelligence.",
    colorHex: "#CDD5DB", accentRGB: "205,213,219", bgColor: "#CDD5DB", cardText: "#071739", cardMuted: "#4B6382", cardAccent: "#071739",
    buttons: [{ label: "GitHub", url: "#" }, { label: "Demo Video", url: "#" }],
    whatItDoes: "An advanced Open Source Intelligence (OSINT) tool designed to help law enforcement trainees identify, track, and build cases against drug trafficking networks through social media analysis, slang detection, and network mapping.",
    keyFeatures: ["Social Media Intelligence - Cross-platform profile analysis (Instagram, Telegram)",
      "Drug Slang Detection - AI-powered identification of coded language",
      "Network Analysis - Mapping connections between suspects",
      "Evidence Management - Chain of custody and dossier generation",
      "Standard Operating Procedures - BPRD-compliant workflow digitization"
    ],
    howItWorks: ["Data collected", "Processed using analytics", "Patterns detected & visualized", "Alerts generated for authorities"],
    tech: ["OSINT tools","React", "AI/NLP", "PostgreSQL", "Telegram API", "data visualization and graph network libraries"],
    highlights: ["Transforms raw data into actionable insights", "Supports proactive governance", "Scalable for multiple domains", "Strong social impact use-case"],
    link: "https://github.com/bprdshield/Socio-Suraag.git",
  },
  {
    id: 5, title: "Fixture Gen", subtitle: "Scheduling", year: "2024",
    role: "Developer", status: "LIVE",
    tagline: "Automating tournament scheduling with precision.",
    colorHex: "#A68868", accentRGB: "166,136,104", bgColor: "#A68868", cardText: "#FFFFFF", cardMuted: "#E3C39D", cardAccent: "#CDD5DB",
    buttons: [{ label: "GitHub", url: "#" }, { label: "Live Demo", url: "#" }],
    whatItDoes: "Fixture Generator is a system that automatically creates optimized match schedules for tournaments based on teams, format, and constraints. Designed for event organizers and sports coordinators.",
    keyFeatures: ["Automatic fixture generation", "Supports multiple tournament formats", "Conflict-free scheduling", "Custom constraints handling", "Instant schedule export"],
    howItWorks: ["User inputs teams & rules", "Algorithm generates schedule", "Validates conflicts", "Outputs final fixtures"],
    tech: ["JavaScript", "Python", "Algorithms", "Web Interface"],
    highlights: ["Saves manual scheduling effort", "Ensures fair and optimized fixtures", "Useful for college & sports events", "Fast and scalable solution"],
    link: "https://github.com",
  },
  {
    id: 6, title: "Interview Ace Pro", subtitle: "AI Mock Interviews", year: "2024",
    role: "Developer", status: "LIVE",
    tagline: "AI-powered mock interviews that actually prepare you.",
    colorHex: "#E3C39D", accentRGB: "227,195,157", bgColor: "#E3C39D", cardText: "#071739", cardMuted: "#A68868", cardAccent: "#071739",
    buttons: [{ label: "GitHub", url: "#" }, { label: "Live Demo", url: "#" }],
    whatItDoes: "Interview Ace Pro simulates real interview scenarios using AI, helping users practice technical and HR interviews with feedback. Designed for students and job seekers.",
    keyFeatures: ["AI-based mock interview system", "Real-time feedback on answers", "Technical + HR question sets", "Performance analysis", "Personalized improvement suggestions"],
    howItWorks: ["User selects role", "AI asks questions", "User responds", "System analyzes answers & scores"],
    tech: ["React", "Node.js", "AI/NLP APIs", "Speech Processing"],
    highlights: ["Improves interview confidence", "Provides structured preparation", "Scalable for multiple domains", "Strong placement-oriented project"],
    link: "https://github.com",
  },
  {
    id: 7, title: "Untwist", subtitle: "Education / Tech", year: "2025",
    role: "Developer", status: "LIVE",
    tagline: "Multi-Agent LLM System for Fact-Checking & Misinformation Detection",
    colorHex: "#071739", accentRGB: "7,23,57", bgColor: "#071739", cardText: "#FFFFFF", cardMuted: "#CDD5DB", cardAccent: "#E3C39D",
    buttons: [{ label: "GitHub", url: "#" }, { label: "Demo Video", url: "#" }],
    whatItDoes:"A modular, production-ready fact-checking system with 10 specialized AI agents that verify claims, detect deepfakes, assess risk, and provide bilingual (English + Hindi) explanations.",
    keyFeatures: ["Step-by-step problem breakdown", "AI-assisted explanations", "Concept simplification", "Interactive learning interface", "Multi-domain support"],
    howItWorks: ["User inputs problem", "System analyzes complexity", "Breaks into simple steps", "User learns progressively"],
    tech: ["Chrome Extension, FastAPI (async web framework), Pydantic (data validation) ,SQLAlchemy + SQLite (databas), EasyOCR (Hindi + English OCR) ,Whisper (audio transcription), DuckDuckGo Search "],
    highlights: ["Misinformation detection tool, helps improve trust reduce fake news and find trustworthy information with sources and proof", "Unique problem-solving approach"],
    link: "https://github.com/Shravanya178/Untwist.git",
  }
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
  const displayFont = "/fonts/Syne-Bold.ttf";
  const bodyFont = displayFont;

  useEffect(() => {
    if (!grp.current) return;
    grp.current.position.set(pos.x, pos.y, pos.z);
    grp.current.lookAt(0, pos.y, 0);
    grp.current.rotateY(Math.PI);
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
        <meshPhysicalMaterial
          color={proj.bgColor}
          roughness={0.15}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          opacity={1}
          transparent={false}
        />
      </RoundedBox>

      {/* Accent top line */}
      <mesh position={[0, 1.34, 0.027]}>
        <planeGeometry args={[1.55, 0.013]} />
        <meshBasicMaterial color={proj.cardAccent} transparent opacity={0.95} />
      </mesh>

      {/* Subtitle */}
      <Text font={bodyFont} position={[-0.8, 0.82, 0.028]} fontSize={0.08}
        color={proj.cardAccent} anchorX="left" anchorY="middle" letterSpacing={0.14}>
        {`${proj.subtitle.toUpperCase()} · ${proj.year}`}
      </Text>

      {/* Title */}
      <Text font={displayFont} position={[-0.8, 0.46, 0.028]} fontSize={0.26}
        color={proj.cardText} anchorX="left" anchorY="middle" letterSpacing={0.02} maxWidth={1.65}>
        {proj.title}
      </Text>

      {/* Tagline */}
      <Text font={bodyFont} position={[-0.8, 0.05, 0.028]} fontSize={0.088}
        color={proj.cardMuted} anchorX="left" anchorY="top" maxWidth={1.65} lineHeight={1.5}>
        {proj.tagline}
      </Text>

      {/* Status top-right */}
      <Text font={bodyFont} position={[0.8, 1.08, 0.028]} fontSize={0.072}
        color={proj.cardAccent} anchorX="right" anchorY="middle" letterSpacing={0.16}>
        {proj.status}
      </Text>

      {/* Tech labels */}
      {proj.tech.slice(0, 3).map((t, i) => (
        <Text key={t} font={bodyFont} position={[-0.8 + i * 0.64, -0.96, 0.028]} fontSize={0.066}
          color={proj.cardMuted} anchorX="left" anchorY="middle" letterSpacing={0.05}>
          {t}
        </Text>
      ))}

      {/* Bottom divider */}
      <mesh position={[0, -1.16, 0.027]}>
        <planeGeometry args={[1.55, 0.007]} />
        <meshBasicMaterial color={proj.cardAccent} transparent opacity={0.28} />
      </mesh>

      {/* CTA when active */}
      {active && (
        <Text font={bodyFont} position={[0.8, -1.07, 0.028]} fontSize={0.072}
          color={proj.cardAccent} anchorX="right" anchorY="middle" letterSpacing={0.1}>
          {"TAP TO OPEN →"}
        </Text>
      )}

      {/* Watermark number */}
      <Text font={displayFont} position={[0.7, 0.05, 0.021]} fontSize={0.52}
        color={proj.cardAccent} anchorX="right" anchorY="middle" fillOpacity={0.15}>
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <pointLight position={[-5, 2, -5]} intensity={1.15} color="#A4B5C4" />
      <pointLight position={[5, -2, 5]}  intensity={1.0} color="#E3C39D" />
      <fog attach="fog" args={["#000000", 7, 22]} />

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
            fontFamily:"var(--font-body)",
            fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",
            color:`rgba(${project.accentRGB},.7)`,marginBottom:7,fontWeight:700,
          }}>{project.subtitle}</div>
          <div style={{
            fontFamily:"var(--font-display)",
            fontSize:"clamp(26px,3vw,38px)",color:"#fff",
            lineHeight:1,letterSpacing:"0.03em",marginBottom:5,fontWeight:700,
          }}>{project.title}</div>
          <div style={{
            width:38,height:2,marginBottom:7,
            background:`linear-gradient(90deg,${project.colorHex},transparent)`,
          }}/>
          <div style={{
            fontFamily:"var(--font-body)",
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
          fontFamily:"var(--font-display)",
          fontSize:13, color:project.colorHex, letterSpacing:"0.1em",fontWeight:700,
        }}>{String(currentIndex+1).padStart(2,"0")}</div>
        <div style={{
          fontFamily:"var(--font-body)",
          fontSize:9, color:"rgba(255,255,255,0.2)", letterSpacing:"0.1em",
        }}>/ {String(N).padStart(2,"0")}</div>
        <motion.div
          animate={{ y:[0,7,0] }}
          transition={{ repeat:Infinity, duration:2, ease:"easeInOut" }}
          style={{
            marginTop:18,
            fontFamily:"var(--font-body)",
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

export function ProjectsPage({ onBack, onOpenProject }) {
  const scrollRef   = useRef(0);  // live 0→1 progress, no re-render
  const wheelBuf    = useRef(0);  // accumulated wheel delta
  const rafRef      = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndex,  setActiveIndex]  = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

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
      if (e.key === "Escape") { setActiveIndex(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleClick = useCallback((idx) => {
    const same = activeIndex === idx;
    setActiveIndex(same ? -1 : idx);
    if (!same && onOpenProject) {
      // Small delay to allow the 3D zoom to start before transitioning page
      setTimeout(() => {
        onOpenProject(PROJECTS[idx]);
      }, 400);
    }
  }, [activeIndex, onOpenProject]);

  const handleHover = useCallback((idx) => { setHoveredIndex(idx); }, []);

  const curProj = PROJECTS[currentIndex];

  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%)", overflow: "hidden", color: "#fff" }}>

      <div style={{
        position: "fixed",
        top: 88,
        left: 48,
        zIndex: 3,
        fontFamily: "Impact, sans-serif",
        fontSize: "clamp(28px, 5.2vw, 64px)",
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        color: "#fff",
        textShadow: "0 10px 30px rgba(0,0,0,0.8)",
        pointerEvents: "none",
      }}>
        Projects
      </div>

      {/* ── WEBGL CANVAS ── */}
      <div style={{ position:"fixed", inset:0, zIndex:1 }}>
        <Canvas
          camera={{ position:[0,0,6.5], fov:58, near:0.1, far:100 }}
          gl={{ antialias:true, alpha:true, powerPreference:"high-performance" }}
          style={{ background:"transparent" }}
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

      {/* ── HUD ── */}
      <HUD currentIndex={currentIndex} project={curProj} />
    </div>
  );
}
