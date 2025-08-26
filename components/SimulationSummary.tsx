import React from 'react';
import { SimulationParams } from '../types';
import { LeafIcon } from './icons/LeafIcon';
import { CubeIcon } from './icons/CubeIcon';
import { WindIcon } from './icons/WindIcon';
import { CogIcon } from './icons/CogIcon';

interface SummarySectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SummarySection: React.FC<SummarySectionProps> = ({ title, icon, children }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <div className="flex items-center mb-3">
      {icon}
      <h4 className="text-lg font-semibold text-text-primary ml-2">{title}</h4>
    </div>
    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
      {children}
    </dl>
  </div>
);

interface SummaryItemProps {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  className?: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, unit, className = "col-span-1" }) => (
  <div className={`${className} flex flex-col`}>
    <dt className="text-text-secondary truncate">{label}</dt>
    <dd className="font-semibold text-text-primary truncate normal-case">{value ?? 'N/A'} {unit}</dd>
  </div>
);

const MeshingImpactIndicator: React.FC<{ level: 'coarse' | 'medium' | 'fine' }> = ({ level }) => {
  const details = {
    coarse: {
      text: 'Fastest / Low Accuracy',
      className: 'bg-green-500/20 text-green-300',
    },
    medium: {
      text: 'Balanced',
      className: 'bg-blue-500/20 text-blue-300',
    },
    fine: {
      text: 'Slowest / High Accuracy',
      className: 'bg-yellow-500/20 text-yellow-300',
    },
  };

  const { text, className } = details[level];

  return (
    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-normal ${className}`}>
      {text}
    </span>
  );
};


const SimulationSummary: React.FC<{ params: SimulationParams }> = ({ params }) => {
  const { model, domain, environment, solver } = params;

  const getTurbulenceModelDisplay = (model: 'RANS' | 'LES' | 'DES'): string => {
    switch (model) {
      case 'RANS':
        return 'RANS (Reynolds-Averaged Navier-Stokes)';
      case 'LES':
        return 'LES (Large Eddy Simulation)';
      case 'DES':
        return 'DES (Detached Eddy Simulation)';
      default:
        return model;
    }
  };

  return (
    <div className="mt-12 border-t border-border pt-6">
      <h3 className="text-2xl font-bold text-text-primary mb-4">Review Configuration</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SummarySection title="Model" icon={<LeafIcon className="w-5 h-5 text-accent" />}>
          <SummaryItem label="File Name" value={model.fileName || 'Not uploaded'} />
          <SummaryItem label="Geometry" value={model.geometryType} />
        </SummarySection>

        <SummarySection title="Domain" icon={<CubeIcon className="w-5 h-5 text-secondary" />}>
          <SummaryItem label="Size X" value={domain.sizeX} unit="m" />
          <SummaryItem label="Size Y" value={domain.sizeY} unit="m" />
          <SummaryItem label="Size Z" value={domain.sizeZ} unit="m" />
          <SummaryItem label="Inlet" value={domain.inlet} />
          <SummaryItem label="Outlet" value={domain.outlet} />
          <div />
          <SummaryItem label="Object Pos X" value={domain.objectPositionX} unit="m" />
          <SummaryItem label="Object Pos Y" value={domain.objectPositionY} unit="m" />
          <SummaryItem label="Object Pos Z" value={domain.objectPositionZ} unit="m" />
        </SummarySection>

        <SummarySection title="Environment" icon={<WindIcon className="w-5 h-5 text-yellow-400" />}>
          <SummaryItem label="Wind Speed" value={environment.windSpeed} unit="m/s" />
          <SummaryItem label="Wind Direction" value={environment.windDirection} unit="°" />
          <SummaryItem label="Temperature" value={environment.temperature} unit="°C" />
          <SummaryItem label="Pressure" value={environment.pressure} unit="Pa" />
          <SummaryItem label="Density" value={environment.airDensity} unit="kg/m³" />
          <SummaryItem label="Viscosity" value={environment.viscosity} unit="Pa·s" />
        </SummarySection>

        <SummarySection title="Solver" icon={<CogIcon className="w-5 h-5 text-gray-400" />}>
          <SummaryItem label="Turbulence" value={getTurbulenceModelDisplay(solver.turbulenceModel)} className="col-span-2 sm:col-span-3" />
          <div className="col-span-2 flex flex-col">
            <dt className="text-text-secondary truncate">Meshing</dt>
            <dd className="font-semibold text-text-primary truncate normal-case flex items-center">
              <span className="capitalize">{solver.meshingLevel}</span>
              <MeshingImpactIndicator level={solver.meshingLevel} />
            </dd>
          </div>
          <SummaryItem label="Run Time" value={solver.runTime} unit="s" />
          <SummaryItem label="Time Step" value={solver.timeStep} unit="s" />
        {/* FIX: Corrected closing tag for SummarySection component */}
        </SummarySection>
      </div>
    </div>
  );
};

export default SimulationSummary;