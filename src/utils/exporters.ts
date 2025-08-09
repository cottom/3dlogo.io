import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

// Extend Window interface for MediaRecorder types
declare global {
  interface Window {
    MediaRecorder: any;
  }
  interface HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
  }
}

export type AspectRatio = '1:1' | '4:3' | '16:9' | '9:16';
export type ResolutionPreset = '480p' | '720p' | '1080p' | '2160p' | 'custom';

export interface ExportOptions {
  format: 'gltf' | 'glb' | 'stl' | 'obj' | 'png' | 'jpg' | 'mp4';
  quality?: number;
  resolution?: [number, number];
  transparent?: boolean;
  binary?: boolean;
  // Video specific options
  aspectRatio?: AspectRatio;
  resolutionPreset?: ResolutionPreset;
  backgroundColor?: string;
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

// Helper function to get resolution based on aspect ratio and preset
export function getVideoResolution(aspectRatio: AspectRatio = '16:9', preset: ResolutionPreset = '1080p'): [number, number] {
  const resolutions: Record<ResolutionPreset, Record<AspectRatio, [number, number]>> = {
    '480p': {
      '1:1': [480, 480],
      '4:3': [640, 480],
      '16:9': [854, 480],
      '9:16': [480, 854]
    },
    '720p': {
      '1:1': [720, 720],
      '4:3': [960, 720],
      '16:9': [1280, 720],
      '9:16': [720, 1280]
    },
    '1080p': {
      '1:1': [1080, 1080],
      '4:3': [1440, 1080],
      '16:9': [1920, 1080],
      '9:16': [1080, 1920]
    },
    '2160p': {
      '1:1': [2160, 2160],
      '4:3': [2880, 2160],
      '16:9': [3840, 2160],
      '9:16': [2160, 3840]
    },
    'custom': {
      '1:1': [1024, 1024],
      '4:3': [1024, 768],
      '16:9': [1920, 1080],
      '9:16': [1080, 1920]
    }
  };

  return resolutions[preset][aspectRatio];
}

// Helper function to get human-readable labels
export function getAspectRatioLabel(ratio: AspectRatio): string {
  const labels: Record<AspectRatio, string> = {
    '1:1': 'Square (1:1)',
    '4:3': 'Standard (4:3)',
    '16:9': 'Widescreen (16:9)',
    '9:16': 'Portrait (9:16)'
  };
  return labels[ratio];
}

export function getResolutionLabel(preset: ResolutionPreset): string {
  const labels: Record<ResolutionPreset, string> = {
    '480p': '480p (SD)',
    '720p': '720p (HD)',
    '1080p': '1080p (Full HD)',
    '2160p': '2160p (4K)',
    'custom': 'Custom'
  };
  return labels[preset];
}

// Get resolution string for display
export function getResolutionDisplay(aspectRatio: AspectRatio, preset: ResolutionPreset): string {
  const [width, height] = getVideoResolution(aspectRatio, preset);
  return `${width}×${height}`;
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

        // Export as binary STL
        const result = exporter.parse(mesh, { binary: true });
        
        onProgress?.({ progress: 90, stage: 'Finalizing export...' });

        // The STLExporter returns a DataView or ArrayBuffer
        let data: Blob;
        let size: number;
        
        if (result instanceof ArrayBuffer) {
          data = new Blob([result], { type: 'application/octet-stream' });
          size = result.byteLength;
        } else if (result instanceof DataView) {
          // Convert DataView to ArrayBuffer properly
          const buffer = result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength);
          // Ensure we have an ArrayBuffer, not SharedArrayBuffer
          const arrayBuffer = buffer instanceof ArrayBuffer ? buffer : new ArrayBuffer(0);
          data = new Blob([arrayBuffer], { type: 'application/octet-stream' });
          size = arrayBuffer.byteLength;
        } else {
          // For string results (ASCII STL)
          const encoder = new TextEncoder();
          const buffer = encoder.encode(result as string);
          data = new Blob([buffer], { type: 'application/octet-stream' });
          size = buffer.byteLength;
        }

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

        // Create a scene with just the mesh for proper export
        const exportScene = new THREE.Scene();
        const clonedMesh = mesh.clone();
        exportScene.add(clonedMesh);

        onProgress?.({ progress: 60, stage: 'Generating OBJ data...' });

        // Parse the scene instead of just the mesh for better compatibility
        const result = exporter.parse(exportScene);
        
        onProgress?.({ progress: 80, stage: 'Creating files...' });

        // Create OBJ blob
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
        } else if (options.backgroundColor) {
          // Use the provided background color
          const color = new THREE.Color(options.backgroundColor);
          this.renderer.setClearColor(color, 1);
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
    mesh: THREE.Mesh | null,
    duration: number = 5,
    fps: number = 30,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    return new Promise((resolve, reject) => {
      (async () => {
      // Store original state before any modifications
      const originalSize = new THREE.Vector2();
      this.renderer.getSize(originalSize);
      const originalCameraPosition = this.camera.position.clone();
      const originalCameraRotation = this.camera.rotation.clone();
      const originalCameraAspect = this.camera.aspect;
      
      // Store original clear color and alpha
      const originalClearColor = this.renderer.getClearColor(new THREE.Color());
      const originalClearAlpha = this.renderer.getClearAlpha();
      
      // Store original mesh state if provided
      let originalRotation: THREE.Euler | null = null;
      let originalPosition: THREE.Vector3 | null = null;
      const originalSceneRotation = this.scene.rotation.y;
      
      if (mesh) {
        originalRotation = mesh.rotation.clone();
        originalPosition = mesh.position.clone();
      }
      
      try {
        onProgress?.({ progress: 10, stage: 'Setting up MP4 recording...' });

        let width: number;
        let height: number;
        
        // Determine resolution based on options
        if (options.resolution) {
          // Use custom resolution if provided
          [width, height] = options.resolution;
        } else if (options.aspectRatio && options.resolutionPreset) {
          // Use aspect ratio and preset
          [width, height] = getVideoResolution(options.aspectRatio, options.resolutionPreset);
        } else {
          // Default to 16:9 1080p
          [width, height] = getVideoResolution('16:9', '1080p');
        }
        
        // Ensure dimensions are even (required for video encoding)
        width = Math.floor(width / 2) * 2;
        height = Math.floor(height / 2) * 2;
        
        // Validate resolution doesn't exceed codec limits for 2160p
        const maxPixels = 3840 * 2160; // 4K limit
        if (width * height > maxPixels) {
          // Scale down proportionally
          const scale = Math.sqrt(maxPixels / (width * height));
          width = Math.floor(width * scale / 2) * 2;
          height = Math.floor(height * scale / 2) * 2;
        }
        
        // Temporarily resize renderer for video export
        this.renderer.setSize(width, height);
        
        // Update camera aspect ratio to match video dimensions
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        // Set background color if provided
        if (options.backgroundColor) {
          const color = new THREE.Color(options.backgroundColor);
          this.renderer.setClearColor(color, 1);
        }
        
        // Frame the model properly in the view
        let modelCenter = new THREE.Vector3();
        if (mesh) {
          // Calculate bounding box of the mesh
          const box = new THREE.Box3().setFromObject(mesh);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Calculate the maximum dimension
          const maxDim = Math.max(size.x, size.y, size.z);
          
          // Calculate camera distance to fit the object
          const fov = this.camera.fov * (Math.PI / 180);
          const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5; // 1.5 for some padding
          
          // Position camera to look at center
          this.camera.position.set(center.x, center.y, center.z + cameraZ);
          this.camera.lookAt(center);
          this.camera.updateProjectionMatrix();
          
          // Store center for rotation
          modelCenter = center;
        }

        // Create MP4 muxer
        const muxer = new Muxer({
          target: new ArrayBufferTarget(),
          video: {
            codec: 'avc',
            width,
            height,
            frameRate: fps
          },
          fastStart: 'in-memory'
        });

        onProgress?.({ progress: 30, stage: 'Recording animation...' });

        // Create VideoEncoder
        const videoEncoder = new VideoEncoder({
          output: (chunk, meta) => {
            muxer.addVideoChunk(chunk, meta);
          },
          error: (error) => {
            reject(new Error(`Video encoder error: ${error}`));
          }
        });

        // Configure encoder with appropriate codec level based on resolution
        // Select codec level based on pixel count
        const pixelCount = width * height;
        let codecString: string;
        let bitrate: number;
        
        if (pixelCount <= 414720) { // 720x576 - Level 3.0
          codecString = 'avc1.4d001e'; // Main Profile, Level 3.0
          bitrate = 2_000_000; // 2 Mbps
        } else if (pixelCount <= 921600) { // 1280x720 - Level 3.1
          codecString = 'avc1.4d001f'; // Main Profile, Level 3.1
          bitrate = 4_000_000; // 4 Mbps
        } else if (pixelCount <= 2073600) { // 1920x1080 - Level 4.0
          codecString = 'avc1.4d0028'; // Main Profile, Level 4.0
          bitrate = 8_000_000; // 8 Mbps
        } else if (pixelCount <= 8294400) { // 3840x2160 - Level 5.1
          codecString = 'avc1.4d0033'; // Main Profile, Level 5.1
          bitrate = 20_000_000; // 20 Mbps for 4K
        } else {
          // Fallback to Level 5.2 for very high resolutions
          codecString = 'avc1.4d0034'; // Main Profile, Level 5.2
          bitrate = 30_000_000; // 30 Mbps
        }
        
        videoEncoder.configure({
          codec: codecString,
          width,
          height,
          bitrate,
          framerate: fps,
          hardwareAcceleration: 'prefer-hardware',
          latencyMode: 'quality'
        });

        // Record frames
        const totalFrames = duration * fps;
        let frameCount = 0;

        // Function to capture and encode a frame
        const captureFrame = async (timestamp: number) => {
          // Create ImageBitmap from canvas with proper color space
          const bitmap = await createImageBitmap(this.renderer.domElement, {
            colorSpaceConversion: 'none'
          });
          
          // Create VideoFrame with proper timestamp in microseconds
          const frame = new VideoFrame(bitmap, {
            timestamp: Math.round(timestamp * 1000000), // Convert seconds to microseconds
            displayWidth: width,
            displayHeight: height
          });
          
          // Encode frame with proper keyframe interval
          const isKeyFrame = frameCount === 0 || frameCount % 60 === 0; // Keyframe every 2 seconds at 30fps
          videoEncoder.encode(frame, { keyFrame: isKeyFrame });
          frame.close();
          bitmap.close();
        };

        // Animation loop
        for (let i = 0; i < totalFrames; i++) {
          const elapsed = i / fps;
          
          // Update progress
          frameCount = i;
          const progress = Math.min(30 + (frameCount / totalFrames) * 50, 80);
          onProgress?.({ progress, stage: `Encoding frame ${frameCount + 1}/${totalFrames}...` });

          // Rotate camera around the model for better 3D visualization
          if (mesh) {
            // Calculate camera position for orbital rotation
            const angle = (elapsed / duration) * Math.PI * 2;
            const radius = this.camera.position.distanceTo(modelCenter);
            
            // Keep the same height (y) but rotate around x and z
            const x = modelCenter.x + radius * Math.sin(angle);
            const z = modelCenter.z + radius * Math.cos(angle);
            
            this.camera.position.set(x, this.camera.position.y, z);
            this.camera.lookAt(modelCenter);
          } else {
            // Fallback to rotating the entire scene if no mesh is provided
            this.scene.rotation.y = (elapsed / duration) * Math.PI * 2;
          }
          
          // Render frame
          this.renderer.render(this.scene, this.camera);
          
          // Capture and encode frame
          await captureFrame(elapsed);
          
          // Process in batches to avoid blocking the UI
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }

        onProgress?.({ progress: 85, stage: 'Finalizing MP4...' });

        // Flush encoder
        await videoEncoder.flush();
        videoEncoder.close();

        // Finalize muxer
        muxer.finalize();

        // Get the MP4 data
        const { buffer } = muxer.target as ArrayBufferTarget;
        const mp4Blob = new Blob([buffer], { type: 'video/mp4' });

        onProgress?.({ progress: 100, stage: 'Export complete!' });

        resolve({
          data: mp4Blob,
          filename: 'logo.mp4',
          size: mp4Blob.size,
          mimeType: 'video/mp4',
        });

      } catch (error) {
        reject(new Error(`MP4 export failed: ${error instanceof Error ? error.message : error}`));
      } finally {
        // Always restore original state, whether export succeeded or failed
        
        // Reset mesh to original state
        if (mesh && originalRotation) {
          mesh.rotation.copy(originalRotation);
          if (originalPosition) {
            mesh.position.copy(originalPosition);
          }
        }
        
        // Reset scene rotation
        this.scene.rotation.y = originalSceneRotation;
        
        // Restore original camera state
        this.camera.position.copy(originalCameraPosition);
        this.camera.rotation.copy(originalCameraRotation);
        this.camera.aspect = originalCameraAspect;
        this.camera.updateProjectionMatrix();
        
        // Restore original renderer size
        this.renderer.setSize(originalSize.x, originalSize.y);
        
        // Restore original clear color and alpha
        this.renderer.setClearColor(originalClearColor, originalClearAlpha);
        
        // Force a render to update the view
        this.renderer.render(this.scene, this.camera);
      }
      })();
    });
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