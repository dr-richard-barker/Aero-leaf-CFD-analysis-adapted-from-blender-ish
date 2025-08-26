
import React from 'react';
import { SimulationResults, SimulationStatus } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshIcon } from './icons/RefreshIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { MeshIcon } from './icons/MeshIcon';

interface ResultsDashboardProps {
  status: SimulationStatus;
  results: SimulationResults | null;
  onReset: () => void;
}

const LoadingIndicator: React.FC = () => {
    const messages = [
        "Initializing cloud environment...",
        "Meshing fluid domain...",
        "Configuring solver parameters...",
        "Iterating solution (this may take a moment)...",
        "Finalizing calculations...",
        "Post-processing results...",
    ];
    const [message, setMessage] = React.useState(messages[0]);
    
    React.useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 3000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="text-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Simulation in Progress</h2>
            <p className="text-text-secondary">{message}</p>
        </div>
    );
};

const ErrorDisplay: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
        <AlertTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-red-300 mb-2">Simulation Failed</h2>
        <p className="text-red-400 mb-6">An unexpected error occurred. Please check your parameters and try again.</p>
        <button onClick={onReset} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 mx-auto transition-colors">
            <RefreshIcon className="w-5 h-5" />
            Start Over
        </button>
    </div>
);

const ResultsDisplay: React.FC<{ results: SimulationResults; onReset: () => void }> = ({ results, onReset }) => {
    
    // Icons for visualization cards for consistency and clarity
    const VelocityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
    const PressureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3"/><path d="M12 21V3"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="8"/></svg>);
    const StreamlinesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c8 0 13-4 20-4"/><path d="M2 12c8 0 13-4 20-4"/><path d="M2 18c8 0 13-4 20-4"/></svg>);
    const TurbulenceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H3"/><path d="M17 8H7"/><path d="M19 12H5"/><path d="M15 16H9"/><path d="M17 20H7"/></svg>);

    const VisualizationCard: React.FC<{ title: string; imageUrl: string; icon: React.ReactNode; }> = ({ title, imageUrl, icon }) => (
        <div className="bg-surface p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-3">
                <div className="text-accent">{icon}</div>
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            </div>
            <img src={imageUrl} alt={title} className="rounded-md w-full h-auto aspect-video object-cover bg-gray-700" />
        </div>
    );
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-text-primary">Simulation Results</h2>
                <button onClick={onReset} className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-blue-500 flex items-center gap-2 transition-colors">
                    <RefreshIcon className="w-5 h-5" />
                    New Simulation
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-surface p-4 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Drag Coefficient</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={results.dragCoefficient}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#D1D5DB" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#D1D5DB' }} />
                            <YAxis stroke="#D1D5DB" label={{ value: 'Drag Coefficient', angle: -90, position: 'insideLeft', fill: '#D1D5DB', style: { textAnchor: 'middle' } }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} 
                                formatter={(value: number) => value.toFixed(4)}
                            />
                            <Legend wrapperStyle={{ color: '#F9FAFB' }} />
                            <Line type="monotone" dataKey="value" name="Drag Coefficient" stroke="#4CAF50" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-surface p-4 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Lift Force</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={results.liftForce}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#D1D5DB" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#D1D5DB' }} />
                            <YAxis stroke="#D1D5DB" label={{ value: 'Lift Force (N)', angle: -90, position: 'insideLeft', fill: '#D1D5DB', style: { textAnchor: 'middle' } }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                                formatter={(value: number) => value.toFixed(4)}
                             />
                            <Legend wrapperStyle={{ color: '#F9FAFB' }} />
                            <Line type="monotone" dataKey="value" name="Lift Force (N)" stroke="#1976D2" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <h3 className="text-2xl font-bold text-text-primary mb-4">Visualizations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VisualizationCard title="Velocity Plot" imageUrl={results.velocityPlotUrl} icon={<VelocityIcon className="w-6 h-6" />} />
                <VisualizationCard title="Pressure Contour" imageUrl={results.pressureContourUrl} icon={<PressureIcon className="w-6 h-6" />} />
                <VisualizationCard title="Streamlines" imageUrl={results.streamlinesUrl} icon={<StreamlinesIcon className="w-6 h-6" />} />
                <VisualizationCard title="Turbulence Kinetic Energy" imageUrl={results.turbulenceKineticEnergyUrl} icon={<TurbulenceIcon className="w-6 h-6" />} />
                <VisualizationCard title="Mesh Detail" imageUrl={results.meshDetailUrl} icon={<MeshIcon className="w-6 h-6" />} />
            </div>
        </div>
    );
};


const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ status, results, onReset }) => {
  if (status === 'running') {
    return <LoadingIndicator />;
  }
  if (status === 'error') {
    return <ErrorDisplay onReset={onReset} />;
  }
  if (status === 'completed' && results) {
    return <ResultsDisplay results={results} onReset={onReset} />;
  }
  return null;
};

export default ResultsDashboard;
