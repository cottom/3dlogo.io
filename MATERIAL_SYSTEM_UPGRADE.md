# Material System Upgrade

## Overview
The material system has been refactored to be more extensible, maintainable, and aligned with Three.js best practices.

## Key Improvements

### 1. **Material Factory Pattern**
- Centralized material creation through `MaterialFactory`
- Singleton pattern ensures consistent material handling across the application
- Support for different material types (standard, physical, gradient)

### 2. **Material Builder**
- Fluent API for constructing materials
- Type-safe parameter setting with validation
- Support for all Three.js material types (Basic, Lambert, Phong, Standard, Physical, Toon)

### 3. **Material Caching System**
- LRU cache implementation to optimize performance
- Automatic disposal of unused materials
- Configurable cache size
- Clone materials to allow instance-specific modifications

### 4. **Material Manager**
- High-level API for material operations
- Reference counting for proper resource management
- Automatic texture disposal
- Environment map management

### 5. **Gradient Material Factory**
- Custom shader material implementation
- Proper Three.js lighting integration
- Cached shader compilation
- Support for different gradient directions (horizontal, vertical, radial, diagonal)

## Architecture

```
src/lib/materials/
├── MaterialFactory.ts      # Main factory for creating materials
├── MaterialBuilder.ts      # Fluent API for building materials
├── MaterialCache.ts        # LRU cache for material instances
├── MaterialManager.ts      # High-level material management
├── GradientMaterialFactory.ts # Custom gradient shader materials
└── index.ts               # Public API exports
```

## Usage Examples

### Basic Usage
```typescript
import { MaterialManager } from '@/lib/materials';

const manager = MaterialManager.getInstance();

// Create material from preset
const material = manager.createMaterial(preset);

// Create custom material
const customMaterial = manager.createCustomMaterial({
  color: 0xff0000,
  metalness: 0.8,
  roughness: 0.2
});
```

### Using the Material Builder
```typescript
import { MaterialBuilder } from '@/lib/materials';

const material = new MaterialBuilder()
  .setType('physical')
  .setColor('#ff0000')
  .setMetalness(0.8)
  .setRoughness(0.2)
  .setClearcoat(1.0)
  .setEnvMapIntensity(1.5)
  .build();
```

### Environment Map Setup
```typescript
const envMap = /* load environment texture */;
manager.setEnvironmentMap(envMap);
// All materials will now use this environment map
```

## Benefits

1. **Performance**
   - Materials are cached and reused
   - Automatic resource cleanup
   - Optimized shader compilation

2. **Maintainability**
   - Single source of truth for material creation
   - Clear separation of concerns
   - Easy to extend with new material types

3. **Type Safety**
   - Full TypeScript support
   - Validated parameters
   - Compile-time checks

4. **Three.js Best Practices**
   - Proper material disposal
   - Texture management
   - Follows Three.js material hierarchy

## Migration Guide

### Before
```typescript
const material = new THREE.MeshStandardMaterial({
  color: preset.color,
  metalness: preset.metalness,
  roughness: preset.roughness
});
```

### After
```typescript
const manager = MaterialManager.getInstance();
const material = manager.createMaterial(preset);
```

## Future Enhancements

- [ ] Add support for texture loading and management
- [ ] Implement material animation system
- [ ] Add material presets for common use cases
- [ ] Create material editor UI component
- [ ] Add support for custom shader chunks
- [ ] Implement material LOD system
- [ ] Add material serialization/deserialization