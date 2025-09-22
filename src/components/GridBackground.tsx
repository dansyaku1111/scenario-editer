// src/components/GridBackground.tsx

import React from 'react';

type GridBackgroundProps = {
    size?: number;
    color?: string;
    thickness?: number;
};

const GridBackground: React.FC<GridBackgroundProps> = ({
    size = 16, // グリッドの間隔
    color = '#e0e0e0', // ドットの色
    thickness = 1, // ドットの半径
}) => {
    const patternId = `grid-pattern-${size}-${color}-${thickness}`;

    return (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            <defs>
                <pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
                    {/* ドットを描画 */}
                    <circle cx={thickness} cy={thickness} r={thickness} fill={color} />
                </pattern>
            </defs>
            {/* パターンで全面を塗りつぶす */}
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
    );
};

export default GridBackground;