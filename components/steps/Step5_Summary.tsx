
import React from 'react';
import { SimulationParams } from '../../types';
import SimulationSummary from '../SimulationSummary';

interface Step5Props {
  params: SimulationParams;
}

const Step5_Summary: React.FC<Step5Props> = ({ params }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-text-primary">5. Review & Run</h2>
      <p className="text-text-secondary mb-6">Please review all simulation parameters before proceeding. This is the final step before running the analysis.</p>
      <SimulationSummary params={params} />
    </div>
  );
};

export default Step5_Summary;
