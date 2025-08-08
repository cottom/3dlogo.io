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
<svg id="svg" version="1.1" width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><path d="M263.985 309.880 C 262.068 310.914,241.825 322.528,219.000 335.688 C 196.175 348.848,165.420 366.564,150.655 375.058 C 131.204 386.246,123.422 391.244,122.405 393.200 C 120.242 397.357,120.318 550.581,122.483 553.673 C 123.299 554.837,126.561 557.246,129.733 559.026 C 132.905 560.806,154.850 573.615,178.500 587.490 C 276.450 644.959,269.218 641.364,277.412 636.646 C 372.223 582.061,416.858 555.608,417.859 553.410 C 418.683 551.602,419.000 529.146,419.000 472.675 C 419.000 404.779,418.802 394.162,417.501 392.305 C 416.677 391.128,411.389 387.502,405.751 384.248 C 277.933 310.475,273.523 308.000,269.895 308.000 C 268.562 308.000,265.902 308.846,263.985 309.880 M292.849 337.323 C 304.757 344.100,331.375 359.349,352.000 371.208 C 372.625 383.067,390.960 393.609,392.744 394.635 C 394.528 395.661,395.990 396.743,395.994 397.039 C 395.997 397.336,390.488 400.742,383.750 404.609 C 377.012 408.476,349.822 424.089,323.327 439.306 C 296.833 454.522,274.107 467.450,272.825 468.034 C 270.776 468.967,267.728 467.521,247.498 456.018 C 174.278 414.382,145.163 397.440,145.792 396.836 C 146.181 396.462,163.600 386.276,184.500 374.201 C 205.400 362.126,233.075 346.136,246.000 338.669 C 258.925 331.201,269.882 325.071,270.349 325.046 C 270.816 325.021,280.941 330.545,292.849 337.323 M160.741 424.149 C 173.258 431.382,198.125 445.728,216.000 456.030 C 233.875 466.332,251.762 476.654,255.750 478.967 L 263.000 483.173 263.000 551.053 L 263.000 618.933 251.750 612.348 C 245.563 608.726,222.500 595.303,200.500 582.518 C 178.500 569.733,155.220 556.174,148.767 552.386 L 137.033 545.500 137.017 478.250 C 137.008 441.262,137.221 411.000,137.491 411.000 C 137.761 411.000,148.223 416.917,160.741 424.149 M404.000 478.337 L 404.000 545.674 341.574 581.837 C 307.240 601.727,278.887 618.000,278.567 618.000 C 278.248 618.000,278.102 587.542,278.243 550.315 L 278.500 482.631 284.500 479.099 C 302.861 468.291,402.618 411.154,403.250 411.084 C 403.663 411.038,404.000 441.302,404.000 478.337 M567.000 469.604 L 567.000 486.207 563.521 483.153 C 554.957 475.633,536.119 478.422,528.564 488.327 C 521.626 497.423,519.646 509.998,523.423 520.968 C 527.527 532.888,540.119 540.990,552.547 539.707 C 558.206 539.123,565.766 535.773,566.656 533.455 C 567.616 530.952,569.000 531.864,569.000 535.000 L 569.000 538.000 575.500 538.000 L 582.000 538.000 582.000 495.500 L 582.000 453.000 574.500 453.000 L 567.000 453.000 567.000 469.604 M593.000 495.500 L 593.000 538.000 600.500 538.000 L 608.000 538.000 608.000 495.500 L 608.000 453.000 600.500 453.000 L 593.000 453.000 593.000 495.500 M848.888 455.459 C 840.801 459.980,843.959 472.000,853.234 472.000 C 864.235 472.000,865.321 456.414,854.452 454.515 C 852.780 454.223,850.367 454.632,848.888 455.459 M481.903 457.992 C 471.115 459.866,463.106 467.307,459.562 478.750 C 458.883 480.943,459.050 480.999,466.183 480.978 C 473.438 480.957,473.513 480.930,475.000 477.738 C 476.976 473.498,482.358 469.999,486.898 470.004 C 494.958 470.012,501.264 477.641,498.966 484.603 C 497.617 488.691,493.931 490.866,486.946 491.693 L 482.000 492.279 482.000 498.139 L 482.000 504.000 486.032 504.000 C 494.356 504.000,500.000 508.371,500.000 514.818 C 500.000 527.738,480.563 531.725,474.523 520.044 C 472.982 517.064,472.792 517.000,465.474 517.000 C 460.998 517.000,458.000 517.414,458.000 518.033 C 458.000 520.291,463.010 528.681,466.161 531.699 C 471.833 537.132,478.328 539.489,487.500 539.443 C 500.118 539.378,509.112 534.250,513.633 524.541 C 516.457 518.476,516.604 512.927,514.087 507.384 C 512.288 503.422,506.550 498.000,504.156 498.000 C 503.520 498.000,503.000 497.550,503.000 497.000 C 503.000 496.450,503.520 496.000,504.156 496.000 C 506.750 496.000,511.916 490.786,513.543 486.525 C 519.800 470.142,502.381 454.434,481.903 457.992 M636.994 479.887 C 631.793 481.568,628.122 484.071,623.788 488.891 C 610.232 503.968,615.125 528.044,633.577 537.059 C 637.526 538.989,640.082 539.464,646.500 539.464 C 655.801 539.464,661.950 537.050,667.965 531.035 C 673.893 525.107,676.362 518.824,676.427 509.500 C 676.492 500.269,674.470 494.740,668.692 488.345 C 663.151 482.211,656.972 479.576,647.500 479.305 C 643.100 479.179,638.372 479.441,636.994 479.887 M701.385 480.617 C 695.374 482.749,689.514 488.253,686.311 494.776 C 683.941 499.602,683.500 501.755,683.500 508.500 C 683.500 515.245,683.941 517.398,686.311 522.224 C 689.610 528.943,695.410 534.270,701.795 536.446 C 711.254 539.669,722.062 537.491,726.960 531.376 L 729.263 528.500 728.737 535.370 C 728.140 543.174,726.248 546.536,720.929 549.248 C 714.333 552.612,701.248 550.638,697.128 545.658 C 696.373 544.746,695.374 544.000,694.908 544.000 C 694.165 544.000,687.000 554.376,687.000 555.451 C 687.000 556.560,693.658 560.382,698.638 562.133 C 702.528 563.500,706.846 564.100,712.800 564.100 C 720.497 564.100,722.032 563.765,727.933 560.800 C 735.039 557.229,739.981 551.812,742.142 545.225 C 742.957 542.738,743.491 531.283,743.747 510.750 L 744.130 480.000 738.110 480.000 L 732.091 480.000 731.434 483.500 C 730.850 486.615,729.000 488.530,729.000 486.020 C 729.000 485.481,726.638 483.686,723.750 482.030 C 719.329 479.494,717.473 479.030,712.000 479.088 C 708.425 479.127,703.648 479.815,701.385 480.617 M770.000 481.077 C 764.171 483.710,758.502 489.226,755.178 495.500 C 752.908 499.784,752.530 501.718,752.539 509.000 C 752.547 515.965,752.989 518.395,754.982 522.458 C 758.077 528.763,763.307 533.996,769.577 537.059 C 776.533 540.457,788.356 540.423,795.458 536.985 C 801.733 533.947,806.976 528.724,810.077 522.423 C 813.707 515.047,813.543 503.624,809.694 495.786 C 806.337 488.949,799.637 482.746,793.266 480.575 C 786.637 478.316,775.584 478.554,770.000 481.077 M886.398 481.395 C 875.924 486.272,869.797 495.563,869.183 507.500 C 868.523 520.334,874.739 531.269,885.776 536.689 C 890.559 539.038,892.733 539.491,899.000 539.444 C 908.113 539.377,914.552 536.811,920.692 530.801 C 933.024 518.730,932.407 497.570,919.389 486.111 C 913.691 481.096,907.540 478.997,898.572 479.010 C 893.240 479.017,890.244 479.604,886.398 481.395 M846.000 509.000 L 846.000 538.000 853.500 538.000 L 861.000 538.000 861.000 509.000 L 861.000 480.000 853.500 480.000 L 846.000 480.000 846.000 509.000 M560.763 494.672 C 565.507 498.214,567.347 501.656,567.793 507.815 C 568.497 517.554,563.333 525.092,554.991 526.501 C 543.648 528.418,534.002 516.992,536.980 505.167 C 539.275 496.051,544.893 491.637,553.324 492.326 C 556.004 492.545,559.311 493.588,560.763 494.672 M654.802 494.702 C 659.503 498.211,661.350 501.669,661.764 507.737 C 662.700 521.438,650.443 530.277,639.009 524.145 C 630.309 519.479,628.298 504.765,635.317 497.123 C 640.196 491.809,649.397 490.666,654.802 494.702 M722.048 494.253 C 726.977 497.575,729.143 501.941,729.143 508.558 C 729.143 516.071,725.926 521.099,719.563 523.529 C 711.259 526.700,704.392 524.011,700.185 515.941 C 694.445 504.932,701.907 492.000,714.000 492.000 C 717.225 492.000,719.756 492.709,722.048 494.253 M790.864 494.734 C 800.492 501.871,799.984 518.685,789.975 524.206 C 784.767 527.079,776.944 526.261,772.855 522.416 C 765.624 515.617,765.148 504.110,771.788 496.650 C 776.112 491.792,785.609 490.838,790.864 494.734 M907.824 494.669 C 909.296 495.740,911.542 498.616,912.815 501.059 C 920.394 515.596,905.967 531.586,891.984 524.146 C 881.316 518.469,881.457 499.095,892.207 493.612 C 896.398 491.474,904.158 491.999,907.824 494.669 M823.378 521.445 C 816.844 524.272,815.169 530.671,819.589 535.923 C 821.737 538.476,822.907 539.000,826.454 539.000 C 838.882 539.000,840.554 524.007,828.500 520.651 C 827.400 520.345,825.095 520.702,823.378 521.445 " stroke="none" fill="black" fill-rule="evenodd"/></svg>
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
      name="LogoMesh"
    />
  );
}