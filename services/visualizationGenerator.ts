import { SimulationParams } from '../types';

// Simple viridis-like colormap
const viridis = [
  [68, 1, 84], [72, 40, 120], [62, 74, 137], [49, 104, 142], [38, 130, 142],
  [31, 158, 137], [53, 183, 121], [109, 205, 89], [180, 222, 44], [253, 231, 37]
];

function getColor(value: number): string {
  // value is expected to be between 0 and 1
  value = Math.max(0, Math.min(1, value));
  const index = Math.floor(value * (viridis.length - 1));
  const color = viridis[index];
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

function getRgbColor(value: number): number[] {
  value = Math.max(0, Math.min(1, value));
  const index = Math.floor(value * (viridis.length - 1));
  return viridis[index];
}

// A simple pseudo-random noise function for turbulence simulation
function noise(x: number, y: number, seed: number) {
    const n = x * 12.9898 + y * 78.233 + seed * 55.4321;
    return (Math.sin(n) * 43758.5453) % 1;
}


function drawColorBar(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    minVal: number,
    maxVal: number,
    unit: string
) {
    const barWidth = 20;
    const barHeight = height - 80;
    const barX = width - 40;
    const barY = 40;

    const gradient = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
    for (let i = 0; i <= 1; i += 0.1) {
        gradient.addColorStop(1 - i, getColor(i));
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = '#F9FAFB';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${maxVal.toFixed(1)} ${unit}`, barX + barWidth + 5, barY + 12);
    ctx.fillText(`${minVal.toFixed(1)} ${unit}`, barX + barWidth + 5, barY + barHeight);
}


export const generateScalarFieldImage = (
  params: SimulationParams,
  field: 'velocity' | 'pressure' | 'tke'
): string => {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 400;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const { windSpeed } = params.environment;
  
  let minVal = 0;
  let maxVal = 1;
  let unit = '';

  switch(field) {
      case 'velocity':
          minVal = 0;
          maxVal = windSpeed * 1.5;
          unit = 'm/s';
          break;
      case 'pressure':
          minVal = -0.5 * 1.225 * windSpeed * windSpeed;
          maxVal = -minVal / 2;
          unit = 'Pa';
          break;
      case 'tke':
          minVal = 0;
          maxVal = (windSpeed * 0.15)**2;
          unit = 'm²/s²';
          break;
  }

  const leafCenterX = width * 0.3;
  const leafCenterY = height / 2;
  const leafRadius = 40;

  const leafPath = new Path2D();
  leafPath.ellipse(leafCenterX, leafCenterY, leafRadius / 2, leafRadius, Math.PI / 6, 0, 2 * Math.PI);
  
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
          const dx = x - leafCenterX;
          const dy = y - leafCenterY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let val;
          if (field === 'velocity') {
              const wakeEffect = (x > leafCenterX) ? Math.exp(-((Math.abs(dy) / (leafRadius * 2))**2) - (dx / (width*0.7))) : 0;
              const acceleration = 1 - Math.exp(-dist / (leafRadius * 1.5));
              val = windSpeed * acceleration * (1 - 0.9 * wakeEffect);
          } else if (field === 'pressure') {
              const stagnation = Math.exp(-((dist / leafRadius)**2)) * Math.max(0, -dx/leafRadius);
              const lowPressure = Math.exp(-((dist / (leafRadius * 1.5))**2));
              val = maxVal * stagnation - maxVal * 0.7 * lowPressure;
          } else { // tke
              const wakeNoise = (x > leafCenterX) ? noise(x/10, y/10, params.solver.runTime) * Math.exp(-((Math.abs(dy) / (leafRadius * 2.5))**2) - (dx / width)) : 0;
              val = maxVal * wakeNoise;
          }
          
          const normalizedVal = (val - minVal) / (maxVal - minVal);
          const color = getRgbColor(normalizedVal);
          const pixelIndex = (y * width + x) * 4;
          data[pixelIndex] = color[0];
          data[pixelIndex + 1] = color[1];
          data[pixelIndex + 2] = color[2];
          data[pixelIndex + 3] = 255;
      }
  }
  ctx.putImageData(imageData, 0, 0);
  
  // Draw leaf cross-section
  ctx.fillStyle = '#111827';
  ctx.fill(leafPath);
  ctx.strokeStyle = '#F9FAFB';
  ctx.lineWidth = 2;
  ctx.stroke(leafPath);

  drawColorBar(ctx, width, height, minVal, maxVal, unit);

  return canvas.toDataURL('image/jpeg');
};

export const generateMeshImage = (params: SimulationParams): string => {
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 400;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, width, height);
    
    const leafCenterX = width / 2;
    const leafCenterY = height / 2;
    const leafRadius = 80;

    const levels = { coarse: 4, medium: 8, fine: 16 };
    const refinement = levels[params.solver.meshingLevel];
    
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;

    // Coarse background mesh
    const baseGridSize = 40;
    for (let i = 0; i < width; i += baseGridSize) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += baseGridSize) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

    // Refined mesh around object
    ctx.strokeStyle = '#55667d';
    const refinedGridSize = baseGridSize / refinement;
    const refineZone = 1.5 * leafRadius;
    for (let x = leafCenterX - refineZone; x < leafCenterX + refineZone; x+= refinedGridSize) {
        for(let y = leafCenterY - refineZone; y < leafCenterY + refineZone; y+= refinedGridSize) {
            ctx.strokeRect(x, y, refinedGridSize, refinedGridSize);
        }
    }
    
    // Draw leaf outline
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.ellipse(leafCenterX, leafCenterY, leafRadius / 2, leafRadius, Math.PI / 6, 0, 2 * Math.PI);
    ctx.fill();

    return canvas.toDataURL('image/jpeg');
}

export const generateStreamlinesData = (params: SimulationParams) => {
    const streamlines = [];
    const numLines = 30;
    const leafInfluenceRadius = 80;
    const windSpeed = params.environment.windSpeed;
    
    const maxVelocity = windSpeed * 1.5;

    for (let i = 0; i < numLines; i++) {
        const startY = (i / (numLines - 1)) * 400 - 200; // from -200 to 200
        const distFromCenter = Math.abs(startY);
        
        // Lines closer to the center are deflected more
        const deflection = distFromCenter < leafInfluenceRadius 
            ? Math.pow(1 - (distFromCenter / leafInfluenceRadius), 2) * 80 * (startY > 0 ? -1 : 1)
            : 0;
        
        const midY = startY + deflection / 2;
        const endY = startY + deflection;

        // Velocity is slower in the wake
        const velocity = (distFromCenter < 20) ? windSpeed * 0.3 : windSpeed * (1 + (Math.abs(deflection) / 100));
        const color = getColor(velocity / maxVelocity);
        
        // Slower animation for slower flow
        const duration = 2 + 3 * (1 - velocity / maxVelocity);

        streamlines.push({
            d: `M -300 ${startY} C -100 ${startY}, 100 ${midY}, 300 ${endY}`,
            stroke: color,
            duration: parseFloat(duration.toFixed(2)),
        });
    }
    return streamlines;
};
