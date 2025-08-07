'use client';

import { useEffect, useState } from 'react';

export function useInitialLoad() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing editor...');

  useEffect(() => {
    const loadSteps = [
      { progress: 20, message: 'Loading 3D engine...', delay: 100 },
      { progress: 40, message: 'Preparing materials...', delay: 200 },
      { progress: 60, message: 'Setting up environment...', delay: 200 },
      { progress: 80, message: 'Initializing controls...', delay: 200 },
      { progress: 100, message: 'Ready!', delay: 100 },
    ];

    let currentStep = 0;

    const progressInterval = setInterval(() => {
      if (currentStep < loadSteps.length) {
        const step = loadSteps[currentStep];
        setLoadingProgress(step.progress);
        setLoadingMessage(step.message);
        currentStep++;
        
        if (step.progress === 100) {
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      } else {
        clearInterval(progressInterval);
      }
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  return { isLoading, loadingProgress, loadingMessage };
}