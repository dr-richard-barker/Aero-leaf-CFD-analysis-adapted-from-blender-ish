
import React, { useState, useCallback } from 'react';
import { SimulationParams, SimulationResults, SimulationStatus } from './types';
import { initialSimulationParams } from './constants';
import { runSimulation } from './services/simulationService';
import { saveParamsToLocalStorage, loadParamsFromLocalStorage } from './services/configService';

import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import Step1_ModelUpload from './components/steps/Step1_ModelUpload';
import Step2_DomainSetup from './components/steps/Step2_DomainSetup';
import Step3_Environment from './components/steps/Step3_Environment';
import Step4_SolverSettings from './components/steps/Step4_SolverSettings';
import Step5_Summary from './components/steps/Step5_Summary';
import ResultsDashboard from './components/ResultsDashboard';
import { LeafIcon } from './components/icons/LeafIcon';
import { SaveIcon } from './components/icons/SaveIcon';
import { LoadIcon } from './components/icons/LoadIcon';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [params, setParams] = useState<SimulationParams>(initialSimulationParams);
  const [status, setStatus] = useState<SimulationStatus>('idle');
  const [results, setResults] = useState<SimulationResults | null>(null);

  const totalSteps = 5;

  const handleParamChange = useCallback(<K extends keyof SimulationParams, V>(
    section: K,
    field: keyof SimulationParams[K],
    value: V
  ) => {
    setParams(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps + 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => {
    if (step > 0 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const handleRunSimulation = async () => {
    setStatus('running');
    setCurrentStep(totalSteps + 1); // Move to the results/loading view
    try {
      const simResults = await runSimulation(params);
      setResults(simResults);
      setStatus('completed');
    } catch (error) {
      console.error("Simulation failed:", error);
      setStatus('error');
    }
  };
  
  const handleReset = () => {
    setCurrentStep(1);
    setParams(initialSimulationParams);
    setStatus('idle');
    setResults(null);
  };

  const handleSaveConfig = () => {
    saveParamsToLocalStorage(params);
    alert('Configuration saved successfully!');
  };

  const handleLoadConfig = () => {
    const loadedParams = loadParamsFromLocalStorage();
    if (loadedParams) {
      setParams(loadedParams);
      setCurrentStep(1); // Reset to first step to review
      setTimeout(() => {
        alert('Configuration loaded. Please review the settings and re-upload your 3D model file if necessary.');
      }, 100);
    } else {
      alert('No saved configuration found or it was corrupted.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1_ModelUpload params={params.model} onParamChange={(field, value) => handleParamChange('model', field, value)} />;
      case 2:
        return <Step2_DomainSetup params={params.domain} onParamChange={(field, value) => handleParamChange('domain', field, value)} />;
      case 3:
        return <Step3_Environment params={params.environment} onParamChange={(field, value) => handleParamChange('environment', field, value)} />;
      case 4:
        return <Step4_SolverSettings 
                  params={params.solver} 
                  onParamChange={(field, value) => handleParamChange('solver', field, value)}
                />;
      case 5:
        return <Step5_Summary params={params} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {status !== 'idle' ? (
          <ResultsDashboard status={status} results={results} onReset={handleReset} modelParams={params.model} />
        ) : (
          <>
            <div className="flex justify-end gap-4 mb-6">
                <button
                    onClick={handleSaveConfig}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-surface text-text-secondary rounded-md border border-border hover:bg-gray-700 hover:text-text-primary transition-colors"
                    aria-label="Save Configuration"
                >
                    <SaveIcon className="w-4 h-4" />
                    <span>Save Configuration</span>
                </button>
                <button
                    onClick={handleLoadConfig}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-surface text-text-secondary rounded-md border border-border hover:bg-gray-700 hover:text-text-primary transition-colors"
                    aria-label="Load Configuration"
                >
                    <LoadIcon className="w-4 h-4" />
                    <span>Load Configuration</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <StepIndicator currentStep={currentStep} totalSteps={totalSteps} goToStep={goToStep} />
              </div>
              <div className="md:col-span-3 bg-surface rounded-lg shadow-lg p-8">
                {renderStepContent()}
                <div className="flex justify-between mt-12 border-t border-border pt-6">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Back
                  </button>
                  {currentStep < totalSteps ? (
                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-blue-500 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleRunSimulation}
                      className="px-6 py-2 bg-accent text-white rounded-md hover:bg-green-600 flex items-center gap-2 transition-colors"
                    >
                      <LeafIcon className="w-5 h-5" />
                      Run Simulation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
