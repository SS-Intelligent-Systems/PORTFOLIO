import { createContext, useCallback, useContext, useState } from 'react'

const SceneContext = createContext(null)

export const AVATARS = {
  male: {
    id: 'male',
    photoPath: '/photos/sanket%20patil.png',
    position: [-2.5, 0, 0],
    name: 'Sanket Patil',
    title: 'Software Developer',
    side: 'left',
    data: {
      strengths: ['Frontend engineering', 'Clean UI implementation', 'Performance mindset'],
      weaknesses: ['Can over-polish details', 'Sometimes take on too much at once'],
      experience: ['React apps', 'API integration', 'UI systems and tooling'],
      achievements: ['Shipped multiple production features', 'Improved UX consistency across pages'],
      education: ['Computer Science background'],
      skills: ['React', 'JavaScript', 'CSS', 'GSAP', 'Three.js'],
    },
  },
  female: {
    id: 'female',
    photoPath: '/photos/shravanya%20andhale.png',
    position: [2.5, 0, 0],
    name: 'Shravana Handley',
    title: 'AI Automation Engineer',
    side: 'right',
    data: {
      strengths: ['Automation mindset', 'Experimentation and iteration', 'Problem decomposition'],
      weaknesses: ['Deep legacy migrations', 'Hardware-level tuning'],
      experience: ['AI workflow automation', 'Integrations', 'Prototyping'],
      achievements: ['Built automations that save time', 'Improved reliability with monitoring'],
      education: ['Engineering background'],
      skills: ['Python', 'APIs', 'LLMs', 'Automation', 'Data workflows'],
    },
  },
}

export function SceneProvider({ children }) {
  const [selected, setSelected] = useState(null)
  const [transitioning, setTransitioning] = useState(false)

  const selectAvatar = useCallback(
    (id) => {
      if (transitioning) return
      setTransitioning(true)
      setSelected(id)
      window.setTimeout(() => setTransitioning(false), 1200)
    },
    [transitioning],
  )

  const deselect = useCallback(() => {
    if (transitioning) return
    setTransitioning(true)
    setSelected(null)
    window.setTimeout(() => setTransitioning(false), 1200)
  }, [transitioning])

  return (
    <SceneContext.Provider value={{ selected, transitioning, selectAvatar, deselect }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene() {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used within SceneProvider')
  return ctx
}
