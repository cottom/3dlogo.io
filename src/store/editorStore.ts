import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface BevelParams {
  extrusionDepth: number;
  bevelEnabled: boolean;
  bevelSize: number;
  bevelSegments: number;
}

export interface MaterialConfig {
  type: 'standard' | 'physical';
  color: string;
  metalness: number;
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
}

export interface MaterialState {
  selectedMaterialId: string | null;
  material: MaterialConfig;
}

export interface AnimationConfig {
  type: 'none' | 'rotate' | 'bounce' | 'float' | 'pulse';
  enabled: boolean;
  speed: number;
}

export interface EnvironmentConfig {
  preset: 'studio' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'city' | 'park' | 'lobby';
  background: boolean;
  intensity: number;
  blur: number;
}

export interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
  uploadStage: string;
  uploadError: string | null;
  lastUploadResult: {
    fileName: string;
    fileSize: number;
    pathCount: number;
    colors: string[];
    compressionRatio?: number;
  } | null;
}

export interface EditorState {
  // SVG/Logo data
  svgContent: string | null;
  logoFile: File | null;
  isLoading: boolean;
  
  // Upload state
  upload: UploadState;
  
  // 3D Model parameters
  bevelParams: BevelParams;
  selectedMaterialId: string | null;
  material: MaterialConfig;
  animation: AnimationConfig;
  
  // Scene settings
  backgroundColor: string;
  environmentType: 'color' | 'gradient' | 'hdri';
  environment: EnvironmentConfig;
  
  // UI state
  selectedTool: string | null;
  showGrid: boolean;
  
  // Actions (don't store Three.js instances directly)
  actions: {
    setSvgContent: (content: string | null) => void;
    setLogoFile: (file: File | null) => void;
    setLoading: (loading: boolean) => void;
    
    // Upload actions
    setUploadState: (state: Partial<UploadState>) => void;
    setUploadProgress: (progress: number, stage: string) => void;
    setUploadError: (error: string | null) => void;
    setUploadResult: (result: UploadState['lastUploadResult']) => void;
    resetUpload: () => void;
    
    updateBevelParams: (params: Partial<BevelParams>) => void;
    setSelectedMaterialId: (id: string | null) => void;
    updateMaterial: (material: Partial<MaterialConfig>) => void;
    updateAnimation: (animation: Partial<AnimationConfig>) => void;
    updateEnvironment: (environment: Partial<EnvironmentConfig>) => void;
    setBackgroundColor: (color: string) => void;
    setEnvironmentType: (type: 'color' | 'gradient' | 'hdri') => void;
    setSelectedTool: (tool: string | null) => void;
    setShowGrid: (show: boolean) => void;
    reset: () => void;
  };
}

const initialBevelParams: BevelParams = {
  extrusionDepth: 20,
  bevelEnabled: true,
  bevelSize: 1,
  bevelSegments: 3,
};

const initialMaterial: MaterialConfig = {
  type: 'standard',
  color: '#808080',
  metalness: 1,
  roughness: 0,
  emissive: '#000000',
  emissiveIntensity: 0,
};

const initialAnimation: AnimationConfig = {
  type: 'none',
  enabled: false,
  speed: 1,
};

const initialEnvironment: EnvironmentConfig = {
  preset: 'studio',
  background: false,
  intensity: 1,
  blur: 0,
};

const initialUploadState: UploadState = {
  isUploading: false,
  uploadProgress: 0,
  uploadStage: '',
  uploadError: null,
  lastUploadResult: null,
};

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set) => ({
    // Initial state
    svgContent: null,
    logoFile: null,
    isLoading: false,
    upload: initialUploadState,
    bevelParams: initialBevelParams,
    selectedMaterialId: null,
    material: initialMaterial,
    animation: initialAnimation,
    environment: initialEnvironment,
    backgroundColor: '#f0f0f0',
    environmentType: 'color',
    selectedTool: null,
    showGrid: false,

    // Actions
    actions: {
      setSvgContent: (content: string | null) =>
        set({ svgContent: content }),

      setLogoFile: (file: File | null) =>
        set({ logoFile: file }),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      // Upload actions
      setUploadState: (state: Partial<UploadState>) =>
        set((currentState) => ({
          upload: { ...currentState.upload, ...state },
        })),

      setUploadProgress: (progress: number, stage: string) =>
        set((currentState) => ({
          upload: { 
            ...currentState.upload, 
            uploadProgress: progress, 
            uploadStage: stage,
            uploadError: null,
          },
        })),

      setUploadError: (error: string | null) =>
        set((currentState) => ({
          upload: { 
            ...currentState.upload, 
            uploadError: error,
            isUploading: false,
            uploadProgress: 0,
          },
        })),

      setUploadResult: (result: UploadState['lastUploadResult']) =>
        set((currentState) => ({
          upload: { 
            ...currentState.upload, 
            lastUploadResult: result,
            isUploading: false,
            uploadProgress: 100,
            uploadError: null,
          },
        })),

      resetUpload: () =>
        set(() => ({
          upload: initialUploadState,
        })),

      updateBevelParams: (params: Partial<BevelParams>) =>
        set((state) => ({
          bevelParams: { ...state.bevelParams, ...params },
        })),

      setSelectedMaterialId: (id: string | null) =>
        set({ selectedMaterialId: id }),

      updateMaterial: (material: Partial<MaterialConfig>) =>
        set((state) => ({
          material: { ...state.material, ...material },
        })),

      updateAnimation: (animation: Partial<AnimationConfig>) =>
        set((state) => ({
          animation: { ...state.animation, ...animation },
        })),

      updateEnvironment: (environment: Partial<EnvironmentConfig>) =>
        set((state) => ({
          environment: { ...state.environment, ...environment },
        })),

      setBackgroundColor: (color: string) =>
        set({ backgroundColor: color }),

      setEnvironmentType: (type: 'color' | 'gradient' | 'hdri') =>
        set({ environmentType: type }),

      setSelectedTool: (tool: string | null) =>
        set({ selectedTool: tool }),

      setShowGrid: (show: boolean) =>
        set({ showGrid: show }),

      reset: () =>
        set({
          svgContent: null,
          logoFile: null,
          isLoading: false,
          upload: initialUploadState,
          bevelParams: initialBevelParams,
          selectedMaterialId: null,
          material: initialMaterial,
          animation: initialAnimation,
          environment: initialEnvironment,
          backgroundColor: '#f0f0f0',
          environmentType: 'color',
          selectedTool: null,
          showGrid: true,
        }),
    },
  }))
);

// Selector hooks for better performance
export const useSvgContent = () => useEditorStore((state) => state.svgContent);
export const useBevelParams = () => useEditorStore((state) => state.bevelParams);
export const useSelectedMaterialId = () => useEditorStore((state) => state.selectedMaterialId);
export const useMaterial = () => useEditorStore((state) => state.material);
export const useAnimation = () => useEditorStore((state) => state.animation);
export const useEnvironment = () => useEditorStore((state) => state.environment);
export const useBackgroundColor = () => useEditorStore((state) => state.backgroundColor);
export const useUploadState = () => useEditorStore((state) => state.upload);
export const useEditorActions = () => useEditorStore((state) => state.actions);