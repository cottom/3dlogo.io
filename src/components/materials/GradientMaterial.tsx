'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import type { MaterialPreset } from '@/data/materials';

// Custom gradient shader material with proper lighting
const GradientMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#ff006e'),
    uColor2: new THREE.Color('#fb5607'),
    uColor3: new THREE.Color('#ffbe0b'),
    uDirection: new THREE.Vector2(1, 1),
    uMetalness: 0.3,
    uRoughness: 0.4,
    uEmissiveIntensity: 0.1,
  },
  // Vertex shader
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader with lighting
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec2 uDirection;
    uniform float uMetalness;
    uniform float uRoughness;
    uniform float uEmissiveIntensity;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    #include <common>
    #include <lights_pars_begin>
    
    void main() {
      vec2 uv = vUv;
      
      // Create gradient based on direction
      float gradient;
      if (abs(uDirection.x) > 0.9 && abs(uDirection.y) < 0.1) {
        // Horizontal
        gradient = uv.x;
      } else if (abs(uDirection.y) > 0.9 && abs(uDirection.x) < 0.1) {
        // Vertical
        gradient = uv.y;
      } else if (length(uDirection - vec2(0.5, 0.5)) < 0.1) {
        // Radial
        vec2 center = vec2(0.5, 0.5);
        gradient = length(uv - center) * 2.0;
      } else {
        // Diagonal
        gradient = (uv.x + uv.y) * 0.5;
      }
      
      gradient = clamp(gradient, 0.0, 1.0);
      
      // Three-color gradient
      vec3 baseColor;
      if (gradient < 0.5) {
        baseColor = mix(uColor1, uColor2, gradient * 2.0);
      } else {
        baseColor = mix(uColor2, uColor3, (gradient - 0.5) * 2.0);
      }
      
      // Basic lighting
      vec3 normal = normalize(vNormal);
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
      
      // Ambient light
      vec3 ambient = baseColor * 0.3;
      
      // Directional light (simulated)
      vec3 lightDir = normalize(vec3(5.0, 5.0, 5.0));
      float diff = max(dot(normal, lightDir), 0.0);
      vec3 diffuse = baseColor * diff;
      
      // Specular/metallic reflection
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDirection, reflectDir), 0.0), 32.0);
      vec3 specular = vec3(1.0) * spec * uMetalness;
      
      // Fresnel effect
      float fresnel = pow(1.0 - dot(normal, viewDirection), 2.0);
      vec3 fresnelColor = baseColor * fresnel * uMetalness * 0.5;
      
      // Combine all lighting
      vec3 finalColor = ambient + diffuse + specular + fresnelColor;
      
      // Add emissive glow
      finalColor += baseColor * uEmissiveIntensity;
      
      gl_FragColor = vec4(finalColor, 1.0);
      
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }
  `
);

// Extend the material to make it available in JSX
extend({ GradientMaterialImpl });

// TypeScript declaration for the extended material
declare module '@react-three/fiber' {
  interface ThreeElements {
    gradientMaterialImpl: any;
  }
}

interface GradientMaterialProps {
  preset: MaterialPreset;
  children?: React.ReactNode;
}

export default function GradientMaterial({ preset, children }: GradientMaterialProps) {
  const materialRef = useRef<any>(null);

  const { color1, color2, color3, direction } = useMemo(() => {
    const colors = preset.gradientColors || ['#ff006e', '#fb5607', '#ffbe0b'];
    
    // Determine gradient direction
    const dir = preset.gradientDirection || 'diagonal';
    let directionVector = new THREE.Vector2(1, 1);
    
    switch (dir) {
      case 'horizontal':
        directionVector = new THREE.Vector2(1, 0);
        break;
      case 'vertical':
        directionVector = new THREE.Vector2(0, 1);
        break;
      case 'radial':
        directionVector = new THREE.Vector2(0.5, 0.5);
        break;
      case 'diagonal':
      default:
        directionVector = new THREE.Vector2(1, 1);
        break;
    }
    
    return {
      color1: new THREE.Color(colors[0]),
      color2: new THREE.Color(colors[1] || colors[0]),
      color3: new THREE.Color(colors[2] || colors[1] || colors[0]),
      direction: directionVector
    };
  }, [preset]);

  // Animate the material
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <gradientMaterialImpl
      ref={materialRef}
      uColor1={color1}
      uColor2={color2}
      uColor3={color3}
      uDirection={direction}
      uMetalness={preset.metalness || 0.3}
      uRoughness={preset.roughness || 0.4}
      uEmissiveIntensity={preset.emissiveIntensity || 0.1}
      side={THREE.DoubleSide}
      transparent={false}
    />
  );
}