import React, { useEffect, useState, useRef } from 'react';
import { AnimationScript, Node, Packet } from '../types';
import { ICON_MAP } from '../constants';
import { HelpCircle } from 'lucide-react';

interface AnimationStageProps {
  script: AnimationScript;
  currentStepIndex: number;
  isPlaying: boolean;
}

const AnimationStage: React.FC<AnimationStageProps> = ({ script, currentStepIndex, isPlaying }) => {
  const currentStep = script.steps[currentStepIndex];
  const [packets, setPackets] = useState<Packet[]>([]);

  // Reset packets when step changes
  useEffect(() => {
    setPackets([]);
    const timer = setTimeout(() => {
      setPackets(currentStep?.packets || []);
    }, 100); // Small delay to allow cleanup of previous packets
    return () => clearTimeout(timer);
  }, [currentStepIndex, currentStep]);

  const getNodePosition = (id: string) => {
    return script.nodes.find((n) => n.id === id) || { x: 50, y: 50 };
  };

  return (
    <div className="relative w-full aspect-video bg-gray-950 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* Connection Lines (Static for now, could be dynamic based on history) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
          </marker>
        </defs>
        {/* Draw faint lines between all communicating nodes in the entire script to show architecture */}
        {script.steps.flatMap(s => s.packets).map((pkt, idx) => {
           const start = getNodePosition(pkt.from);
           const end = getNodePosition(pkt.to);
           const key = `${pkt.from}-${pkt.to}-${idx}`;
           return (
             <line 
               key={key}
               x1={`${start.x}%`} 
               y1={`${start.y}%`} 
               x2={`${end.x}%`} 
               y2={`${end.y}%`} 
               stroke="#4b5563" 
               strokeWidth="1"
               strokeDasharray="4 4"
             />
           );
        })}
      </svg>

      {/* Active Packets */}
      {packets.map((pkt, idx) => {
        const start = getNodePosition(pkt.from);
        const end = getNodePosition(pkt.to);
        
        return (
          <PacketItem 
            key={`${currentStepIndex}-${idx}`} 
            start={start} 
            end={end} 
            label={pkt.label} 
            color={pkt.color}
          />
        );
      })}

      {/* Nodes */}
      {script.nodes.map((node) => {
        const Icon = ICON_MAP[node.type] as React.FC<{ className?: string }> || HelpCircle;
        const isActive = currentStep?.activeNodeIds.includes(node.id);
        
        return (
          <div
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-500 ease-in-out z-10`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div 
              className={`
                relative p-4 rounded-full border-2 transition-all duration-300
                ${isActive 
                  ? 'bg-gray-800 border-brand-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110' 
                  : 'bg-gray-900 border-gray-700 text-gray-500 scale-100'
                }
              `}
            >
              <Icon className={`w-8 h-8 ${isActive ? 'text-brand-400' : 'text-gray-500'}`} />
              
              {/* Ping effect for active nodes */}
              {isActive && (
                <span className="absolute -inset-1 rounded-full bg-brand-500 opacity-20 animate-ping"></span>
              )}
            </div>
            
            <div className={`
              mt-2 px-2 py-1 rounded text-xs font-mono font-bold tracking-wide transition-colors
              ${isActive ? 'bg-brand-900/50 text-brand-300 border border-brand-800' : 'text-gray-500'}
            `}>
              {node.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Sub-component for the moving packet
const PacketItem: React.FC<{ start: {x:number, y:number}, end: {x:number, y:number}, label?: string, color?: string }> = ({ start, end, label, color }) => {
  const [position, setPosition] = useState(start);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Start animation frame
    const timer1 = setTimeout(() => setOpacity(1), 50);
    const timer2 = setTimeout(() => setPosition(end), 100);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [start, end]);

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-[1500ms] ease-in-out"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        opacity: opacity 
      }}
    >
      <div 
        className="w-4 h-4 rounded-full shadow-lg"
        style={{ backgroundColor: color || '#60a5fa' }}
      ></div>
      {label && (
        <span className="mt-1 text-[10px] font-bold bg-black/80 text-white px-1.5 py-0.5 rounded border border-gray-700 whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
};

export default AnimationStage;
