
import { SimulationParams, SimulationResults, ForceDataPoint } from '../types';

// Mock function to generate plausible-looking force data
const generateForceData = (runTime: number, timeStep: number, scale: number): ForceDataPoint[] => {
  const data: ForceDataPoint[] = [];
  let value = (Math.random() - 0.5) * scale;
  for (let time = 0; time <= runTime; time += timeStep * 10) { // reduce data points for better chart performance
    value += (Math.random() - 0.5) * (scale / 10); // simulate fluctuations
    data.push({ time: parseFloat(time.toFixed(2)), value: parseFloat(value.toFixed(4)) });
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
        dragCoefficient: generateForceData(params.solver.runTime, params.solver.timeStep, 0.5),
        liftForce: generateForceData(params.solver.runTime, params.solver.timeStep, 0.2),
        velocityPlotUrl: `https://picsum.photos/seed/${Math.random()}/800/400`,
        pressureContourUrl: `https://picsum.photos/seed/${Math.random()}/800/400`,
        streamlinesUrl: `https://picsum.photos/seed/${Math.random()}/800/400`,
        turbulenceKineticEnergyUrl: `https://picsum.photos/seed/${Math.random()}/800/400`,
        meshDetailUrl: `https://picsum.photos/seed/${Math.random()}/800/400`,
      };

      console.log("Simulation completed with results:", results);
      resolve(results);
    }, simulationDuration);
  });
};