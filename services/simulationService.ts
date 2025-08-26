
import { SimulationParams, SimulationResults, ForceDataPoint } from '../types';
import { generateScalarFieldImage, generateMeshImage, generateStreamlinesData } from './visualizationGenerator';

// Mock function to generate plausible-looking force data
const generateForceData = (runTime: number, timeStep: number, scale: number, oscillation: number): ForceDataPoint[] => {
  const data: ForceDataPoint[] = [];
  let value = (Math.random() - 0.5) * scale;
  for (let time = 0; time <= runTime; time += timeStep * 10) { // reduce data points
    // Add a sinusoidal component for more realistic oscillation
    const sinusoidal = Math.sin(time * oscillation) * (scale / 5);
    value += (Math.random() - 0.5) * (scale / 10); // simulate noise
    data.push({ time: parseFloat(time.toFixed(2)), value: parseFloat((value + sinusoidal).toFixed(4)) });
  }
  return data;
};

// This function simulates a call to a cloud backend that runs the CFD simulation.
export const runSimulation = (params: SimulationParams): Promise<SimulationResults> => {
  console.log("Starting simulation with params:", params);

  return new Promise((resolve, reject) => {
    // Simulate a network delay and processing time (e.g., 3-5 seconds)
    const simulationDuration = 3000 + Math.random() * 2000;
    
    setTimeout(() => {
      // Simulate a potential failure
      if (Math.random() < 0.05) { // 5% chance of error
        reject(new Error("Cloud simulation service failed unexpectedly."));
        return;
      }
      
      const results: SimulationResults = {
        dragCoefficient: generateForceData(params.solver.runTime, params.solver.timeStep, 0.5, 0.5),
        liftForce: generateForceData(params.solver.runTime, params.solver.timeStep, 0.2, 1.2),
        velocityPlotUrl: generateScalarFieldImage(params, 'velocity'),
        pressureContourUrl: generateScalarFieldImage(params, 'pressure'),
        turbulenceKineticEnergyUrl: generateScalarFieldImage(params, 'tke'),
        meshDetailUrl: generateMeshImage(params),
        streamlinesUrl: '', // This will be populated below
        streamlinesData: generateStreamlinesData(params),
      };

      // Create a static SVG for the 2D streamlines card
      const svg = `<svg viewBox="-300 -200 600 400" xmlns="http://www.w3.org/2000/svg" style="background-color: #1F2937;">
        <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style="stop-color:rgb(75,85,99);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(31,41,55);stop-opacity:1" />
            </radialGradient>
        </defs>
        <rect x="-300" y="-200" width="600" height="400" fill="url(#grad1)" />
        ${results.streamlinesData.map(line => `<path d="${line.d}" fill="none" stroke="${line.stroke}" stroke-width="2"/>`).join('')}
        </svg>`;
      results.streamlinesUrl = `data:image/svg+xml;base64,${btoa(svg)}`;


      console.log("Simulation completed with results:", results);
      resolve(results);
    }, simulationDuration);
  });
};