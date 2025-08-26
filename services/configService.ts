import { SimulationParams } from '../types';
import { initialSimulationParams } from '../constants';

const CONFIG_STORAGE_KEY = 'aeroLeafCfdConfig';

/**
 * Saves the simulation parameters to the browser's localStorage.
 * @param params The simulation parameters object to save.
 */
export const saveParamsToLocalStorage = (params: SimulationParams): void => {
  try {
    // Create a copy to avoid mutating the original state object
    const paramsToSave = { ...params };
    // The File object is not serializable, so we exclude it.
    if (paramsToSave.model) {
        paramsToSave.model = { ...paramsToSave.model, file: null };
    }
    const paramsString = JSON.stringify(paramsToSave);
    localStorage.setItem(CONFIG_STORAGE_KEY, paramsString);
  } catch (error) {
    console.error('Failed to save configuration to localStorage:', error);
    alert('Error: Could not save configuration. Your browser might be in private mode or storage is full.');
  }
};

/**
 * Loads simulation parameters from the browser's localStorage, merging with defaults
 * to ensure a complete and valid configuration.
 * @returns A SimulationParams object if found and valid, otherwise null.
 */
export const loadParamsFromLocalStorage = (): SimulationParams | null => {
  try {
    const paramsString = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!paramsString) {
      return null;
    }

    const loadedParams = JSON.parse(paramsString);

    // Deep merge loaded params with initial params to handle missing fields
    // from older saved configurations. This ensures all properties, including
    // meshing level and turbulence model, are present.
    const mergedParams: SimulationParams = {
      model: { ...initialSimulationParams.model, ...(loadedParams.model || {}), file: null },
      domain: { ...initialSimulationParams.domain, ...(loadedParams.domain || {}) },
      environment: { ...initialSimulationParams.environment, ...(loadedParams.environment || {}) },
      solver: { ...initialSimulationParams.solver, ...(loadedParams.solver || {}) },
    };

    return mergedParams;
  } catch (error) {
    console.error('Failed to load or parse configuration from localStorage:', error);
    // If parsing fails, the stored data might be corrupted, so we clear it.
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    return null;
  }
};
