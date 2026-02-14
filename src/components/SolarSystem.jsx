import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Text } from '@react-three/drei'

// Planet component with orbit
function Planet({ name, nickname, position, radius, color, speed, orbitRadius, emissive = false, scale = 1, onClick }) {
  const planetRef = useRef()
  const orbitRef = useRef()
  const textGroupRef = useRef()
  const { size } = useThree()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Circular orbit in XZ plane (top-down view)
    const angle = time * speed
    const x = Math.cos(angle) * orbitRadius
    const z = Math.sin(angle) * orbitRadius
    
    if (planetRef.current) {
      planetRef.current.position.set(x, position[1], z)
    }
    
    // Update text group position to follow planet
    if (textGroupRef.current) {
      textGroupRef.current.position.set(x, position[1], z)
    }
    
    // Rotate planet on its axis
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01
    }
  })

  // Responsive font size based on screen width
  const fontSize = Math.max(0.1, Math.min(0.3, size.width / 50))
  const nicknameFontSize = Math.max(0.08, Math.min(0.25, size.width / 60))

  return (
    <group ref={orbitRef} scale={scale}>
      {/* Orbit path visualization */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.1, orbitRadius + 0.1, 64]} />
        <meshBasicMaterial color={color} opacity={0.2} transparent />
      </mesh>
      
      {/* Planet */}
      <mesh ref={planetRef} position={position} onClick={onClick}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={emissive ? color : '#000000'}
          emissiveIntensity={emissive ? 0.5 : 0}
        />
      </mesh>
      
      {/* Text group that follows planet */}
      <group ref={textGroupRef} position={position}>
        {/* Planet nickname - above the name */}
        {nickname && (
          <Text
            position={[0, radius + 0.9, 0]}
            fontSize={nicknameFontSize}
            color={color}
            anchorX="center"
            anchorY="middle"
            opacity={0.9}
          >
            {nickname}
          </Text>
        )}
        
        {/* Planet label - will follow planet position */}
        <Text
          position={[0, radius + 0.5, 0]}
          fontSize={fontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </group>
    </group>
  )
}

// Sun component
function Sun({ scale = 1 }) {
  const sunRef = useRef()
  const { size } = useThree()

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.005
    }
  })

  // Responsive font size based on screen width
  const fontSize = Math.max(0.15, Math.min(0.4, size.width / 40))

  return (
    <group scale={scale}>
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFA500"
          emissiveIntensity={1}
        />
      </mesh>
      
      {/* Sun glow effect */}
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial 
          color="#FFD700" 
          opacity={0.3} 
          transparent 
        />
      </mesh>
      
      <Text
        position={[0, 2.5, 0]}
        fontSize={fontSize}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
      >
        Sun
      </Text>
    </group>
  )
}

export default function SolarSystem({ viewport: viewportProp, onEarthClick }) {
  const { size, camera } = useThree()
  
  // Use actual screen dimensions
  const screenWidth = viewportProp?.width || size.width
  const screenHeight = viewportProp?.height || size.height
  
  // Calculate scale factor based on display size
  // Use the smaller dimension to ensure it fits, scale proportionally
  const viewportSize = Math.min(screenWidth, screenHeight)
  
  // Scale factor: larger displays get proportionally larger solar system
  // Base scale on viewport size, with reasonable min/max bounds
  const baseScale = viewportSize / 800 // 800px = scale 1.0
  // More aggressive scaling for mobile devices
  const scaleFactor = Math.max(0.4, Math.min(2.0, baseScale))
  
  // Adjust orbit controls based on display size
  const minDistance = Math.max(3, 6 * scaleFactor)
  const maxDistance = Math.max(30, 60 * scaleFactor)
  
  // Ensure camera is properly positioned and looking at center on mount
  useEffect(() => {
    if (camera) {
      // Keep Y position but center X and Z
      camera.position.x = 0
      camera.position.z = 0
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }
  }, [camera])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#FFD700" />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {/* Stars background - responsive count */}
      <Stars 
        radius={100} 
        depth={50} 
        count={Math.min(5000, screenWidth * 5)} 
        factor={4} 
        fade 
        speed={1} 
      />
      
      {/* Sun at center */}
      <Sun scale={scaleFactor} />
      
      {/* Planets with their orbits - each in its own group */}
      <group name="mercury-group" className="mercury-group">
        <Planet 
          name="Mercury" 
          position={[0, 0, 0]} 
          radius={0.15} 
          color="#8C7853" 
          speed={0.1} 
          orbitRadius={3}
          scale={scaleFactor}
        />
      </group>
      
      <group name="venus-group" className="venus-group">
        <Planet 
          name="Venus" 
          position={[0, 0, 0]} 
          radius={0.1} 
          color="#FFC649" 
          speed={0.2} 
          orbitRadius={4.5}
          scale={scaleFactor}
        />
      </group>
      
      <group name="earth-group" className="earth-group">
        <Planet 
          name="Earth" 
          nickname="ENTER"
          position={[0, 0, 0]} 
          radius={0.25} 
          color="#6B93D6" 
          speed={0.2} 
          orbitRadius={6}
          scale={scaleFactor}
          onClick={onEarthClick}
        />
      </group>
      
      <group name="mars-group" className="mars-group">
        <Planet 
          name="Mars" 
          position={[0, 0, 0]} 
          radius={0.2} 
          color="#C1440E" 
          speed={0.3} 
          orbitRadius={7.5}
          scale={scaleFactor}
        />
      </group>
      
      <group name="jupiter-group" className="jupiter-group">
        <Planet 
          name="Jupiter" 
          position={[0, 0, 0]} 
          radius={0.6} 
          color="#D8CA9D" 
          speed={0.3} 
          orbitRadius={10}
          scale={scaleFactor}
        />
      </group>
      
      <group name="saturn-group" className="saturn-group">
        <Planet 
          name="Saturn" 
          position={[0, 0, 0]} 
          radius={0.5} 
          color="#FAD5A5" 
          speed={0.28} 
          orbitRadius={12.5}
          scale={scaleFactor}
        />
      </group>
      
      <group name="uranus-group" className="uranus-group">
        <Planet 
          name="Uranus" 
          position={[0, 0, 0]} 
          radius={0.35} 
          color="#4FD0E7" 
          speed={0.28} 
          orbitRadius={15}
          scale={scaleFactor}
        />
      </group>
      
      <group name="neptune-group" className="neptune-group">
        <Planet 
          name="Neptune" 
          position={[0, 0, 0]} 
          radius={0.35} 
          color="#4B70DD" 
          speed={0.29} 
          orbitRadius={17.5}
          scale={scaleFactor}
        />
      </group>
      
      {/* Camera controls - top-down view, centered */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={minDistance}
        maxDistance={maxDistance}
        autoRotate={false}
        target={[0, 0, 0]} // Center the target at origin
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  )
}

