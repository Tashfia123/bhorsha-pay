import React from 'react';

const MarqueeStrip = ({ 
  images = [], 
  speed = 28, 
  height = 'h-56', 
  cardWidth = 'w-52', 
  gap = 'gap-4', 
  rounded = 'rounded-xl' 
}) => {
  // Duplicate images array for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Edge fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
      
      {/* Marquee container */}
      <div 
        className={`flex ${gap} ${height} group`}
        style={{
          width: '200%',
          animation: `marquee ${speed}s linear infinite`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = 'running';
        }}
      >
        {/* Image tiles */}
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className={`flex-shrink-0 ${cardWidth} ${height} ${rounded} overflow-hidden shadow-lg ring-1 ring-gray-200 bg-white`}
          >
            <img
              src={image}
              alt={`Relief Image ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target;
                target.src = `https://via.placeholder.com/400x500/4F46E5/FFFFFF?text=Relief+${index + 1}`;
              }}
            />
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default MarqueeStrip;
