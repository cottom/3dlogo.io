import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';

export interface ExportOptions {
  format: 'gltf' | 'glb' | 'stl' | 'obj' | 'png' | 'jpg' | 'mp4';
  quality?: number;
  resolution?: [number, number];
  transparent?: boolean;
  binary?: boolean;
}

export interface ExportResult {
  data: Blob | ArrayBuffer | string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface ExportProgress {
  progress: number;
  stage: string;
}

export class LogoExporter {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  constructor(
    renderer: THREE.WebGLRenderer, 
    scene: THREE.Scene, 
    camera: THREE.PerspectiveCamera
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  async exportGLTF(
    mesh: THREE.Mesh,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    return new Promise((resolve, reject) => {
      const exporter = new GLTFExporter();
      
      const exportOptions = {
        binary: options.format === 'glb',
        onlyVisible: true,
        truncateDrawRange: true,
        embedImages: true,
        maxTextureSize: 4096,
        animations: [],
        includeCustomExtensions: false,
      };

      onProgress?.({ progress: 10, stage: 'Preparing scene...' });

      // Create a clean scene with just the mesh
      const exportScene = new THREE.Scene();
      const clonedMesh = mesh.clone();
      exportScene.add(clonedMesh);

      onProgress?.({ progress: 30, stage: 'Processing geometry...' });

      exporter.parse(
        exportScene,
        (result) => {
          onProgress?.({ progress: 80, stage: 'Finalizing export...' });

          let data: Blob | string;
          let mimeType: string;
          let size: number;

          if (options.format === 'glb') {
            // Binary GLB
            const arrayBuffer = result as ArrayBuffer;
            data = new Blob([arrayBuffer], { type: 'model/gltf-binary' });
            mimeType = 'model/gltf-binary';
            size = arrayBuffer.byteLength;
          } else {
            // Text GLTF
            const jsonString = JSON.stringify(result, null, 2);
            data = new Blob([jsonString], { type: 'model/gltf+json' });
            mimeType = 'model/gltf+json';
            size = jsonString.length;
          }

          onProgress?.({ progress: 100, stage: 'Export complete!' });

          resolve({
            data,
            filename: `logo.${options.format}`,
            size,
            mimeType,
          });
        },
        (error) => {
          reject(new Error(`GLTF export failed: ${error.message || error}`));
        },
        exportOptions
      );
    });
  }

  async exportSTL(
    mesh: THREE.Mesh,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    return new Promise((resolve, reject) => {
      try {
        const exporter = new STLExporter();
        
        onProgress?.({ progress: 20, stage: 'Processing mesh...' });

        // Ensure the geometry is merged and optimized
        const geometry = mesh.geometry;
        if (!geometry.attributes.position) {
          reject(new Error('Mesh geometry is not valid for STL export'));
          return;
        }

        onProgress?.({ progress: 60, stage: 'Generating STL data...' });

        const result: any = exporter.parse(mesh, { binary: true });
        
        onProgress?.({ progress: 90, stage: 'Finalizing export...' });

        // Convert result to proper ArrayBuffer for Blob
        let arrayBuffer: ArrayBuffer;
        if (result instanceof DataView) {
          arrayBuffer = new ArrayBuffer(result.byteLength);
          new Uint8Array(arrayBuffer).set(new Uint8Array(result.buffer, result.byteOffset, result.byteLength));
        } else if (result instanceof ArrayBuffer) {
          arrayBuffer = result;
        } else if (result?.buffer instanceof ArrayBuffer) {
          // Handle other buffer-like objects
          arrayBuffer = result.buffer.slice(0);
        } else {
          // Fallback: try to create buffer from whatever we got
          arrayBuffer = new ArrayBuffer(result.byteLength || result.length || 0);
          new Uint8Array(arrayBuffer).set(new Uint8Array(result));
        }
        
        const data = new Blob([arrayBuffer], { type: 'application/octet-stream' });
        const size = arrayBuffer.byteLength;

        onProgress?.({ progress: 100, stage: 'Export complete!' });

        resolve({
          data,
          filename: 'logo.stl',
          size,
          mimeType: 'application/octet-stream',
        });
      } catch (error) {
        reject(new Error(`STL export failed: ${error instanceof Error ? error.message : error}`));
      }
    });
  }

  async exportOBJ(
    mesh: THREE.Mesh,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    return new Promise((resolve, reject) => {
      try {
        const exporter = new OBJExporter();
        
        onProgress?.({ progress: 20, stage: 'Processing mesh...' });

        const result = exporter.parse(mesh);
        
        onProgress?.({ progress: 60, stage: 'Generating OBJ data...' });

        // Generate MTL file content if material exists
        let mtlContent = '';
        if (mesh.material instanceof THREE.Material) {
          const material = mesh.material as any;
          mtlContent = this.generateMTL(material);
        }

        onProgress?.({ progress: 80, stage: 'Creating files...' });

        const objData = new Blob([result], { type: 'text/plain' });
        const size = result.length;

        onProgress?.({ progress: 100, stage: 'Export complete!' });

        resolve({
          data: objData,
          filename: 'logo.obj',
          size,
          mimeType: 'text/plain',
        });
      } catch (error) {
        reject(new Error(`OBJ export failed: ${error instanceof Error ? error.message : error}`));
      }
    });
  }

  async exportImage(
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    return new Promise((resolve, reject) => {
      try {
        const [width, height] = options.resolution || [1024, 1024];
        const quality = options.quality || 0.92;

        onProgress?.({ progress: 20, stage: 'Setting up render...' });

        // Store original renderer size
        const originalSize = this.renderer.getSize(new THREE.Vector2());
        const originalPixelRatio = this.renderer.getPixelRatio();

        // Set high-resolution rendering
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(1);

        // Set transparent background if requested
        const originalClearColor = this.renderer.getClearColor(new THREE.Color());
        const originalClearAlpha = this.renderer.getClearAlpha();

        if (options.transparent && options.format === 'png') {
          this.renderer.setClearColor(0x000000, 0);
        }

        onProgress?.({ progress: 60, stage: 'Rendering image...' });

        // Render the scene
        this.renderer.render(this.scene, this.camera);

        onProgress?.({ progress: 80, stage: 'Processing image...' });

        // Get canvas and convert to blob
        const canvas = this.renderer.domElement;
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create image blob'));
              return;
            }

            // Restore original renderer settings
            this.renderer.setSize(originalSize.x, originalSize.y, false);
            this.renderer.setPixelRatio(originalPixelRatio);
            this.renderer.setClearColor(originalClearColor, originalClearAlpha);

            onProgress?.({ progress: 100, stage: 'Export complete!' });

            resolve({
              data: blob,
              filename: `logo.${options.format}`,
              size: blob.size,
              mimeType: options.format === 'png' ? 'image/png' : 'image/jpeg',
            });
          },
          options.format === 'png' ? 'image/png' : 'image/jpeg',
          quality
        );
      } catch (error) {
        reject(new Error(`Image export failed: ${error instanceof Error ? error.message : error}`));
      }
    });
  }

  async exportVideo(
    duration: number = 5,
    fps: number = 30,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    // Video export would require additional libraries like MediaRecorder API
    // This is a simplified implementation
    throw new Error('Video export is not yet implemented. This feature requires additional setup for recording animations.');
  }

  private generateMTL(material: any): string {
    const materialName = 'LogoMaterial';
    let mtl = `# MTL file for 3D Logo\nnewmtl ${materialName}\n`;

    if (material.color) {
      const color = material.color;
      mtl += `Kd ${color.r.toFixed(6)} ${color.g.toFixed(6)} ${color.b.toFixed(6)}\n`;
    }

    if (material.emissive) {
      const emissive = material.emissive;
      mtl += `Ke ${emissive.r.toFixed(6)} ${emissive.g.toFixed(6)} ${emissive.b.toFixed(6)}\n`;
    }

    if (typeof material.metalness === 'number') {
      mtl += `Pm ${material.metalness.toFixed(6)}\n`;
    }

    if (typeof material.roughness === 'number') {
      mtl += `Pr ${material.roughness.toFixed(6)}\n`;
    }

    if (typeof material.opacity === 'number' && material.opacity < 1) {
      mtl += `d ${material.opacity.toFixed(6)}\n`;
    }

    return mtl;
  }
}

export async function downloadFile(result: ExportResult): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(result.data as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getRecommendedResolution(format: string, usage: 'web' | 'print' | '3d'): [number, number] {
  if (format === 'stl' || format === 'obj' || format === 'gltf' || format === 'glb') {
    return [0, 0]; // Not applicable for 3D formats
  }

  switch (usage) {
    case 'web':
      return format === 'png' ? [1024, 1024] : [1024, 1024];
    case 'print':
      return [2048, 2048];
    case '3d':
      return [4096, 4096];
    default:
      return [1024, 1024];
  }
}