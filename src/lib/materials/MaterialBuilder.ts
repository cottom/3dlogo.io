import * as THREE from 'three';

type MaterialType = 'basic' | 'standard' | 'physical' | 'lambert' | 'phong' | 'toon';

export class MaterialBuilder {
  private type: MaterialType = 'standard';
  private parameters: any = {};

  reset(): this {
    this.type = 'standard';
    this.parameters = {};
    return this;
  }

  setType(type: MaterialType): this {
    this.type = type;
    return this;
  }

  setColor(color: string | number | THREE.Color): this {
    this.parameters.color = new THREE.Color(color);
    return this;
  }

  setMetalness(value: number): this {
    this.parameters.metalness = THREE.MathUtils.clamp(value, 0, 1);
    return this;
  }

  setRoughness(value: number): this {
    this.parameters.roughness = THREE.MathUtils.clamp(value, 0, 1);
    return this;
  }

  setEmissive(color: string | number | THREE.Color): this {
    this.parameters.emissive = new THREE.Color(color);
    return this;
  }

  setEmissiveIntensity(value: number): this {
    this.parameters.emissiveIntensity = Math.max(0, value);
    return this;
  }

  setClearcoat(value: number): this {
    if (this.type === 'physical') {
      this.parameters.clearcoat = THREE.MathUtils.clamp(value, 0, 1);
    }
    return this;
  }

  setClearcoatRoughness(value: number): this {
    if (this.type === 'physical') {
      this.parameters.clearcoatRoughness = THREE.MathUtils.clamp(value, 0, 1);
    }
    return this;
  }

  setSide(side: THREE.Side): this {
    this.parameters.side = side;
    return this;
  }

  setTransparent(value: boolean): this {
    this.parameters.transparent = value;
    return this;
  }

  setOpacity(value: number): this {
    this.parameters.opacity = THREE.MathUtils.clamp(value, 0, 1);
    if (value < 1) {
      this.parameters.transparent = true;
    }
    return this;
  }

  setMap(texture: THREE.Texture | null): this {
    this.parameters.map = texture;
    return this;
  }

  setNormalMap(texture: THREE.Texture | null): this {
    this.parameters.normalMap = texture;
    return this;
  }

  setNormalScale(x: number, y?: number): this {
    this.parameters.normalScale = new THREE.Vector2(x, y ?? x);
    return this;
  }

  setEnvMap(texture: THREE.Texture | null): this {
    this.parameters.envMap = texture;
    return this;
  }

  setEnvMapIntensity(value: number): this {
    this.parameters.envMapIntensity = Math.max(0, value);
    return this;
  }

  setAlphaMap(texture: THREE.Texture | null): this {
    this.parameters.alphaMap = texture;
    return this;
  }

  setBumpMap(texture: THREE.Texture | null): this {
    this.parameters.bumpMap = texture;
    return this;
  }

  setBumpScale(value: number): this {
    this.parameters.bumpScale = value;
    return this;
  }

  setDisplacementMap(texture: THREE.Texture | null): this {
    this.parameters.displacementMap = texture;
    return this;
  }

  setDisplacementScale(value: number): this {
    this.parameters.displacementScale = value;
    return this;
  }

  setDisplacementBias(value: number): this {
    this.parameters.displacementBias = value;
    return this;
  }

  setWireframe(value: boolean): this {
    this.parameters.wireframe = value;
    return this;
  }

  setFlatShading(value: boolean): this {
    this.parameters.flatShading = value;
    return this;
  }

  setVertexColors(value: boolean): this {
    this.parameters.vertexColors = value;
    return this;
  }

  setFog(value: boolean): this {
    this.parameters.fog = value;
    return this;
  }

  setParameters(params: any): this {
    this.parameters = { ...this.parameters, ...params };
    return this;
  }

  build(): THREE.Material {
    let material: THREE.Material;

    switch (this.type) {
      case 'basic':
        material = new THREE.MeshBasicMaterial(this.parameters);
        break;
      case 'lambert':
        material = new THREE.MeshLambertMaterial(this.parameters);
        break;
      case 'phong':
        material = new THREE.MeshPhongMaterial(this.parameters);
        break;
      case 'physical':
        material = new THREE.MeshPhysicalMaterial(this.parameters);
        break;
      case 'toon':
        material = new THREE.MeshToonMaterial(this.parameters);
        break;
      case 'standard':
      default:
        material = new THREE.MeshStandardMaterial(this.parameters);
        break;
    }

    // Ensure material updates if textures are set
    if (this.parameters.map || this.parameters.normalMap || this.parameters.alphaMap) {
      material.needsUpdate = true;
    }

    return material;
  }
}