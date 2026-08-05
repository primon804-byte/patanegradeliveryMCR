
import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  eager?: boolean; // For above-the-fold images (hero, etc.)
  onLoad?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  eager = false,
  onLoad,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(eager);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (eager || !containerRef.current) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [eager]);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${containerClassName}`}>
      {/* Skeleton Shimmer Placeholder */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="w-full h-full bg-zinc-800 animate-pulse" />
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmerSkeleton_1.5s_infinite] bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
      </div>

      {/* Actual Image */}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          className={`transition-all duration-500 ${
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'
          } ${className}`}
        />
      )}
    </div>
  );
};
