import React from 'react';
import { Skeleton } from '@mui/material';

const OptimizedImage = ({ 
  src, 
  alt, 
  width = 300,  // Default width for product cards
  quality = 75,  // Default quality
  ...props 
}) => {
  const [isLoading, setIsLoading] = React.useState(true);

  // Don't modify the URL if it's already optimized or from an external source
  const optimizedSrc = src;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {isLoading && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          animation="wave"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage; 