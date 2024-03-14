import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel'; // Import the ControlPanel component

/*
 * The main App component that initializes the canvas and simulation settings.
 * It uses a useRef hook for the canvas to directly manipulate the DOM for rendering,
 * and a useState hook for managing the simulation settings, including boid behavior and animation control.
 */
function App() {
  // Reference to the canvas element for direct DOM manipulation.
  const canvasRef = useRef(null);
  
  // State to manage various settings for the simulation.
  // These settings control boid behavior such as repulsion, attraction, and maximum speed,
  // as well as simulation parameters like the maximum number of boids, their lifespan, and frame rate.
  const [settings, setSettings] = useState({
    repulsionDistance: 15,     // Distance within which boids begin to repel each other, in pixels.
    attractionDistance: 100,   // Distance within which boids begin to attract each other, in pixels.
    maxBoids: 2048,            // Maximum number of boids to prevent performance overload.
    lifespan: 30 * 10,         // Lifespan of boids in update cycles, assuming 30fps, equating to 10 seconds.
    addBoidsRate: 1000 / 15,   // Rate at which new boids are added, calculated to add boids every 1/15th of a second.
    frameRate: 1000 / 30,      // Frame rate of the simulation, set to process a new frame every 1/30th of a second.
    boidsPerSecond: 100,       // Target number of boids to add per second, used for adjusting the addBoidsRate.
    maxSpeed: 5,               // Maximum speed of boids, controlling how fast they can move across the canvas.
    isPaused: false,           // Flag to pause or resume the simulation.
  });
  
  // useRef hook to keep a mutable reference to the current settings object without triggering re-renders.
  const settingsRef = useRef(settings);
  
  // useRef hook to store the last time (in milliseconds) a boid was added. Used to control the rate of boid addition.
  const lastAddedTime = useRef(0);
  
  // useState hook for managing the formula string representation. This string visualizes certain simulation parameters.
  const [formulaString, setFormulaString] = useState("");
  
  // useState hook for managing the color scheme of the simulation. Allows toggling between 'default' and 'alternative'.
  const [colorScheme, setColorScheme] = useState('default');
  
  // Function to toggle the color scheme state between 'default' and 'alternative'.
  const toggleColorScheme = () => {
    setColorScheme(prevScheme => prevScheme === 'default' ? 'alternative' : 'default');
  };
  
  
  


  // Function to randomize simulation settings for repulsion distance, attraction distance, and max speed.
  const randomizeSettings = () => {
    // Helper function to generate a random integer between min (inclusive) and max (inclusive).
    const getRandomValue = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Generate a random repulsion distance between 0 and 200.
    const randomRepulsion = getRandomValue(200);
    // Generate a random attraction distance between 0 and 200.
    const randomAttraction = getRandomValue(200);

    // Update the settings state with the new random values.
    setSettings(prevSettings => ({
      ...prevSettings,
      repulsionDistance: randomRepulsion,
      attractionDistance: randomAttraction,
    }));
  };
  


  // Handles changes to simulation settings and updates the formula string.
  // @param {string} setting - The name of the setting being changed.
  // @param {number} value - The new value for the setting.
  const handleSettingChange = (setting, value) => {
    // Update settings state with the new value for the specified setting.
    setSettings((prevSettings) => {
      const newSettings = { ...prevSettings, [setting]: value };
      
      // Construct the formula string as JSX with updated settings values.
      // This formula visually represents key simulation parameters.
      const formulaJSX = (
        <span>
          <span >R</span>
          <span >{newSettings.repulsionDistance}{"  "}</span>
          <span >A</span>
          <span >{newSettings.maxSpeed}{"  "}</span>
          <span >L</span>
          <span >{Math.floor(newSettings.lifespan / 30)}{"  "}</span>
          <span >G</span>
          <span >{newSettings.boidsPerSecond}{"  "}</span>
        </span>
      );
      // Update the formula string state with the new JSX representation.
      setFormulaString(formulaJSX);
      
      return newSettings;
    });
  };

  // Function to toggle the pause state of the simulation.
  const togglePause = () => {
    setSettings((prevSettings) => ({ ...prevSettings, isPaused: !prevSettings.isPaused }));
  };


  useEffect(() => {
    const { repulsionDistance, attractionDistance, maxSpeed, lifespan, boidsPerSecond } = settings;  
    const updatedFormulaJSX = (
      <span>
        <span>R</span><span>{repulsionDistance}{"  "}</span>
        <span>A</span><span>{attractionDistance}{"  "}</span>
        <span>L</span><span>{Math.floor(lifespan / 30)}{"  "}</span>
        <span>G</span><span>{boidsPerSecond}{"  "}</span>
      </span>
    );
    // Update the formula string state with the new, updated JSX representation
    setFormulaString(updatedFormulaJSX);
  }, [settings]);


  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let boids = [];
    let animationFrameId;

   const addBoids = (x, y, manual = false) => {
  // This condition allows for manual addition regardless of auto-add or pause state
  // For automatic addition, it checks if auto-add is active and the simulation is not paused
  if (manual || (!settingsRef.current.isPaused)) {
    if (boids.length < settingsRef.current.maxBoids) {
      // When adding manually, use the provided x, y positions
      // For automatic additions (when x and y are undefined), generate random positions
      const posX = x !== undefined ? x : Math.random() * canvas.width;
      const posY = y !== undefined ? y : Math.random() * canvas.height;
      boids.push({
        x: posX,
        y: posY,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        r: 2,
        lifespan: settingsRef.current.lifespan,
      });
    }
  }
};


    const draw = () => {
        ctx.fillStyle = colorScheme === 'default' ? "#3368F6" : "white"; // Change canvas background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        boids.forEach(boid => {
        ctx.fillStyle = colorScheme === 'default' ? "white" : "black"; // Change boid color
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)"; 
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;
       // ctx.filter = 'blur(0px)'; 
        ctx.beginPath();
        ctx.arc(boid.x, boid.y, boid.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const update = () => {
      const currentTime = Date.now();

      if (!settingsRef.current.isPaused) {
        boids.forEach(boid => {
          let dx = 0;
          let dy = 0;
          let d = 0;
          const charge = 1

          boids.forEach(boid2 => {
            if (boid === boid2) return;
            dx = boid2.x - boid.x;
            dy = boid2.y - boid.y;
            d = Math.sqrt(dx * dx + dy * dy);

        

            if (d < settingsRef.current.repulsionDistance) {
              boid.vx -= (dx / d) * charge;
              boid.vy -= (dy / d) * charge;
            } if (d < settingsRef.current.attractionDistance) {
              boid.vx += (dx / d)* charge;
              boid.vy += (dy / d)* charge;
            }
          });

        boid.x += boid.vx;
        boid.y += boid.vy;

        // Boundary checks and position update logic
        if (boid.x < boid.r || boid.x > canvas.width - boid.r) {
          // Reverse velocity and apply a bounce factor (e.g., -0.5)
          boid.vx *= -0.5;
          // Update the position after reversing velocity
          boid.x += boid.vx;
        }

        if (boid.y < boid.r || boid.y > canvas.height - boid.r) {
          // Reverse velocity and apply a bounce factor (e.g., -0.5)
          boid.vy *= -0.5;
          // Update the position after reversing velocity
          boid.y += boid.vy;
        }

        // Apply drag to simulate resistance
        boid.vx *= 0.99;
        boid.vy *= 0.99;

        // Enforce maximum speed limit
        var speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
        if (speed > 5) { // Maximum speed
          boid.vx = (boid.vx / speed) * settingsRef.current.maxSpeed; // Scale velocity to max speed
          boid.vy = (boid.vy / speed) * settingsRef.current.maxSpeed;
        }
        });

        boids = boids.filter(boid => boid.lifespan-- > 0);
      // Automatic boid addition logic
    if ( currentTime - lastAddedTime.current >= 1000 / settingsRef.current.boidsPerSecond) {
      addBoids(undefined, undefined, false); // Attempt to add a boid automatically
      lastAddedTime.current = currentTime; // Reset the timer for automatic addition
    }
  }

      draw();
      animationFrameId = requestAnimationFrame(update);
    };

    update(); // Start the animation loop




    const handleInteraction = (event) => {
      const currentTime = Date.now();
      if (currentTime - lastAddedTime.current < 100 / settingsRef.current.boidsPerSecond) {
        return; // Skip adding a boid if the interval hasn't passed
      }
      lastAddedTime.current = currentTime; // Update the last added time

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      addBoids(x, y, true);
    };

    canvas.addEventListener("mousedown", handleInteraction);
    canvas.addEventListener("mousemove", (event) => {
      if (event.buttons === 1) { // Check if the left mouse button is pressed
        handleInteraction(event);
      }
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener("mousedown", handleInteraction);
      canvas.removeEventListener("mousemove", handleInteraction);
    };
  }, [colorScheme]);


  return (
    <div className="App">
      <ControlPanel
        settings={settings}
        handleSettingChange={handleSettingChange}
        togglePause={togglePause}
        randomizeSettings={randomizeSettings}
        toggleColorScheme={toggleColorScheme}
        colorScheme={colorScheme}
        formulaString={formulaString}
      />
      <canvas ref={canvasRef} className="App-canvas"></canvas>
    </div>
  );
}

export default App;