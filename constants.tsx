import React from 'react';
import { 
  User, Server, Database, Cloud, Laptop, Smartphone, Code, Lock, Globe, 
  Network, Save, Layers, ShieldCheck, HardDrive, Box
} from 'lucide-react';
import { IconType } from './types';

export const ICON_MAP: Record<IconType, React.FC<{ className?: string }>> = {
  user: User,
  server: Server,
  database: Database,
  cloud: Cloud,
  laptop: Laptop,
  smartphone: Smartphone,
  code: Code,
  lock: Lock,
  globe: Globe,
  api: Network,
  cache: Layers,
  queue: Box,
  firewall: ShieldCheck,
  storage: HardDrive
};

export const SAMPLE_PROMPTS = [
  "How HTTPS works handshake process",
  "OAuth 2.0 Authorization Code Flow",
  "Kubernetes Pod deployment lifecycle",
  "CDN content delivery mechanism"
];

export const SYSTEM_INSTRUCTION = `
You are a Technical Animation Director. Your goal is to visualize complex technical concepts into a clear, step-by-step 2D animation script.

**Input:** A user will provide a technical topic or a URL to a blog post.
**Output:** You must return a valid JSON object strictly matching the schema defined below.

**Grid System:**
The canvas is a 100x100 grid. 
- x=0 is left, x=100 is right.
- y=0 is top, y=100 is bottom.
- Place nodes logically. For example, Users usually on the left/top, Servers/Databases on the right/bottom.
- Avoid overlapping nodes.

**Icons:**
Only use these icon keys: 'user', 'server', 'database', 'cloud', 'laptop', 'smartphone', 'code', 'lock', 'globe', 'api', 'cache', 'queue', 'firewall', 'storage'.

**Schema:**
{
  "title": "Short Title",
  "description": "Brief summary",
  "nodes": [
    { "id": "n1", "label": "Client", "type": "user", "x": 10, "y": 50 }
  ],
  "steps": [
    {
      "id": 1,
      "title": "Initialization",
      "description": "The client initiates a request...",
      "activeNodeIds": ["n1"],
      "packets": [
        { "from": "n1", "to": "n2", "label": "SYN", "color": "#3b82f6" }
      ]
    }
  ]
}

**Rules:**
1. Break the process down into 5-10 granular steps.
2. Ensure every 'packet' has a valid 'from' and 'to' node ID that exists in 'nodes'.
3. Use short, punchy labels for packets (e.g., "JSON", "ACK", "Token").
4. If the user provides a URL, use Google Search to find the technical details of that specific link if you cannot access it directly, but prioritize the user's specific topic.
`;
