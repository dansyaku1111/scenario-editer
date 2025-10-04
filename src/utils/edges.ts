import { ClassicPreset } from 'rete';
import { Schemes } from '../utils/jsonSchema';

/**
 * Edge Type Definitions
 * Different types of edges for different purposes
 */
export type EdgeType = 'control' | 'data' | 'relation' | 'reference' | 'annotation';

/**
 * Edge Metadata Interface
 */
export interface EdgeMetadata {
  label?: string;
  weight?: number;
  condition?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  bidirectional?: boolean;
  edgeType?: EdgeType;
  color?: string;
  description?: string;
}

/**
 * Extended Connection class with metadata
 */
export class MetadataConnection extends ClassicPreset.Connection<
  Schemes['Node'],
  Schemes['Node']
> {
  metadata: EdgeMetadata;

  constructor(
    source: Schemes['Node'],
    sourceOutput: string,
    target: Schemes['Node'],
    targetInput: string,
    metadata?: EdgeMetadata
  ) {
    super(source, sourceOutput, target, targetInput);
    this.metadata = metadata || {};
  }
}

/**
 * Edge style configuration based on type
 */
export const edgeStyles: Record<EdgeType, { 
  color: string; 
  width: number; 
  style: 'solid' | 'dashed' | 'dotted';
  description: string;
}> = {
  control: {
    color: '#FFD700',
    width: 3,
    style: 'solid',
    description: 'Execution flow and trigger propagation'
  },
  data: {
    color: '#4ECDC4',
    width: 2,
    style: 'solid',
    description: 'Data value transmission'
  },
  relation: {
    color: '#FF6B9D',
    width: 2,
    style: 'dashed',
    description: 'Character/entity relationships'
  },
  reference: {
    color: '#95A5A6',
    width: 1,
    style: 'dotted',
    description: 'Reference only, no execution flow'
  },
  annotation: {
    color: '#BDC3C7',
    width: 1,
    style: 'dotted',
    description: 'Designer comments and notes'
  }
};

/**
 * Get edge type from socket name
 */
export function inferEdgeType(socketName: string): EdgeType {
  if (socketName === 'event' || socketName === 'exec') {
    return 'control';
  }
  if (socketName === 'entity' || socketName.includes('relation')) {
    return 'relation';
  }
  if (socketName.includes('ref')) {
    return 'reference';
  }
  if (socketName.includes('note') || socketName.includes('comment')) {
    return 'annotation';
  }
  return 'data';
}

/**
 * Create a connection with automatic type inference
 */
export function createConnection(
  source: any,
  sourceOutput: string,
  target: any,
  targetInput: string,
  metadata?: Partial<EdgeMetadata>
): MetadataConnection {
  const outputs = source.outputs || {};
  const output = outputs[sourceOutput];
  const socketName = output && 'socket' in output ? output.socket.name : '';
  
  const inferredType = inferEdgeType(socketName);
  const defaultStyle = edgeStyles[inferredType];
  
  const fullMetadata: EdgeMetadata = {
    edgeType: inferredType,
    style: defaultStyle.style,
    color: defaultStyle.color,
    ...metadata
  };

  return new MetadataConnection(source, sourceOutput, target, targetInput, fullMetadata);
}

/**
 * Get edge style CSS properties
 */
export function getEdgeStyleProps(metadata: EdgeMetadata): {
  strokeWidth: number;
  stroke: string;
  strokeDasharray?: string;
} {
  const type = metadata.edgeType || 'data';
  const baseStyle = edgeStyles[type];
  
  let strokeDasharray: string | undefined;
  const style = metadata.style || baseStyle.style;
  
  if (style === 'dashed') {
    strokeDasharray = '10,5';
  } else if (style === 'dotted') {
    strokeDasharray = '2,3';
  }

  return {
    strokeWidth: baseStyle.width,
    stroke: metadata.color || baseStyle.color,
    strokeDasharray
  };
}
