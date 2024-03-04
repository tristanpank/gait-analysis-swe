import { domAnimation } from 'framer-motion';
import React from 'react';
import { useState, useEffect } from 'react';

const Skeleton = ({ landmarks }) => {

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
          setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };
    
        window.addEventListener('resize', handleResize);
    
        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const connections = [
        [12, 14], 
        [14, 16],
        [14, 12], 
        [12, 24],
        [12, 24], 
        [24, 26],
        [24, 26], 
        [26, 28],
        [26, 28], 
        [28, 32],
        [11, 13], 
        [13, 15],
        [13, 11],
        [11, 23],
        [11, 23], 
        [23, 25],
        [23, 25], 
        [25, 27],
        [25, 27], 
        [27, 31]];

    const clickableLandmarks = [13, 23, 14, 24, 11, 12, 25, 26, 27, 28]

    function handleCircleClick (index) {
        console.log(index);
    }

    return (
        <svg className="relative w-full h-full" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        {connections.map(([start, end], index) => (
            <line
            key={index}
            x1={landmarks[start].x * dimensions.width}
            y1={landmarks[start].y * dimensions.height}
            x2={landmarks[end].x * dimensions.width}
            y2={landmarks[end].y * dimensions.height}
            stroke="gray"
            strokeWidth="2"
            />
        ))}
        {landmarks.map((landmark, index) => (
            <circle
            key={index}
            cx={landmark.x * dimensions.width}
            cy={landmark.y * dimensions.height}
            r='0.5%'
            fill="gray"
            {...(clickableLandmarks.includes(index) && { onClick: () => handleCircleClick(index), style: { cursor: 'pointer' }, fill:"cyan" })}
            />
        ))}
        </svg>
    );
};

export default Skeleton;
