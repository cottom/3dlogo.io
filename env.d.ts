
declare global {
  interface Window {
    Potrace: {
      loadImageFromUrl: (dataUrl: string) => void;
      process: (callback: () => void) => void;
      getSVG: (scale?: number) => string;
    };
  }
}

export {};
