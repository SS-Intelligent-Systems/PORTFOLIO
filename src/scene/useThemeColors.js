import { useEffect, useState } from 'react'

function readCssVar(name, fallback) {
  if (typeof window === 'undefined') return fallback
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export function useThemeColors() {
  const [colors, setColors] = useState(() => ({
    bg: '#1e1e1e',
    left: '#00e5ff',
    right: '#bf00ff',
  }))

  useEffect(() => {
    setColors({
      bg: readCssVar('--scene-bg', '#1e1e1e'),
      left: readCssVar('--scene-accent-left', '#00e5ff'),
      right: readCssVar('--scene-accent-right', '#bf00ff'),
    })
  }, [])

  return colors
}
