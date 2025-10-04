import { ClassicPreset } from 'rete';

/**
 * Socket Type Definitions
 * Sockets define the connection points (input/output) for nodes
 */

// Control Flow Socket - for execution flow
export const execSocket = new ClassicPreset.Socket('event');

// Data Type Sockets
export const boolSocket = new ClassicPreset.Socket('bool');
export const numberSocket = new ClassicPreset.Socket('number');
export const stringSocket = new ClassicPreset.Socket('string');
export const contentSocket = new ClassicPreset.Socket('content'); // Rich text/Markdown
export const imageSocket = new ClassicPreset.Socket('image');
export const entitySocket = new ClassicPreset.Socket('entity'); // Character/Organization reference
export const listSocket = new ClassicPreset.Socket('list');
export const metaSocket = new ClassicPreset.Socket('meta'); // JSON structure
export const timeSocket = new ClassicPreset.Socket('time'); // Timestamp/Duration

/**
 * Socket Configuration Interface
 * Defines metadata and constraints for sockets
 */
export interface SocketConfig {
  id: string;
  label: string;
  type: 'event' | 'bool' | 'number' | 'string' | 'content' | 'image' | 'entity' | 'list' | 'meta' | 'time';
  direction: 'input' | 'output';
  multiple?: boolean; // Allow multiple connections
  required?: boolean; // Required connection
  constraints?: {
    enum?: string[];
    pattern?: string;
    min?: number;
    max?: number;
  };
  description?: string;
}

/**
 * Get socket instance by type
 */
export function getSocketByType(type: SocketConfig['type']): ClassicPreset.Socket {
  switch (type) {
    case 'event': return execSocket;
    case 'bool': return boolSocket;
    case 'number': return numberSocket;
    case 'string': return stringSocket;
    case 'content': return contentSocket;
    case 'image': return imageSocket;
    case 'entity': return entitySocket;
    case 'list': return listSocket;
    case 'meta': return metaSocket;
    case 'time': return timeSocket;
    default: return execSocket;
  }
}

/**
 * Socket compatibility checker
 * Determines if two sockets can be connected
 */
export function isSocketCompatible(
  outputSocket: ClassicPreset.Socket,
  inputSocket: ClassicPreset.Socket
): boolean {
  // Same type sockets are always compatible
  if (outputSocket.name === inputSocket.name) {
    return true;
  }
  
  // Define compatible socket pairs
  const compatibilityMap: Record<string, string[]> = {
    'string': ['content'], // String can connect to content
    'content': ['string'], // Content can connect to string
    'number': ['string'], // Number can be converted to string
    'bool': ['string', 'number'], // Bool can be converted
    'entity': ['string', 'meta'], // Entity can provide ID or full data
    'list': ['meta'], // List can be treated as meta
    'time': ['string', 'number'], // Time can be string or timestamp
  };
  
  const compatibleTypes = compatibilityMap[outputSocket.name] || [];
  return compatibleTypes.includes(inputSocket.name);
}

/**
 * Socket visual configuration
 * Colors and icons for different socket types
 */
export const socketStyles: Record<string, { color: string; icon: string }> = {
  event: { color: '#FFD700', icon: '⚡' }, // Gold
  bool: { color: '#FF6B6B', icon: '🔀' }, // Red
  number: { color: '#4ECDC4', icon: '🔢' }, // Teal
  string: { color: '#95E1D3', icon: '✏️' }, // Mint
  content: { color: '#F38181', icon: '📝' }, // Pink
  image: { color: '#AA96DA', icon: '🖼️' }, // Purple
  entity: { color: '#FCBAD3', icon: '🔗' }, // Rose
  list: { color: '#A8D8EA', icon: '📋' }, // Sky Blue
  meta: { color: '#FFA07A', icon: '⚙️' }, // Light Salmon
  time: { color: '#DDA15E', icon: '⏰' }, // Bronze
};
