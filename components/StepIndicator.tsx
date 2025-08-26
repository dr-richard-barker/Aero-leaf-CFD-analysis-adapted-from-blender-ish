
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
}

const steps = [
  "Model Upload",
  "Domain Setup",
  "Environment",
  "Solver Settings",
  "Review & Run",
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, goToStep }) => {
  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-text-primary">Setup Progress</h2>
      <ol className="relative border-l border-border">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={stepNumber} className="mb-8 ml-6">
              <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-surface ${isCompleted ? 'bg-accent' : isCurrent ? 'bg-secondary' : 'bg-gray-700'}`}>
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <span className="text-white font-bold">{stepNumber}</span>
                )}
              </span>
              <button onClick={() => goToStep(stepNumber)} className="text-left">
                <h3 className={`font-medium leading-tight ${isCurrent ? 'text-secondary' : 'text-text-primary'}`}>{label}</h3>
                <p className="text-sm text-text-secondary">Step {stepNumber}</p>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default StepIndicator;
