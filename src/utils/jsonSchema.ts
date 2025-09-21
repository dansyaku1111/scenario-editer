export interface NodeData {
    id: string;
    label: string;
    type: 'start' | 'action' | 'condition' | 'end' | 'image'; // imageを追加
    data?: {
        text?: string;
        url?: string; // urlプロパティを追加
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
}

export interface ScenarioData {
    nodes: NodeData[];
    connections: ConnectionData[];
    metadata: {
        version: string;
        [key: string]: any;
    };
}
