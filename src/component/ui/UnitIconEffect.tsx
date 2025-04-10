"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UnitIconEffectProps {
  size?: number;
  rectangleWidth?: number;
  rectangleHeight?: number;
  circleRadius?: number;
  show: boolean;
  onComplete?: () => void;
}

export const UnitIconEffect = ({
  size = 160,
  rectangleWidth = 6,
  rectangleHeight = 24,
  circleRadius = 70,
  show,
  onComplete,
}: UnitIconEffectProps) => {
  const [phase, setPhase] = useState<
    "initial" | "appear" | "rotate" | "scatter" | "hidden"
  >("initial");
  const [rectangles, setRectangles] = useState<
    { angle: number; opacity: number; distance: number; rotation: number }[]
  >([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const rectangleCount = 12;

  // Helper to safely clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  // Create initial rectangle positions
  useEffect(() => {
    const initialRectangles = Array.from({ length: rectangleCount }).map(
      (_, i) => ({
        angle: (i * 360) / rectangleCount,
        opacity: 0,
        distance: circleRadius,
        rotation: 0,
      }),
    );
    setRectangles(initialRectangles);
  }, [circleRadius, rectangleCount]);

  // Reset animation when show becomes false
  useEffect(() => {
    if (!show && phase !== "initial" && phase !== "hidden") {
      setPhase("hidden");
    }
  }, [show, phase]);

  // Start animation sequence when show becomes true
  useEffect(() => {
    if (show && phase === "initial") {
      setPhase("appear");
    }
  }, [show, phase]);

  // Handle the 'appear' phase
  useEffect(() => {
    if (phase !== "appear") return;

    // Clear any existing timeouts
    clearAllTimeouts();

    console.log("Animation phase: APPEAR - showing rectangles in 0.5s");

    let delay = 0;
    const totalAppearTime = 500; // Exactly 0.5 seconds for all rectangles
    const appearDuration = totalAppearTime / rectangleCount;

    // Counter to track how many rectangles have appeared
    let appearedRectangles = 0;

    // Create a timeout for each rectangle appearance
    for (let index = 0; index < rectangleCount; index++) {
      const timeout = setTimeout(() => {
        setRectangles((prevRectangles) => {
          const newRectangles = [...prevRectangles];
          newRectangles[index] = {
            ...newRectangles[index],
            opacity: 1,
          };
          return newRectangles;
        });

        appearedRectangles++;

        // If this is the last rectangle, schedule the next phase
        if (appearedRectangles === rectangleCount) {
          console.log("All rectangles have appeared, preparing to rotate");
          const nextPhaseTimeout = setTimeout(() => {
            console.log("Starting rotation phase");
            setPhase("rotate");
          }, 100); // Small delay after the last rectangle appears
          timeoutsRef.current.push(nextPhaseTimeout);
        }
      }, delay);

      timeoutsRef.current.push(timeout);
      delay += appearDuration;
    }

    return clearAllTimeouts;
  }, [phase, rectangleCount, clearAllTimeouts]);

  // State to track container rotation (for rotating the entire wheel as a unit)
  const [containerRotation, setContainerRotation] = useState(0);

  // Handle the 'rotate' phase
  useEffect(() => {
    if (phase !== "rotate") return;

    // Clear any existing timeouts
    clearAllTimeouts();

    console.log(
      "Animation phase: ROTATE - rotating entire container by 180 degrees",
    );

    // Rotate the entire container rather than individual rectangles
    setContainerRotation((prev) => prev + 180);

    // Schedule the next phase after rotation duration
    const rotationDuration = 1000; // 1 second for half rotation
    const scatterStartTimeout = setTimeout(() => {
      console.log("Rotation complete, moving to SCATTER phase");
      setPhase("scatter");
    }, rotationDuration);

    timeoutsRef.current.push(scatterStartTimeout);

    return clearAllTimeouts;
  }, [phase, clearAllTimeouts]);

  // Handle the 'scatter' phase
  useEffect(() => {
    if (phase !== "scatter") return;

    // Clear any existing timeouts
    clearAllTimeouts();

    console.log(
      "Animation phase: SCATTER - rectangles moving outward and fading",
    );

    // Apply scatter effect to all rectangles simultaneously
    setRectangles((prevRectangles) =>
      prevRectangles.map((rect) => ({
        ...rect,
        distance: circleRadius * 2.5, // Scatter outward
        opacity: 0, // Fade out
      })),
    );

    // Schedule hiding after scatter animation completes
    const scatterDuration = 600; // 0.6 seconds for scattering
    const hideTimeout = setTimeout(() => {
      console.log("Scatter complete, hiding elements");
      setPhase("hidden");
    }, scatterDuration);

    timeoutsRef.current.push(hideTimeout);

    return clearAllTimeouts;
  }, [phase, circleRadius, clearAllTimeouts]);

  // Add a new useEffect to specifically handle the completion callback when phase changes to hidden
  useEffect(() => {
    if (phase === "hidden") {
      console.log("Animation complete, calling completion handler");
      if (onComplete) {
        console.log("Animation complete, calling completion handler");
        onComplete();
      }

      // If not showing, also transition to initial state
      if (!show) {
        // Reset rectangle properties to initial state
        setRectangles((prevRectangles) =>
          prevRectangles.map((rect, i) => ({
            angle: (i * 360) / rectangleCount,
            opacity: 0,
            distance: circleRadius,
            rotation: 0,
          })),
        );

        // Reset container rotation for next animation cycle
        setContainerRotation(0);

        // Reset phase to initial to prepare for next animation
        setPhase("initial");
      }
    }
  }, [phase, show, onComplete, circleRadius, rectangleCount]);

  // If not showing and already hidden, return null
  if (!show && phase === "hidden") {
    return null;
  }

  const halfSize = size / 2;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) rotate(${containerRotation}deg)`,
        transition: phase === "rotate" ? "transform 1s" : "none",
      }}
    >
      {rectangles.map((rect, i) => {
        // Calculate position based on angle, distance and rotation
        const currentAngle = rect.angle + rect.rotation;
        const radians = (currentAngle * Math.PI) / 180;
        const x = halfSize + Math.cos(radians) * rect.distance;
        const y = halfSize + Math.sin(radians) * rect.distance;

        // Calculate rotation to point outward from center - always perpendicular to the radius
        const rectRotation = currentAngle + 90; // Adding 90 degrees to point outward

        return (
          <div
            key={i}
            className="absolute transition-all"
            style={{
              width: rectangleWidth,
              height: rectangleHeight,
              left: x - rectangleWidth / 2,
              top: y - rectangleHeight / 2,
              opacity: rect.opacity,
              backgroundColor: "white",
              transform: `rotate(${rectRotation}deg)`,
              transition:
                phase === "appear"
                  ? "opacity 0.1s"
                  : phase === "rotate"
                    ? "left 1s, top 1s, transform 1s"
                    : "opacity 0.6s, left 0.6s, top 0.6s",
              borderRadius: "2px",
              boxShadow: "0 0 4px rgba(255, 255, 255, 0.8)",
            }}
          />
        );
      })}
    </div>
  );
};
