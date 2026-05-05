import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function HelixStrand({ phase = 0, color = '#00e5ff' }) {
  const pointsRef = useRef(null)
  const SEGMENTS = 40
  const HEIGHT = 2.4
  const RADIUS = 0.18

  const positions = useMemo(() => {
    const arr = new Float32Array(SEGMENTS * 3)
    for (let i = 0; i < SEGMENTS; i += 1) {
      const t = i / (SEGMENTS - 1)
      const angle = t * Math.PI * 4 + phase
      arr[i * 3 + 0] = Math.cos(angle) * RADIUS
      arr[i * 3 + 1] = t * HEIGHT - HEIGHT / 2
      arr[i * 3 + 2] = Math.sin(angle) * RADIUS
    }
    return arr
  }, [phase])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const time = clock.getElapsedTime()
    const pos = pointsRef.current.geometry.attributes.position
    for (let i = 0; i < SEGMENTS; i += 1) {
      const u = i / (SEGMENTS - 1)
      const angle = u * Math.PI * 4 + phase + time * 0.6
      pos.setXYZ(i, Math.cos(angle) * RADIUS, u * HEIGHT - HEIGHT / 2, Math.sin(angle) * RADIUS)
    }
    pos.needsUpdate = true
  })

  return (
    <line ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={SEGMENTS} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  )
}

function HelixRungsAndNodes({ color1 = '#00e5ff', color2 = '#bf00ff' }) {
  const RUNGS = 10
  const HEIGHT = 2.4
  const RADIUS = 0.18

  const rungData = useMemo(() => {
    return Array.from({ length: RUNGS }, (_, i) => {
      const t = i / (RUNGS - 1)
      return { y: t * HEIGHT - HEIGHT / 2, t }
    })
  }, [])

  return (
    <group>
      {rungData.map((r, i) => {
        const angle = r.t * Math.PI * 4
        const x1 = Math.cos(angle) * RADIUS
        const z1 = Math.sin(angle) * RADIUS
        const x2 = Math.cos(angle + Math.PI) * RADIUS
        const z2 = Math.sin(angle + Math.PI) * RADIUS

        const pts = new Float32Array([x1, 0, z1, x2, 0, z2])
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(pts, 3))

        return (
          <group key={i} position={[0, r.y, 0]}>
            <line geometry={geo}>
              <lineBasicMaterial color={i % 2 === 0 ? color1 : color2} transparent opacity={0.5} />
            </line>
            <mesh position={[x1, 0, z1]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshBasicMaterial color={color1} />
            </mesh>
            <mesh position={[x2, 0, z2]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshBasicMaterial color={color2} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export function DNAHelix({ position = [0, 0, 0], colorLeft = '#00e5ff', colorRight = '#bf00ff' }) {
  const groupRef = useRef(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.25
  })

  return (
    <group ref={groupRef} position={position}>
      <HelixStrand phase={0} color={colorLeft} />
      <HelixStrand phase={Math.PI} color={colorRight} />
      <HelixRungsAndNodes color1={colorLeft} color2={colorRight} />
    </group>
  )
}
