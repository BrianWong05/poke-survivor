import React, { useState } from 'react';
import { type ButtonProps } from '../../types';
import { styles } from '../../styles';
import { isBright, lighten } from '../../utils';

export const Button: React.FC<ButtonProps> = ({ children, outline, color, style, ...props }) => {
    const [hover, setHover] = useState(false);
    
    const baseColor = color || '#ffffff';
    const bg = outline ? 'transparent' : (hover ? lighten(baseColor, 20) : baseColor);
    const fg = outline ? baseColor : (isBright(baseColor) ? '#000' : '#fff');
    const border = `1px solid ${baseColor}`;

    return (
        <button 
            style={{
                ...styles.button,
                backgroundColor: bg,
                color: fg,
                border: border,
                ...style
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            {...props}
        >
            {children}
        </button>
    );
};
