'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import { useBackgroundColor, useEditorStore } from '@/store/editorStore';
import { SceneExportConnector } from '@/components/export/SceneExportConnector';
import { EnvironmentSetup } from './EnvironmentSetup';
import LogoMesh from './LogoMesh';

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  );
}

// Lighting setup for metallic materials
function Lights() {
  return (
    <>
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light from the opposite side */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
      />
      
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.2} />
      
      {/* Additional spotlights for metallic reflections */}
      <spotLight
        position={[0, 10, 0]}
        intensity={0.5}
        angle={Math.PI / 6}
        penumbra={1}
        castShadow
      />
    </>
  );
}

// Main scene content
function SceneContent() {
  const showGrid = useEditorStore((state) => state.showGrid);
  
  return (
    <>
      {/* Connect Three.js scene to global export provider */}
      <SceneExportConnector />
      <Lights />
      
      {/* Environment for reflections with material system integration */}
      <EnvironmentSetup preset="studio" />
      <Environment preset="studio" />
      
      {/* Grid helper */}
      {showGrid && (
        <Grid
          infiniteGrid
          cellSize={1}
          cellThickness={0.5}
          cellColor="#666666"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#888888"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
        />
      )}
      
      {/* Contact shadows for better grounding */}
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4}
      />
      
      {/* Main logo mesh */}
      <Suspense fallback={<LoadingFallback />}>
        <LogoMesh />
      </Suspense>
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 + Math.PI / 4}
        target={[0, 0, 0]}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export interface SceneProps {
  className?: string;
}

export default function Scene({ className = '' }: SceneProps) {
  const backgroundColor = useBackgroundColor();
  
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{
          position: [5, 5, 5],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        style={{ background: backgroundColor }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}