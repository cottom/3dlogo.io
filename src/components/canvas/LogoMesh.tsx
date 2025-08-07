'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useEditorStore, useSvgContent, useBevelParams, useMaterial, useAnimation, useSelectedMaterialId } from '@/store/editorStore';
import { getMaterialById } from '@/data/materials';
import { MaterialManager } from '@/lib/materials';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Default SVG content for demonstration
const DEFAULT_SVG = `
<svg version="1.1" width="264" height="122" xmlns="http://www.w3.org/2000/svg"><path d="M171.00 53.93 C 171.00 55.36,171.64 56.00,173.07 56.00 C 175.64 56.00,175.34 52.69,172.74 52.19 C 171.54 51.96,171.00 52.50,171.00 53.93 M46.50 54.17 C 45.40 54.81,44.17 55.82,43.77 56.41 C 42.33 58.54,43.03 59.02,45.36 57.50 C 48.37 55.53,51.00 56.52,51.00 59.63 C 51.00 61.23,50.16 62.42,48.53 63.17 C 45.79 64.42,46.07 66.00,49.02 66.00 C 53.18 66.00,53.98 73.24,49.96 74.51 C 47.46 75.31,46.12 74.43,44.90 71.23 C 43.99 68.84,43.80 68.77,42.28 70.30 C 40.75 71.82,40.77 72.08,42.47 73.97 C 44.50 76.21,49.83 76.70,53.11 74.94 C 56.22 73.28,57.36 69.19,55.50 66.36 C 54.65 65.06,53.18 63.98,52.23 63.95 C 50.80 63.90,50.89 63.63,52.75 62.33 C 54.98 60.77,55.66 57.58,54.23 55.33 C 53.08 53.53,48.73 52.88,46.50 54.17 M60.25 55.08 C 61.71 55.93,62.00 57.58,62.00 65.05 C 62.00 72.34,61.72 74.00,60.50 74.00 C 59.67 74.00,59.00 74.45,59.00 75.00 C 59.00 76.48,70.54 76.22,74.28 74.66 C 78.44 72.92,79.96 71.00,80.68 66.61 C 81.43 61.94,79.44 57.28,75.91 55.45 C 72.58 53.73,57.31 53.37,60.25 55.08 M85.43 55.57 C 87.64 57.78,87.70 72.80,85.50 73.64 C 81.85 75.04,84.64 76.00,92.38 76.00 L 100.75 76.00 101.38 72.84 C 102.21 68.70,101.56 68.22,99.47 71.41 C 98.19 73.35,96.92 74.00,94.39 74.00 L 91.00 74.00 91.00 65.05 C 91.00 57.58,91.29 55.93,92.75 55.08 C 94.10 54.29,93.28 54.05,89.18 54.03 C 84.34 54.00,84.00 54.14,85.43 55.57 M73.65 57.13 C 74.39 57.74,75.50 59.94,76.12 62.02 C 77.08 65.22,76.97 66.39,75.38 69.65 C 73.76 72.97,72.98 73.54,69.75 73.81 L 66.00 74.12 66.00 64.44 L 66.00 54.75 69.16 55.38 C 70.89 55.73,72.91 56.51,73.65 57.13 M107.74 60.25 C 104.95 62.36,103.80 66.85,105.05 70.65 C 107.66 78.55,118.26 77.53,120.29 69.18 C 121.03 66.12,119.25 61.20,116.96 59.98 C 114.42 58.62,109.70 58.76,107.74 60.25 M125.57 60.57 C 123.72 62.42,123.51 66.11,125.16 67.76 C 126.03 68.63,126.02 69.28,125.08 70.40 C 124.41 71.21,123.96 72.69,124.08 73.69 C 124.20 74.69,123.97 76.29,123.55 77.25 C 121.83 81.19,124.56 82.75,132.00 82.09 C 135.91 81.75,139.00 79.25,139.00 76.45 C 139.00 73.51,135.94 72.00,129.97 72.00 C 127.10 72.00,126.20 71.64,126.58 70.65 C 126.90 69.82,128.05 69.48,129.55 69.76 C 130.91 70.03,133.15 69.47,134.60 68.53 C 136.65 67.18,137.11 66.20,136.77 63.91 C 136.49 61.94,136.78 61.00,137.67 61.00 C 138.40 61.00,139.00 60.55,139.00 60.00 C 139.00 58.30,127.35 58.79,125.57 60.57 M144.17 61.31 C 141.17 64.51,141.18 71.16,144.19 73.96 C 151.65 80.91,162.29 69.73,155.93 61.63 C 153.16 58.12,147.33 57.96,144.17 61.31 M170.14 59.89 C 169.20 60.49,169.12 60.96,169.89 61.43 C 171.27 62.29,171.37 74.00,170.00 74.00 C 169.45 74.00,169.00 74.45,169.00 75.00 C 169.00 75.55,170.80 76.00,173.00 76.00 C 175.20 76.00,177.00 75.55,177.00 75.00 C 177.00 74.45,176.55 74.00,176.00 74.00 C 175.42 74.00,175.00 70.83,175.00 66.50 C 175.00 60.02,174.76 59.00,173.25 59.02 C 172.29 59.02,170.89 59.42,170.14 59.89 M182.17 61.31 C 179.17 64.51,179.18 71.16,182.19 73.96 C 189.65 80.91,200.29 69.73,193.93 61.63 C 191.16 58.12,185.33 57.96,182.17 61.31 M114.43 61.57 C 118.26 65.40,117.25 73.27,112.86 73.80 C 108.58 74.31,106.41 66.71,109.56 62.22 C 111.40 59.59,112.32 59.47,114.43 61.57 M132.88 62.21 C 134.13 65.59,133.09 68.16,130.62 67.80 C 127.17 67.31,127.06 60.00,130.50 60.00 C 131.36 60.00,132.43 61.00,132.88 62.21 M153.03 63.05 C 155.26 67.23,153.44 74.00,150.09 74.00 C 147.29 74.00,145.73 71.42,145.73 66.82 C 145.73 60.58,150.41 58.16,153.03 63.05 M191.03 63.05 C 193.26 67.23,191.44 74.00,188.09 74.00 C 185.29 74.00,183.73 71.42,183.73 66.82 C 183.73 60.58,188.41 58.16,191.03 63.05 M161.29 72.11 C 159.71 73.69,160.82 76.00,163.18 76.00 C 164.62 76.00,165.06 75.43,164.82 73.83 C 164.44 71.27,162.89 70.51,161.29 72.11 M136.00 77.98 C 136.00 80.28,132.34 81.55,128.50 80.59 C 126.89 80.18,126.00 79.26,126.00 77.98 C 126.00 76.27,126.68 76.00,131.00 76.00 C 135.32 76.00,136.00 76.27,136.00 77.98 " stroke="none" fill="black" fill-rule="evenodd"/></svg>
`;

interface LogoMeshProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

function normalizeSVGSize(svgData: any): void {
  // Calculate the bounding box of the SVG
  const svgBoundingBox = new THREE.Box3();
  
  svgData.paths.forEach((path: any) => {
    path.subPaths.forEach((subPath: any) => {
      subPath.getPoints().forEach((point: THREE.Vector2) => {
        svgBoundingBox.expandByPoint(new THREE.Vector3(point.x, point.y, 0));
      });
    });
  });
  
  // Get the size and center of the SVG
  const svgSize = new THREE.Vector3();
  svgBoundingBox.getSize(svgSize);
  const svgCenter = new THREE.Vector3();
  svgBoundingBox.getCenter(svgCenter);
  
  // Target size for consistent scaling (200 units)
  const targetSize = 200;
  const svgMaxDimension = Math.max(svgSize.x, svgSize.y);
  const scaleFactor = targetSize / svgMaxDimension;
  
  // Scale and center all paths
  svgData.paths.forEach((path: any) => {
    path.subPaths.forEach((subPath: any) => {
      subPath.curves.forEach((curve: any) => {
        // Scale and center curve points
        if (curve.v0) {
          curve.v0.x = (curve.v0.x - svgCenter.x) * scaleFactor;
          curve.v0.y = (curve.v0.y - svgCenter.y) * scaleFactor;
        }
        if (curve.v1) {
          curve.v1.x = (curve.v1.x - svgCenter.x) * scaleFactor;
          curve.v1.y = (curve.v1.y - svgCenter.y) * scaleFactor;
        }
        if (curve.v2) {
          curve.v2.x = (curve.v2.x - svgCenter.x) * scaleFactor;
          curve.v2.y = (curve.v2.y - svgCenter.y) * scaleFactor;
        }
        if (curve.v3) {
          curve.v3.x = (curve.v3.x - svgCenter.x) * scaleFactor;
          curve.v3.y = (curve.v3.y - svgCenter.y) * scaleFactor;
        }
      });
    });
  });
}

function createGeometryFromSVG(svgData: any, bevelParams: any): THREE.BufferGeometry | null {
  const geometries: THREE.ExtrudeGeometry[] = [];
  
  // Calculate a scale factor based on the SVG's size
  const svgBoundingBox = new THREE.Box3();
  svgData.paths.forEach((path: any) => {
    path.subPaths.forEach((subPath: any) => {
      subPath.getPoints().forEach((point: THREE.Vector2) => {
        svgBoundingBox.expandByPoint(new THREE.Vector3(point.x, point.y, 0));
      });
    });
  });
  
  const svgSize = new THREE.Vector3();
  svgBoundingBox.getSize(svgSize);
  const svgMaxDimension = Math.max(svgSize.x, svgSize.y);
  
  // Calculate the UV scale factor based on SVG size
  const uvScaleFactor = 0.02 * (200 / svgMaxDimension);
  
  // Adjust bevel parameters based on SVG size
  const scaledBevelSize = bevelParams.bevelSize * (svgMaxDimension / 200);
  
  // Loop through all of the parsed paths
  svgData.paths.forEach((path: any) => {
    const shapes = SVGLoader.createShapes(path);
    
    // Each path has array of shapes
    shapes.forEach((shape: THREE.Shape) => {
      // Finally we can take each shape and extrude it
      const geometry = new THREE.ExtrudeGeometry(shape, {
        bevelEnabled: bevelParams.bevelEnabled,
        bevelThickness: 1,
        bevelSize: scaledBevelSize,
        bevelSegments: bevelParams.bevelSegments,
        steps: 3,
        depth: bevelParams.extrusionDepth,
      });

      // Scale UVs proportionally to the final geometry scaling
      const uvAttribute = geometry.attributes.uv;
      if (uvAttribute) {
        for (let i = 0; i < uvAttribute.count; i++) {
          uvAttribute.setXY(
            i, 
            uvAttribute.getX(i) * uvScaleFactor, 
            uvAttribute.getY(i) * uvScaleFactor
          );
        }
      }

      geometries.push(geometry);
    });
  });

  if (geometries.length === 0) {
    return null;
  }

  // Merge all the Extrude geometries into buffer geometry
  let mergedGeometry = mergeGeometries(geometries);
  
  if (!mergedGeometry) {
    return null;
  }

  mergedGeometry.deleteAttribute("normal");
  mergedGeometry = mergeVertices(mergedGeometry);
  mergedGeometry.computeVertexNormals();
  mergedGeometry.computeTangents();

  // Get group's size and center the geometry
  const box = new THREE.Box3().setFromBufferAttribute(mergedGeometry.attributes.position as THREE.BufferAttribute);
  const center = box.getCenter(new THREE.Vector3());
  mergedGeometry.translate(-center.x, -center.y, -center.z);

  return mergedGeometry;
}

export default function LogoMesh({ 
  position = [0, 0, 0], 
  rotation = [Math.PI, 0, 0], 
  scale = [0.1, 0.1, 0.1] 
}: LogoMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const svgContent = useSvgContent();
  const bevelParams = useBevelParams();
  const material = useMaterial();
  const animation = useAnimation();
  const selectedMaterialId = useSelectedMaterialId();

  // Create the geometry from SVG data
  const geometry = useMemo(() => {
    const svgToUse = svgContent || DEFAULT_SVG;
    
    try {
      const loader = new SVGLoader();
      const svgData = loader.parse(svgToUse);
      
      // Normalize SVG size immediately after parsing
      normalizeSVGSize(svgData);
      
      return createGeometryFromSVG(svgData, bevelParams);
    } catch (error) {
      console.error('Error parsing SVG:', error);
      
      // Fallback to a simple box geometry
      const boxGeometry = new THREE.BoxGeometry(2, 1, 0.5);
      return boxGeometry;
    }
  }, [svgContent, bevelParams]);

  // Create material based on store settings and selected material preset
  const meshMaterial = useMemo(() => {
    const manager = MaterialManager.getInstance();
    
    // If we have a selected material preset, use it to create an advanced material
    if (selectedMaterialId) {
      const preset = getMaterialById(selectedMaterialId);
      if (preset) {
        return manager.createMaterial(preset);
      }
    }

    // Fallback to custom material from store settings
    return manager.createCustomMaterial({
      color: new THREE.Color(material.color),
      metalness: material.metalness,
      roughness: material.roughness,
      emissive: new THREE.Color(material.emissive),
      emissiveIntensity: material.emissiveIntensity,
      side: THREE.DoubleSide,
    });
  }, [material, selectedMaterialId]);

  // Animation frame loop
  useFrame((state, delta) => {
    if (!meshRef.current || !animation.enabled) return;

    const mesh = meshRef.current;
    const time = state.clock.getElapsedTime();

    switch (animation.type) {
      case 'rotate':
        mesh.rotation.y += delta * animation.speed;
        break;
      case 'bounce':
        mesh.position.y = Math.sin(time * animation.speed * 2) * 0.5;
        break;
      case 'float':
        mesh.position.y = Math.sin(time * animation.speed) * 0.2;
        mesh.rotation.y = Math.sin(time * animation.speed * 0.5) * 0.1;
        break;
      case 'pulse': {
        const scale = 1 + Math.sin(time * animation.speed * 3) * 0.1;
        mesh.scale.setScalar(scale * 0.1);
        break;
      }
    }
  });

  if (!geometry) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      geometry={geometry}
      material={meshMaterial}
      castShadow
      receiveShadow
      name="LogoMesh"
    />
  );
}