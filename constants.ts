import { SimulationParams } from './types';

export const initialSimulationParams: SimulationParams = {
  model: {
    fileName: null,
    file: null,
    geometryType: 'realistic',
  },
  domain: {
    sizeX: 10,
    sizeY: 5,
    sizeZ: 5,
    inlet: 'front',
    outlet: 'back',
    objectPositionX: 0,
    objectPositionY: 0,
    objectPositionZ: 0,
  },
  environment: {
    windSpeed: 5, // m/s
    windDirection: 0, // degrees
    temperature: 20, // Celsius
    pressure: 101325, // Pa
    airDensity: 1.225, // kg/m^3
    viscosity: 1.81e-5, // Pa·s
  },
  solver: {
    turbulenceModel: 'RANS',
    meshingLevel: 'medium',
    runTime: 10, // seconds
    timeStep: 0.01, // seconds
  },
};