import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, MeshReflectorMaterial, Stars } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { AVATARS } from './SceneContext'
import { AvatarWithPlatform } from './AvatarWithPlatform'
import { CameraRig } from './CameraRig'
import { useThemeColors } from './useThemeColors'

function usePlatformVideoTexture(url) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    let disposed = false
    let nextTexture = null

    const video = document.createElement('video')
    video.src = url
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.autoplay = true
    video.preload = 'auto'

    const handleCanPlay = () => {
      if (disposed) return
      nextTexture = new THREE.VideoTexture(video)
      nextTexture.colorSpace = THREE.SRGBColorSpace
      nextTexture.minFilter = THREE.LinearFilter
      nextTexture.magFilter = THREE.LinearFilter
      nextTexture.generateMipmaps = false

      setTexture(nextTexture)
      video.play().catch(() => {})
    }

    video.addEventListener('canplay', handleCanPlay, { once: true })
    video.load()

    return () => {
      disposed = true
      video.removeEventListener('canplay', handleCanPlay)
      video.pause()
      video.src = ''
      try {
        video.load()
      } catch {
        // ignore
      }
      nextTexture?.dispose?.()
    }
  }, [url])

  return texture
}

function FallbackScene({ colors }) {
  const fallbackPlatforms = useMemo(() => {
    return Object.values(AVATARS).map((avatar) => ({
      id: avatar.id,
      position: avatar.position,
      accent: avatar.side === 'left' ? colors.left : colors.right,
    }))
  }, [colors.left, colors.right])

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[0, 10, 5]} intensity={0.7} />

      {/* Stars removed to match matte background theme */}

      {fallbackPlatforms.map((p) => (
        <group key={p.id} position={p.position}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <circleGeometry args={[1.35, 64]} />
            <meshBasicMaterial color={p.accent} transparent opacity={0.12} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <capsuleGeometry args={[0.35, 1.1, 6, 12]} />
            <meshStandardMaterial color={'#111'} metalness={0.3} roughness={0.8} />
          </mesh>
        </group>
      ))}

    </>
  )
}

function AvatarSlotFallback({ avatar, colors }) {
  const accent = avatar.side === 'left' ? colors.left : colors.right
  return (
    <group position={avatar.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <circleGeometry args={[1.35, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.35, 1.1, 6, 12]} />
        <meshStandardMaterial color={'#222'} metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  )
}

function SceneContents() {
  const colors = useThemeColors()

  const platformTexture = usePlatformVideoTexture('/videos/platform.webm')

  return (
    <>
      <fog attach="fog" args={[colors.bg, 6, 18]} />

      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <hemisphereLight intensity={0.32} color={'#ffffff'} groundColor={'#040408'} />
      <directionalLight position={[0, 10, 5]} intensity={0.85} castShadow />
      <directionalLight position={[0, 2.5, 7]} intensity={0.55} />
      <pointLight position={[-3, 3.2, 4]} color={colors.left} intensity={1.85} distance={12} />
      <pointLight position={[3, 3.2, 4]} color={colors.right} intensity={1.85} distance={12} />
      <pointLight position={[0, 2, 0]} color={'#ffffff'} intensity={0.35} distance={8} />

      {/* Background */}
      {/* Background - Stars removed to match clean dark theme */}



      {/* Camera transitions */}
      <CameraRig />

      {/* Avatars */}
      {Object.values(AVATARS).map((avatar) => (
        <Suspense
          key={avatar.id}
          fallback={<AvatarSlotFallback avatar={avatar} colors={colors} />}
        >
          <AvatarWithPlatform avatar={avatar} platformTexture={platformTexture} colors={colors} />
        </Suspense>
      ))}

      {/* Reflections */}
      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>
    </>
  )
}

export function SceneCanvas() {
  const colors = useThemeColors()

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.5, 6], fov: 55, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ background: colors.bg }}
    >
      <color attach="background" args={[colors.bg]} />

      <Suspense fallback={<FallbackScene colors={colors} />}>
        <SceneContents />
      </Suspense>
    </Canvas>
  )
}
