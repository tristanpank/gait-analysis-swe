import { domAnimation } from 'framer-motion';
import React from 'react';
import { useState, useEffect } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger, DrawerTitle } from "../../shadcn/components/ui/drawer";

const Skeleton = ({ landmarks, graphs }) => {
    console.log(graphs);
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
            x1={landmarks[0][start] * dimensions.width}
            y1={landmarks[1][start] * dimensions.height}
            x2={landmarks[0][end] * dimensions.width}
            y2={landmarks[1][end] * dimensions.height}
            stroke="gray"
            strokeWidth="2"
          />
        ))}
        {landmarks[0].map((x, index) => (
          <Drawer>
            <DrawerTrigger asChild>
              <circle
                key={index}
                cx={landmarks[0][index] * dimensions.width}
                cy={landmarks[1][index] * dimensions.height}
                r="0.5%"
                fill="gray"
                {...(clickableLandmarks.includes(index) && { onClick: () => handleCircleClick(index), style: { cursor: 'pointer' }, fill: "cyan" })}
              />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-center">Graph {index}</DrawerTitle>
              </DrawerHeader>
              <div className='flex justify-center items-center'>
              {clickableLandmarks.includes(index) && <img src={graphs[index]} alt="graph" className="" />}
              </div>
              
            </DrawerContent>
          </Drawer>
        ))}
      </svg>
    );
};

export default Skeleton;
