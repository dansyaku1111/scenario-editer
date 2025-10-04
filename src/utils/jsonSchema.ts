import { ClassicPreset } from 'rete';

// Base Node type that includes all possible nodes
export type BaseNode = ClassicPreset.Node;

// Schemes type for Rete.js editor - use flexible types to avoid conflicts
export type Schemes = {
  Node: BaseNode;
  Connection: ClassicPreset.Connection<BaseNode, BaseNode>;
};

export interface NodeData {
    id: string;
    label: string;
    type: 'start' | 'action' | 'condition' | 'end' | 'image' | 'content' | 'character' | 'event' | 'timer' | 'external-resource';
    data?: {
        title?: string;
        text?: string;
        url?: string;
        imageUrl?: string;
        [key: string]: any;
    };
    x: number;
    y: number;
}

export interface ConnectionData {
    id: string;
    source: string;
    sourceOutput: string;
    target: string;
    targetInput: string;
    meta?: {
        label?: string;
        weight?: number;
        condition?: string;
        style?: 'solid' | 'dashed' | 'dotted';
        bidirectional?: boolean;
        edgeType?: 'control' | 'data' | 'relation' | 'reference' | 'annotation';
    };
}

export interface ScenarioData {
    nodes: NodeData[];
    connections: ConnectionData[];
    metadata: {
        version: string;
        [key: string]: any;
    };
}
