import React, { useEffect, useState } from 'react';

interface SlideshowProps {
  imageUrls: string[];
  title?: string;
  className?: string;
  interval?: number;
}

const Slideshow = ({ 
  imageUrls, 
  title = "Imagen", 
  className = "w-full h-full",
  interval = 60000 // default 1 minute
}: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length <= 1) {
      setCurrentIndex(0);
      return;
    }
    
    const timer = setInterval(() => {
      setCurrentIndex((prev: number) => (prev + 1) % imageUrls.length);
    }, interval);

    return () => clearInterval(timer);
  }, [imageUrls, interval]);

  if (!imageUrls || imageUrls.length === 0) {
    return <div className={`${className} bg-gray-200 animate-pulse`} />;
  }

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {imageUrls.map((url: string, idx: number) => (
        <img
          key={`${url}-${idx}`}
          src={url}
          alt={`${title} - ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          } group-hover:scale-110 transition-transform duration-700`}
        />
      ))}
      
      {/* Indicators */}
      {imageUrls.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
          {imageUrls.map((_: any, idx: number) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-6 bg-[#10b981] shadow-sm' 
                  : 'w-1.5 bg-white/40 border border-black/5'
              }`} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slideshow;
