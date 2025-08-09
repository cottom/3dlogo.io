import * as THREE from 'three';
import { MaterialPreset } from '@/data/materials';

export class GradientMaterialFactory {
  private shaderCache: Map<string, THREE.ShaderMaterial> = new Map();
  private enableAnimation: boolean = false;

  create(preset: MaterialPreset, options?: { animate?: boolean }): THREE.ShaderMaterial {
    const cacheKey = this.getCacheKey(preset);
    const cached = this.shaderCache.get(cacheKey);
    if (cached) {
      return cached.clone();
    }

    const material = this.createGradientShaderMaterial(preset, options);
    this.shaderCache.set(cacheKey, material);
    return material.clone();
  }

  setAnimationEnabled(enabled: boolean): void {
    this.enableAnimation = enabled;
  }

  private createGradientShaderMaterial(preset: MaterialPreset, options?: { animate?: boolean }): THREE.ShaderMaterial {
    const colors = preset.gradientColors || ['#ff006e', '#fb5607', '#ffbe0b'];
    const direction = this.getDirectionVector(preset.gradientDirection || 'diagonal');
    const shouldAnimate = options?.animate ?? this.enableAnimation;

    const uniforms = {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(colors[0]) },
      uColor2: { value: new THREE.Color(colors[1] || colors[0]) },
      uColor3: { value: new THREE.Color(colors[2] || colors[1] || colors[0]) },
      uDirection: { value: direction },
      uMetalness: { value: preset.metalness ?? 0.3 },
      uRoughness: { value: preset.roughness ?? 0.4 },
      uEmissiveIntensity: { value: preset.emissiveIntensity ?? 0.1 },
      uFresnelPower: { value: 2.0 },
      uSpecularIntensity: { value: 0.5 },
      uAnimate: { value: shouldAnimate ? 1.0 : 0.0 },
      // Standard Three.js uniforms for lighting
      ...THREE.UniformsLib.common,
      ...THREE.UniformsLib.lights,
      ...THREE.UniformsLib.normalmap,
    };

    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([uniforms]),
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader(),
      lights: true,
      side: THREE.DoubleSide,
      transparent: false,
    });

    // Enable proper lighting
    material.lights = true;

    return material;
  }

  private getVertexShader(): string {
    return /* glsl */ `
      #include <common>
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalMatrix * normal;
        
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
  }

  private getFragmentShader(): string {
    return /* glsl */ `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec2 uDirection;
      uniform float uMetalness;
      uniform float uRoughness;
      uniform float uEmissiveIntensity;
      uniform float uFresnelPower;
      uniform float uSpecularIntensity;
      uniform float uAnimate;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      
      #include <common>
      #include <lights_pars_begin>
      
      vec3 getGradientColor() {
        vec2 uv = vUv;
        float gradient;
        
        // Add subtle animation only if enabled
        float animOffset = uAnimate * sin(uTime * 0.5) * 0.02;
        
        // Calculate gradient based on direction
        if (abs(uDirection.x) > 0.9 && abs(uDirection.y) < 0.1) {
          // Horizontal
          gradient = uv.x + animOffset;
        } else if (abs(uDirection.y) > 0.9 && abs(uDirection.x) < 0.1) {
          // Vertical
          gradient = uv.y + animOffset;
        } else if (length(uDirection - vec2(0.5, 0.5)) < 0.1) {
          // Radial
          vec2 center = vec2(0.5, 0.5);
          gradient = length(uv - center) * 2.0 + animOffset;
        } else {
          // Diagonal
          gradient = (uv.x + uv.y) * 0.5 + animOffset;
        }
        
        // Smooth gradient transitions
        gradient = smoothstep(0.0, 1.0, gradient);
        
        // Three-color gradient with smoother transitions
        vec3 color;
        if (gradient < 0.5) {
          float t = gradient * 2.0;
          t = smoothstep(0.0, 1.0, t);
          color = mix(uColor1, uColor2, t);
        } else {
          float t = (gradient - 0.5) * 2.0;
          t = smoothstep(0.0, 1.0, t);
          color = mix(uColor2, uColor3, t);
        }
        
        return color;
      }
      
      void main() {
        vec3 baseColor = getGradientColor();
        
        // Enhanced lighting
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        
        // Multiple light sources for better depth
        vec3 lightDir1 = normalize(vec3(1.0, 1.0, 0.5));
        vec3 lightDir2 = normalize(vec3(-0.5, 0.5, 1.0));
        vec3 lightDir3 = normalize(vec3(0.0, -1.0, 0.3));
        
        float diffuse1 = max(dot(normal, lightDir1), 0.0);
        float diffuse2 = max(dot(normal, lightDir2), 0.0) * 0.5;
        float diffuse3 = max(dot(normal, lightDir3), 0.0) * 0.3;
        
        float totalDiffuse = diffuse1 + diffuse2 + diffuse3;
        
        // Specular highlights
        vec3 halfwayDir = normalize(lightDir1 + viewDir);
        float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);
        vec3 specular = vec3(1.0) * spec * uSpecularIntensity;
        
        // Fresnel effect for rim lighting
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), uFresnelPower);
        vec3 fresnelColor = baseColor * fresnel * 0.5;
        
        // Metalness simulation
        vec3 metallicTint = mix(vec3(1.0), baseColor, uMetalness);
        
        // Combine all lighting components
        vec3 ambient = baseColor * 0.3;
        vec3 diffuseColor = baseColor * totalDiffuse * 0.7 * metallicTint;
        vec3 emissive = baseColor * uEmissiveIntensity;
        
        vec3 finalColor = ambient + diffuseColor + specular + fresnelColor + emissive;
        
        // Subtle color enhancement
        finalColor = pow(finalColor, vec3(0.95));
        
        gl_FragColor = vec4(finalColor, 1.0);
        
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `;
  }

  private getDirectionVector(direction: string): THREE.Vector2 {
    switch (direction) {
      case 'horizontal':
        return new THREE.Vector2(1, 0);
      case 'vertical':
        return new THREE.Vector2(0, 1);
      case 'radial':
        return new THREE.Vector2(0.5, 0.5);
      case 'diagonal':
      default:
        return new THREE.Vector2(1, 1);
    }
  }

  private getCacheKey(preset: MaterialPreset): string {
    const colors = preset.gradientColors?.join('_') || '';
    return `gradient_${colors}_${preset.gradientDirection}_${preset.metalness}_${preset.roughness}`;
  }

  updateTime(material: THREE.ShaderMaterial, time: number): void {
    if (material.uniforms.uTime) {
      material.uniforms.uTime.value = time;
    }
  }

  dispose(): void {
    this.shaderCache.forEach(material => {
      material.dispose();
    });
    this.shaderCache.clear();
  }
}