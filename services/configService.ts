
import { SimulationParams } from '../types';

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
 * Loads simulation parameters from the browser's localStorage.
 * @returns A SimulationParams object if found and valid, otherwise null.
 */
export const loadParamsFromLocalStorage = (): SimulationParams | null => {
  try {
    const paramsString = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!paramsString) {
      return null;
    }

    const parsedParams = JSON.parse(paramsString);

    // Basic validation to ensure the loaded object has the expected structure
    if (!parsedParams.model || !parsedParams.domain || !parsedParams.environment || !parsedParams.solver) {
      throw new Error("Invalid configuration format found in localStorage.");
    }

    // Ensure the non-serializable 'file' property is null after loading
    parsedParams.model.file = null;

    return parsedParams as SimulationParams;
  } catch (error) {
    console.error('Failed to load or parse configuration from localStorage:', error);
    // If parsing fails, the stored data might be corrupted, so we clear it.
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    return null;
  }
};
