
export interface ModelParams {
  fileName: string | null;
  file: File | null;
  geometryType: 'realistic' | 'simplified';
}

export interface DomainParams {
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  inlet: 'front' | 'left' | 'top';
  outlet: 'back' | 'right' | 'bottom';
}

export interface EnvironmentParams {
  windSpeed: number;
  windDirection: number; // in degrees
  temperature: number; // in Celsius
  pressure: number; // in Pa
  airDensity: number; // in kg/m^3
  viscosity: number; // in Pa·s
}

export interface SolverParams {
  turbulenceModel: 'RANS' | 'LES' | 'DES';
  meshingLevel: 'coarse' | 'medium' | 'fine';
  runTime: number; // in seconds
  timeStep: number; // in seconds
}

export interface SimulationParams {
  model: ModelParams;
  domain: DomainParams;
  environment: EnvironmentParams;
  solver: SolverParams;
}

export interface ForceDataPoint {
  time: number;
  value: number;
}

export interface SimulationResults {
  dragCoefficient: ForceDataPoint[];
  liftForce: ForceDataPoint[];
  velocityPlotUrl: string;
  pressureContourUrl: string;
  streamlinesUrl: string;
  turbulenceKineticEnergyUrl: string;
  meshDetailUrl: string;
}

export type SimulationStatus = 'idle' | 'running' | 'completed' | 'error';