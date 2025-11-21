// Supported icon types for the visualization
export type IconType = 
  | 'user' 
  | 'server' 
  | 'database' 
  | 'cloud' 
  | 'laptop' 
  | 'smartphone' 
  | 'code' 
  | 'lock' 
  | 'globe' 
  | 'api' 
  | 'cache' 
  | 'queue' 
  | 'firewall'
  | 'storage';

export interface Node {
  id: string;
  label: string;
  type: IconType;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
}

export interface Packet {
  from: string; // Node ID
  to: string; // Node ID
  label?: string;
  color?: string; // Hex code or tailwind color name
}

export interface Step {
  id: number;
  title: string;
  description: string;
  activeNodeIds: string[]; // Nodes to highlight in this step
  packets: Packet[]; // Data moving in this step
}

export interface AnimationScript {
  title: string;
  description: string;
  nodes: Node[];
  steps: Step[];
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}
