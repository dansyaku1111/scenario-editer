import React from 'react';

type GridBackgroundProps = {
  size?: number;
  color?: string;
  thickness?: number;
  transform?: string;
};

const GridBackground: React.FC<GridBackgroundProps> = ({
  size = 16,
  color = '#e0e0e0',
  thickness = 1,
  transform = '',
}) => {
  const patternId = `grid-pattern-${size}-${color}-${thickness}`;

  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
      <defs>
        <pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
          <circle cx={thickness} cy={thickness} r={thickness} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} transform={transform} />
    </svg>
  );
};

export default GridBackground;
