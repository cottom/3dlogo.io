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
<svg id="svg" version="1.1" width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><path d="M231.761 409.911 L 231.500 451.865 225.539 446.949 C 219.479 441.953,213.355 438.617,204.449 435.461 C 197.051 432.838,177.414 432.297,169.000 434.484 C 144.114 440.950,124.199 462.927,118.440 490.279 C 116.651 498.775,116.452 515.463,118.035 524.195 C 123.124 552.256,142.297 573.940,168.000 580.703 C 172.421 581.866,178.337 582.408,186.500 582.398 C 205.531 582.376,216.201 578.576,226.561 568.133 L 232.000 562.650 232.000 570.825 L 232.000 579.000 251.250 579.000 L 270.500 579.000 270.260 473.750 L 270.020 368.500 251.021 368.228 L 232.022 367.957 231.761 409.911 M313.398 368.887 C 303.698 369.870,295.282 374.086,292.319 379.446 C 289.490 384.562,288.000 393.363,288.000 404.954 L 288.000 414.243 306.750 413.554 C 317.063 413.174,330.450 412.448,336.500 411.940 C 350.223 410.789,362.000 410.738,362.000 411.830 C 362.000 412.287,352.546 423.874,340.992 437.580 C 316.535 466.591,316.000 467.566,316.000 483.099 L 316.000 493.123 320.250 492.544 C 332.077 490.936,345.633 490.241,350.843 490.978 C 366.620 493.208,375.037 503.123,374.978 519.409 C 374.927 533.627,365.142 544.073,349.161 546.971 C 344.132 547.883,341.190 547.796,333.724 546.515 C 322.862 544.651,315.575 541.456,303.169 533.114 C 298.168 529.751,293.681 527.000,293.198 527.000 C 292.411 527.000,280.000 557.817,280.000 559.771 C 280.000 561.044,290.765 567.812,299.500 572.031 C 320.799 582.318,345.456 585.083,366.729 579.570 C 390.782 573.337,411.057 554.624,416.101 534.000 C 417.863 526.794,417.617 512.253,415.588 503.624 C 413.616 495.242,407.473 483.207,401.788 476.589 C 396.220 470.108,385.254 463.060,375.982 460.005 C 371.867 458.649,368.324 457.430,368.109 457.296 C 367.894 457.162,373.997 450.578,381.670 442.665 C 397.447 426.396,404.001 418.183,408.139 409.500 C 410.548 404.445,410.998 402.240,410.995 395.500 C 410.993 388.631,408.755 370.421,407.795 369.462 C 407.082 368.748,319.995 368.218,313.398 368.887 M435.995 368.500 C 435.993 368.775,435.988 415.237,435.985 471.750 L 435.979 574.500 452.990 574.774 L 470.000 575.047 470.000 471.524 L 470.000 368.000 453.000 368.000 C 443.650 368.000,435.998 368.225,435.995 368.500 M408.707 387.238 C 408.468 388.482,408.263 387.700,408.252 385.500 C 408.241 383.300,408.437 382.282,408.687 383.238 C 408.937 384.194,408.946 385.994,408.707 387.238 M410.000 396.500 C 410.000 398.975,409.659 401.000,409.243 401.000 C 408.826 401.000,408.647 398.975,408.843 396.500 C 409.040 394.025,409.381 392.000,409.601 392.000 C 409.820 392.000,410.000 394.025,410.000 396.500 M538.500 432.957 C 511.703 436.096,488.738 456.695,480.814 484.701 C 477.668 495.819,477.688 514.247,480.857 525.455 C 487.847 550.174,505.885 568.004,529.528 573.566 C 538.576 575.694,554.427 575.693,563.500 573.563 C 586.054 568.267,605.426 549.317,612.634 525.500 C 615.497 516.040,615.251 493.919,612.172 484.000 C 601.720 450.324,571.136 429.134,538.500 432.957 M822.359 433.037 C 800.101 436.002,779.820 450.707,769.212 471.571 C 763.824 482.169,762.500 488.663,762.500 504.500 C 762.500 518.354,762.722 520.177,765.402 528.355 C 772.602 550.323,790.502 567.261,812.700 573.112 C 822.894 575.799,838.725 575.986,848.500 573.535 C 873.673 567.224,892.326 547.927,898.478 521.832 C 900.391 513.715,900.403 495.592,898.501 486.500 C 896.713 477.954,890.648 465.474,884.534 457.758 C 870.251 439.734,845.615 429.939,822.359 433.037 M665.000 434.443 C 646.365 439.678,631.431 455.182,623.991 477.022 C 620.576 487.044,620.045 506.787,622.888 518.029 C 629.394 543.759,648.782 564.345,670.799 568.903 C 690.448 572.970,709.493 566.965,719.128 553.664 L 722.000 549.700 721.988 557.100 C 721.974 566.135,720.282 572.815,715.949 580.944 C 703.823 603.695,676.979 606.387,647.712 587.786 C 645.079 586.112,642.782 584.913,642.609 585.121 C 640.385 587.798,628.991 611.378,629.631 611.979 C 632.928 615.076,644.419 621.324,651.593 623.920 C 678.244 633.564,706.514 631.239,726.689 617.745 C 735.858 611.612,741.073 605.599,745.980 595.500 C 752.940 581.177,753.000 580.402,753.000 504.517 L 753.000 436.949 737.250 437.225 L 721.500 437.500 721.205 444.225 L 720.910 450.950 715.399 446.461 C 708.612 440.933,700.268 436.642,692.276 434.571 C 685.115 432.716,671.379 432.651,665.000 434.443 M696.655 464.490 C 707.057 467.579,715.441 476.469,719.115 488.305 C 722.203 498.249,721.566 512.278,717.666 520.251 C 714.346 527.035,707.869 533.969,701.863 537.167 C 698.228 539.103,696.081 539.476,689.000 539.404 C 678.831 539.301,674.789 537.753,667.929 531.337 C 659.063 523.043,655.000 513.151,655.000 499.856 C 655.000 483.623,664.226 469.723,678.205 464.894 C 684.694 462.653,690.072 462.535,696.655 464.490 M561.426 467.420 C 568.222 470.745,574.232 477.411,577.141 484.853 C 578.838 489.191,579.450 493.258,579.784 502.394 C 580.312 516.816,578.604 524.369,572.880 532.942 C 566.081 543.124,558.839 546.476,545.062 545.817 C 535.072 545.340,529.951 543.009,523.710 536.100 C 515.728 527.265,512.605 517.146,513.227 502.128 C 514.083 481.464,523.033 468.228,538.344 464.983 C 545.687 463.426,555.349 464.447,561.426 467.420 M841.980 465.683 C 857.621 470.734,866.829 490.283,864.009 512.454 C 862.062 527.766,852.908 541.465,842.572 544.534 C 836.699 546.278,825.230 546.449,819.962 544.870 C 817.888 544.249,814.011 542.096,811.346 540.086 C 801.400 532.584,796.297 518.657,797.252 501.619 C 798.047 487.433,802.813 477.265,812.213 469.698 C 819.002 464.235,832.047 462.475,841.980 465.683 M211.325 471.429 C 218.899 475.053,223.550 479.813,227.258 487.737 C 237.697 510.045,229.620 538.889,210.500 547.578 C 203.890 550.582,195.946 551.441,188.037 550.007 C 175.954 547.816,168.101 541.922,162.594 530.914 C 158.182 522.096,156.614 514.451,157.279 505.000 C 158.002 494.723,161.048 487.203,167.224 480.446 C 175.561 471.324,184.081 467.857,197.000 468.331 C 203.819 468.581,206.652 469.194,211.325 471.429 M414.662 508.250 C 414.385 508.938,414.158 508.375,414.158 507.000 C 414.158 505.625,414.385 505.063,414.662 505.750 C 414.940 506.438,414.940 507.563,414.662 508.250 M415.662 516.250 C 415.385 516.938,415.158 516.375,415.158 515.000 C 415.158 513.625,415.385 513.063,415.662 513.750 C 415.940 514.438,415.940 515.563,415.662 516.250 M415.716 527.750 C 415.487 529.263,415.300 528.025,415.300 525.000 C 415.300 521.975,415.487 520.737,415.716 522.250 C 415.945 523.763,415.945 526.237,415.716 527.750 M854.929 597.303 C 844.523 600.255,835.888 607.726,831.145 617.880 C 828.882 622.725,828.524 624.809,828.545 633.000 C 828.576 644.809,830.906 650.768,838.140 657.534 C 845.940 664.830,850.570 666.500,863.000 666.500 C 872.280 666.500,874.159 666.191,879.175 663.840 C 894.730 656.548,902.913 641.126,899.950 624.685 C 897.794 612.723,891.468 604.850,879.670 599.449 C 872.809 596.308,861.802 595.353,854.929 597.303 M801.000 632.000 L 801.000 666.000 810.000 666.000 L 819.000 666.000 819.000 632.000 L 819.000 598.000 810.000 598.000 L 801.000 598.000 801.000 632.000 M869.497 612.121 C 877.776 614.419,884.013 623.630,883.972 633.500 C 883.924 645.400,873.813 653.201,861.436 650.889 C 851.166 648.970,845.750 642.310,845.750 631.597 C 845.750 621.851,849.874 615.234,857.684 612.449 C 862.404 610.766,864.414 610.710,869.497 612.121 M772.923 647.923 C 770.570 650.276,770.000 651.712,770.000 655.287 C 770.000 662.850,776.714 667.400,783.619 664.515 C 793.979 660.186,791.163 645.000,780.000 645.000 C 776.742 645.000,775.216 645.631,772.923 647.923 " stroke="none" fill="black" fill-rule="evenodd"/></svg>
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