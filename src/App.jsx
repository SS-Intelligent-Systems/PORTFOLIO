import { useState } from "react";
import { SceneProvider, useScene } from "./context/SceneContext";
import { SelectionScene } from "./components/SelectionScene";
import HackathonGallery from "./components/Sliding";
import { ProjectsPage } from "./components/ProjectsPage";
import { ProjectDetail } from "./components/ProjectDetail";
import FrameAnimation from "./components/FrameAnimation";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

export default function App() {
  const [landingComplete, setLandingComplete] = useState(false);
  const [activeView, setActiveView] = useState("selection");
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      {/* LANDING PAGE ANIMATION */}
      <FrameAnimation 
        onComplete={() => setLandingComplete(true)} 
        onReverse={() => {
          setLandingComplete(false);
          setActiveView("selection");
        }} 
        isComplete={landingComplete} 
      />
      
      {/* 3D PORTFOLIO WRAPPER */}
      <div 
        style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 10, 
          pointerEvents: landingComplete ? "auto" : "none", 
          perspective: 2000 // Creates genuine 3D depth
        }}
      >
        <AnimatePresence>
          {landingComplete && (
            <motion.div 
              key="portfolio"
              initial={{ opacity: 0, rotateX: 30, y: "100%", z: -1000 }}
              animate={{ opacity: 1, rotateX: 0, y: "0%", z: 0 }}
              exit={{ opacity: 0, rotateX: 30, y: "100%", z: -1000 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }} // Ultra-smooth cinematic spring
              style={{ width: "100%", height: "100%", transformStyle: "preserve-3d", position: "relative" }}
            >
              <SceneProvider>
                <ConstantNav
                  onContact={() => setActiveView("selection")}
                  onProjects={() => setActiveView("projects")}
                  onHackathons={() => setActiveView("hackathons")}
                  onBack={() => setActiveView("selection")}
                />
                <AnimatePresence mode="wait" initial={false}>
                  {activeView === "selection" ? (
                    <motion.div
                      key="view-selection"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <SelectionScene 
                        onOpenHackathons={() => setActiveView("hackathons")} 
                        onOpenProjects={() => setActiveView("projects")}
                      />
                    </motion.div>
                  ) : activeView === "hackathons" ? (
                    <motion.div
                      key="view-hackathons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <HackathonGallery onCompleteScroll={() => {}} />
                    </motion.div>
                  ) : activeView === "projects" ? (
                    <motion.div
                      key="view-projects"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <ProjectsPage 
                        onBack={() => setActiveView("selection")}
                        onOpenProject={(proj) => {
                          setSelectedProject(proj);
                          setActiveView("projectDetail");
                        }} 
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view-project-detail"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <ProjectDetail 
                        project={selectedProject} 
                        onBack={() => setActiveView("projects")} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </SceneProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function ConstantNav({ onContact, onProjects, onHackathons, onBack }) {
  const { deselect } = useScene();

  const handleContact = () => {
    deselect();
    onContact();
  };

  const handleBack = () => {
    deselect();
    onBack();
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        zIndex: 120,
        pointerEvents: "auto",
        background: "transparent",
      }}
    >
      <div style={{ position: "absolute", left: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", boxShadow: "0 0 8px var(--accent-green)" }} />
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: 12,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.7)",
          textTransform: "uppercase",
        }}>
          Portfolio
        </span>
      </div>

      <NavButton label="Contact Us" onClick={handleContact} />
      <NavButton label="Projects" onClick={onProjects} />
      <NavButton label="Hackathons" onClick={onHackathons} />

      <button
        type="button"
        onClick={handleBack}
        style={{
          position: "absolute",
          right: 24,
          padding: "6px 14px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.04)",
          color: "rgba(255,255,255,0.85)",
          fontFamily: "var(--font-display)",
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
      >
        Back
      </button>
    </nav>
  );
}

function NavButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        color: "rgba(255,255,255,0.55)",
        fontFamily: "var(--font-display)",
        fontSize: 11,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        cursor: "pointer",
        padding: "6px 8px",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.95)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
    >
      {label}
    </button>
  );
}

