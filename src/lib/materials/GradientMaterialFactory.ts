import * as THREE from 'three';
import { MaterialPreset } from '@/data/materials';

export class GradientMaterialFactory {
  private shaderCache: Map<string, THREE.ShaderMaterial> = new Map();

  create(preset: MaterialPreset): THREE.ShaderMaterial {
    const cacheKey = this.getCacheKey(preset);
    const cached = this.shaderCache.get(cacheKey);
    if (cached) {
      return cached.clone();
    }

    const material = this.createGradientShaderMaterial(preset);
    this.shaderCache.set(cacheKey, material);
    return material.clone();
  }

  private createGradientShaderMaterial(preset: MaterialPreset): THREE.ShaderMaterial {
    const colors = preset.gradientColors || ['#ff006e', '#fb5607', '#ffbe0b'];
    const direction = this.getDirectionVector(preset.gradientDirection || 'diagonal');

    const uniforms = {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(colors[0]) },
      uColor2: { value: new THREE.Color(colors[1] || colors[0]) },
      uColor3: { value: new THREE.Color(colors[2] || colors[1] || colors[0]) },
      uDirection: { value: direction },
      uMetalness: { value: preset.metalness || 0.3 },
      uRoughness: { value: preset.roughness || 0.4 },
      uEmissiveIntensity: { value: preset.emissiveIntensity || 0.1 },
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
      #include <uv_pars_vertex>
      #include <displacementmap_pars_vertex>
      #include <morphtarget_pars_vertex>
      #include <skinning_pars_vertex>
      #include <logdepthbuf_pars_vertex>
      #include <clipping_planes_pars_vertex>
      
      varying vec2 vUv;
      varying vec3 vViewPosition;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      
      void main() {
        #include <uv_vertex>
        #include <skinbase_vertex>
        #include <beginnormal_vertex>
        #include <morphnormal_vertex>
        #include <skinning_vertex>
        #include <defaultnormal_vertex>
        
        vUv = uv;
        vNormal = normalize(transformedNormal);
        
        #include <begin_vertex>
        #include <morphtarget_vertex>
        #include <skinning_vertex>
        #include <displacementmap_vertex>
        #include <project_vertex>
        #include <logdepthbuf_vertex>
        #include <clipping_planes_vertex>
        
        vViewPosition = -mvPosition.xyz;
        vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
        vWorldPosition = worldPosition.xyz;
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
      
      varying vec2 vUv;
      varying vec3 vViewPosition;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      
      #include <common>
      #include <packing>
      #include <dithering_pars_fragment>
      #include <color_pars_fragment>
      #include <uv_pars_fragment>
      #include <map_pars_fragment>
      #include <alphamap_pars_fragment>
      #include <alphatest_pars_fragment>
      #include <aomap_pars_fragment>
      #include <lightmap_pars_fragment>
      #include <emissivemap_pars_fragment>
      #include <bsdfs>
      #include <lights_pars_begin>
      #include <lights_phong_pars_fragment>
      #include <normalmap_pars_fragment>
      #include <specularmap_pars_fragment>
      #include <logdepthbuf_pars_fragment>
      #include <clipping_planes_pars_fragment>
      
      vec3 getGradientColor() {
        vec2 uv = vUv;
        float gradient;
        
        // Calculate gradient based on direction
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
        vec3 color;
        if (gradient < 0.5) {
          color = mix(uColor1, uColor2, gradient * 2.0);
        } else {
          color = mix(uColor2, uColor3, (gradient - 0.5) * 2.0);
        }
        
        return color;
      }
      
      void main() {
        #include <clipping_planes_fragment>
        
        vec3 baseColor = getGradientColor();
        vec4 diffuseColor = vec4(baseColor, 1.0);
        ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
        vec3 totalEmissiveRadiance = baseColor * uEmissiveIntensity;
        
        #include <logdepthbuf_fragment>
        #include <map_fragment>
        #include <color_fragment>
        #include <alphamap_fragment>
        #include <alphatest_fragment>
        #include <specularmap_fragment>
        #include <normal_fragment_begin>
        #include <normal_fragment_maps>
        #include <emissivemap_fragment>
        
        // accumulation
        #include <lights_phong_fragment>
        #include <lights_fragment_begin>
        #include <lights_fragment_maps>
        #include <lights_fragment_end>
        
        // modulation
        #include <aomap_fragment>
        
        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + 
                             reflectedLight.directSpecular + reflectedLight.indirectSpecular + 
                             totalEmissiveRadiance;
        
        #include <output_fragment>
        #include <tonemapping_fragment>
        #include <encodings_fragment>
        #include <fog_fragment>
        #include <premultiplied_alpha_fragment>
        #include <dithering_fragment>
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