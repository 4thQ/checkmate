import { useCallback } from 'react';

export const useId = () => {
  const generateId = useCallback(() => {
    return Math.random().toString(36).substring(2, 10);
  }, []);

  return generateId;
}; 