import { createContext, useContext, useState, useCallback } from "react";

const SceneContext = createContext(null);

export const AVATARS = {
  sanket: {
    id: "sanket",
    photo: "/photos/sanket patil.png",
    name: "Sanket Patil",
    title: "Software Developer",
    side: "left",
    accent: "#00e5ff",
    accentDim: "rgba(0,229,255,0.12)",
    data: {
      about:        "B.E. IT student focused on full-stack development, AI/ML, and automation-driven applications.",
      strengths:    ["Full-Stack Development", "AI/ML Integration", "Automation Workflows", "Team Leadership"],
      weaknesses:   [""],
      experience:   ["Software Intern — Palcoa Solutions (Dec 2024–Apr 2025)", "Software Intern — Zemo Sports Reconnect (May 2025–Aug 2025)"],
      achievements: ["Winner — Nexothon 2025 (GCET Gujarat)", "2nd Place — HackCelestial 2.0", "4th Place — Craftverse 2025", "Finalist — HackOrbit 2025"],
      education:    ["B.E. Information Technology — VESIT, Mumbai", "HSC (Science) — K.J. Somaiya College", "SSC — Vani Vidyalaya"],
      skills:       ["Python", "Java", "JavaScript", "MERN Stack", "Flutter", "Machine Learning", "OpenCV", "n8n"],
    },
  },
  shravanya: {
    id: "shravanya",
    photo: "/photos/shravanya andhale.png",
    name: "Shravanya Andhale",
    title: "AI Automation Engineer",
    side: "right",
    accent: "#d400ff",
    accentDim: "rgba(212,0,255,0.12)",
    data: {
      about:        "IT engineering student working on full-stack apps, AI integration, and automation projects.",
      strengths:    ["Web Development", "Full-Stack Development", "Database Management", "AI Integration"],
      weaknesses:   [""],
      experience:   ["AI Intern — Sports analytics ML models", "Technical/Teaching — QuestIT VESIT (Mar 2025–Present)", "Web Dev Intern — Salon management site (Apr 2025–Oct 2025)"],
      achievements: ["Winner — Nexothon 2025", "Second Place — Hackcelestial 2.0", "Finalist — HackOrbit 2025", "Top 10 — Dev with AI"],
      education:    ["B.E. IT — VESIT (2023–2027)", "HSC — 93.6%"],
      skills:       ["Python", "Java", "JavaScript", "MERN Stack", "React", "Firebase", "Docker", "Supabase"],
    },
  },
};

export function SceneProvider({ children }) {
  const [selected, setSelected] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const select = useCallback((id) => {
    if (isAnimating || selected === id) return;
    setIsAnimating(true);
    setSelected(id);
    setTimeout(() => setIsAnimating(false), 900);
  }, [isAnimating, selected]);

  const deselect = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelected(null);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  return (
    <SceneContext.Provider value={{ selected, isAnimating, select, deselect }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  return useContext(SceneContext);
}
