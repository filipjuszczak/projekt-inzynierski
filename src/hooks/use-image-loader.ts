import { useState, useEffect } from "react";

export function useImageLoader(src: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
    img.onerror = (e) => {
      setIsLoading(false);
      setError(e instanceof Error ? e : new Error("Failed to load image"));
    };
  }, [src]);

  return { isLoading, error };
}
