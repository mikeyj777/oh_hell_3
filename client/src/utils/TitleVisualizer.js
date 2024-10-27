import React, { useState, useEffect, useRef } from 'react';
import './TitleVisualizer.css';

const TitleVisualizer = () => {
  const [epoch, setEpoch] = useState(0);
  const [isRunning, setIsRunning] = useState(true);  // Auto-start
  const canvasRef = useRef(null);
  const gridRef = useRef(null);

  const width = 1600;  // Wider to accommodate text
  const height = 400; // Shorter since we only need one line
  const resolution = 100; // Higher resolution for better text clarity

  const secretMessage = [
    "      ####   #   #    #   #  ####  #    #          ####   ####   ####  #####        ####   ####   ##  ##  ####    ",
    "     #    #  #   #    #   # #      #    #         #      #    # #    # #    #      #      #    # #  ##  # #       ",
    "     #    #  #####    ##### ###### #    #         #      #    # #####  #    #      #      #    # #  ##  # #       ",
    "     #    #  #   #    #   # #      #    #         #      ###### # #    #    #      #  ### ###### #  ##  # ####    ",
    "     #    #  #   #    #   # #      #    #         #      #    # #  #   #    #      #    # #    # #  ##  # #       ",
    "      ####   #   #    #   #  ####  ###### ##       ####  #    # #   #  #####        ####  #    # #  ##  # ####    ",
  ];

  const isInMessage = (x, y) => {
    const messageStartY = Math.floor((resolution - secretMessage.length) / 2);
    const messageStartX = Math.floor((resolution - secretMessage[0].length) / 2);
    
    if (y < messageStartY || y >= messageStartY + secretMessage.length) return false;
    if (x < messageStartX || x >= messageStartX + secretMessage[0].length) return false;
    
    return secretMessage[y - messageStartY][x - messageStartX] !== ' ';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);

    if (!gridRef.current) {
      gridRef.current = Array(resolution).fill().map(() => 
        Array(resolution).fill().map(() => Math.random() * 0.1) // Start very dim
      );
    }

    const updateGrid = () => {
      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const target = isInMessage(i, j) ? 1 : 0;
          gridRef.current[i][j] += (target - gridRef.current[i][j]) * 0.05;
          
          const value = Math.floor(gridRef.current[i][j] * 255);
          const pixelWidth = width / resolution;
          const pixelHeight = height / resolution;

          for (let px = 0; px < pixelWidth; px++) {
            for (let py = 0; py < pixelHeight; py++) {
              const index = ((i * pixelWidth + px) + (j * pixelHeight + py) * width) * 4;
              imageData.data[index + 0] = value; // R
              imageData.data[index + 1] = value; // G
              imageData.data[index + 2] = value; // B
              imageData.data[index + 3] = value; // A - make it transparent when dim
            }
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };

    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setEpoch(prevEpoch => {
          if (prevEpoch >= 99) {
            setIsRunning(false);
            return 100;
          }
          updateGrid();
          return prevEpoch + 1;
        });
      }, 50); // Faster updates for smoother animation
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  return (
    <div className="title-visualizer">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="title-canvas"
      />
    </div>
  );
};

export default TitleVisualizer;