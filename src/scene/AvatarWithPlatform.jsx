import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Text } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { useScene } from './SceneContext'

function PhotoCard({ avatar, accentColor, isSelected }) {
  const texture = useTexture(avatar.photoPath)

  useMemo(() => {
    if (!texture) return null
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.needsUpdate = true
    return null
  }, [texture])

  return (
    <group position={[0, 0.25, 0]}>
      {/* subtle backplate so the photo reads in 3D */}
      <mesh position={[0, -0.2, -0.03]} castShadow>
        <planeGeometry args={[1.45, 2.5]} />
        <meshStandardMaterial color={'#0a0a10'} metalness={0.15} roughness={0.55} />
      </mesh>

      {/* photo */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <planeGeometry args={[1.35, 1.95]} />
        <meshStandardMaterial
          map={texture}
          metalness={0}
          roughness={0.75}
          emissive={new THREE.Color(accentColor)}
          emissiveIntensity={isSelected ? 0.12 : 0.06}
        />
      </mesh>

      {/* accent rim */}
      <mesh position={[0, -0.2, -0.06]}>
        <planeGeometry args={[1.52, 2.57]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.07} depthWrite={false} />
      </mesh>

      <Text
        position={[0, -0.9, 0.01]}
        fontSize={0.22}
        color="white"
        anchorX="center"
        anchorY="top"
        fontWeight="bold"
      >
        {avatar.name.toUpperCase()}
      </Text>
      
      <Text
        position={[0, -1.18, 0.01]}
        fontSize={0.11}
        color={accentColor}
        anchorX="center"
        anchorY="top"
      >
        {avatar.title.toUpperCase()}
      </Text>
    </group>
  )
}

export function AvatarWithPlatform({ avatar, platformTexture, colors }) {
  const groupRef = useRef(null)
  const avatarRef = useRef(null)

  const { selected, transitioning, selectAvatar } = useScene()

  const isSelected = selected === avatar.id
  const otherSelected = selected && selected !== avatar.id

  const accentColor = avatar.side === 'left' ? colors.left : colors.right

  useEffect(() => {
    if (!groupRef.current) return
    const g = groupRef.current

    if (isSelected) {
      gsap.to(g.position, { x: 0, y: 0, z: 1.5, duration: 1.0, ease: 'power3.inOut', overwrite: true })
      gsap.to(g.scale, { x: 2.2, y: 2.2, z: 2.2, duration: 1.0, ease: 'power3.inOut', overwrite: true })
    } else if (otherSelected) {
      gsap.to(g.position, {
        x: avatar.side === 'left' ? -5.5 : 5.5,
        y: 0,
        z: 0,
        duration: 0.9,
        ease: 'power3.inOut',
        overwrite: true,
      })
      gsap.to(g.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.9, ease: 'power3.inOut', overwrite: true })
    } else {
      gsap.to(g.position, {
        x: avatar.position[0],
        y: avatar.position[1],
        z: avatar.position[2],
        duration: 1.0,
        ease: 'power3.inOut',
        overwrite: true,
      })
      gsap.to(g.scale, { x: 1.8, y: 1.8, z: 1.8, duration: 1.0, ease: 'power3.inOut', overwrite: true })
    }
  }, [selected, isSelected, otherSelected, avatar])

  useFrame(({ clock }) => {
    if (!avatarRef.current) return

    // Motion removed: user requested avatars to be completely static
    if (isSelected) {
      avatarRef.current.rotation.y = THREE.MathUtils.lerp(avatarRef.current.rotation.y, 0, 0.04)
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    if (transitioning) return
    if (isSelected) return
    selectAvatar(avatar.id)
  }

  return (
    <group ref={groupRef} position={avatar.position} onClick={handleClick}>
      <group ref={avatarRef} position={[0, 0, 0]}>
        <PhotoCard avatar={avatar} accentColor={accentColor} isSelected={isSelected} />
      </group>
    </group>
  )
}
