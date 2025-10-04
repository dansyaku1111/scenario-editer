import { ClassicPreset, NodeEditor } from 'rete';
import { AreaPlugin } from 'rete-area-plugin';
import { ScenarioData, NodeData, ConnectionData } from './jsonSchema';
import { 
    StartNode, 
    ActionNode, 
    ConditionNode, 
    EndNode, 
    ImageNode, 
    ContentNode,
    CharacterNode,
    EventNode,
    TimerNode,
    ExternalResourceNode
} from '../components/NodeTypes';

function getNodeSpecificType(node: any): NodeData['type'] {
    if (node instanceof StartNode) return 'start';
    if (node instanceof ActionNode) return 'action';
    if (node instanceof ConditionNode) return 'condition';
    if (node instanceof EndNode) return 'end';
    if (node instanceof ImageNode) return 'image';
    if (node instanceof ContentNode) return 'content';
    if (node instanceof CharacterNode) return 'character';
    if (node instanceof EventNode) return 'event';
    if (node instanceof TimerNode) return 'timer';
    if (node instanceof ExternalResourceNode) return 'external-resource';
    throw new Error('Unknown node type');
}

export async function exportData(editor: NodeEditor<any>, area?: any): Promise<any> {
    console.log('Export function called with area:', area);
    
    // areaが引数として渡されていない場合は、以前の方法で取得を試みる
    if (!area) {
        console.log('Area not provided as argument, attempting to retrieve from editor');
        // 複数の方法でAreaPluginを取得を試みる
        
        // 方法1: getPlugin メソッドを使用
        if (typeof (editor as any).getPlugin === 'function') {
            area = (editor as any).getPlugin(AreaPlugin);
            console.log('AreaPlugin obtained via getPlugin:', area);
        }
        
        // 方法2: plugins プロパティから直接取得
        if (!area && (editor as any).plugins) {
            const plugins = (editor as any).plugins;
            if (plugins instanceof Map) {
                area = plugins.get(AreaPlugin);
            } else if (Array.isArray(plugins)) {
                area = plugins.find((p: any) => p instanceof AreaPlugin);
            }
            console.log('AreaPlugin obtained via plugins property:', area);
        }
        
        // 方法3: _plugins プロパティから取得（内部API）
        if (!area && (editor as any)._plugins) {
            const plugins = (editor as any)._plugins;
            if (plugins instanceof Map) {
                for (const [key, plugin] of plugins.entries()) {
                    if (plugin instanceof AreaPlugin || plugin.constructor.name === 'AreaPlugin') {
                        area = plugin;
                        break;
                    }
                }
            }
            console.log('AreaPlugin obtained via _plugins property:', area);
        }
    }
    
    if (!area) {
        console.warn('AreaPlugin not found, node positions will default to (0, 0)');
    } else {
        console.log('Using area plugin:', area);
        console.log('Area has nodeViews:', !!area.nodeViews);
        if (area.nodeViews) {
            console.log('Number of nodeViews:', area.nodeViews.size);
        }
    }
    
    const nodes: any[] = [];
    const connections: ConnectionData[] = [];

    for (const node of editor.getNodes()) {
        let x = 0;
        let y = 0;
        
        if (area && area.nodeViews) {
            const nodeView = area.nodeViews.get(node.id);
            if (nodeView && nodeView.position) {
                x = nodeView.position.x || 0;
                y = nodeView.position.y || 0;
                console.log(`Node ${node.id} (${node.label}) position:`, x, y);
            } else {
                console.warn(`Node view not found for ${node.id}`);
            }
        }
        
        const nodeData: any = {
            id: node.id,
            label: node.label,
            type: getNodeSpecificType(node),
            x: x,
            y: y
        };
        
        // Add data if it exists
        if ('data' in node && node.data) {
            nodeData.data = node.data;
        }
        
        nodes.push(nodeData);
    }

    for (const conn of editor.getConnections()) {
        connections.push({
            id: conn.id,
            source: conn.source,
            sourceOutput: conn.sourceOutput,
            target: conn.target,
            targetInput: conn.targetInput
        });
    }
    
    const data = {
        nodes,
        connections,
        metadata: { version: "2.0.0", exported_at: new Date().toISOString() }
    };

    console.log('Exporting data:', data);
    console.log('Number of nodes:', data.nodes.length);
    console.log('Number of connections:', data.connections.length);

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenario_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return data;
}

export async function importData(editor: NodeEditor<any>, area: any, fileOrData: File | any) {
    let data: any;
    
    console.log('Import started, received:', fileOrData);
    
    // Fileオブジェクトの場合は読み込んでパース
    if (fileOrData instanceof File) {
        console.log('Reading file:', fileOrData.name);
        const text = await fileOrData.text();
        console.log('File content (first 200 chars):', text.substring(0, 200));
        try {
            data = JSON.parse(text);
            console.log('Parsed JSON successfully:', data);
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            throw new Error('Invalid JSON file');
        }
    } else {
        // すでにパース済みのデータの場合
        data = fileOrData;
        console.log('Using pre-parsed data:', data);
    }
    
    // データ構造の検証
    if (!data || typeof data !== 'object') {
        console.error('Invalid data format: not an object', data);
        throw new Error('Invalid data format: expected an object');
    }
    
    console.log('Data structure check:');
    console.log('  - has nodes:', 'nodes' in data);
    console.log('  - nodes is array:', Array.isArray(data.nodes));
    console.log('  - has connections:', 'connections' in data);
    console.log('  - connections is array:', Array.isArray(data.connections));
    
    if (!Array.isArray(data.nodes)) {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format: nodes must be an array');
    }
    
    if (!Array.isArray(data.connections)) {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format: connections must be an array');
    }

    console.log(`Importing ${data.nodes.length} nodes and ${data.connections.length} connections`);

    await editor.clear();

    // ノードを作成
    for (const nodeData of data.nodes) {
        console.log('Creating node:', nodeData.type, nodeData.id);
        let node: any;
        switch (nodeData.type) {
            case 'start': node = new StartNode(nodeData.data); break;
            case 'action': node = new ActionNode(nodeData.data); break;
            case 'condition': node = new ConditionNode(nodeData.data); break;
            case 'end': node = new EndNode(nodeData.data); break;
            case 'image': node = new ImageNode(nodeData.data); break;
            case 'content': node = new ContentNode(nodeData.data); break;
            case 'character': node = new CharacterNode(nodeData.data); break;
            case 'event': node = new EventNode(nodeData.data); break;
            case 'timer': node = new TimerNode(nodeData.data); break;
            case 'external-resource': node = new ExternalResourceNode(nodeData.data); break;
            default: 
                console.warn(`Unknown node type: ${nodeData.type}, skipping`);
                continue;
        }
        node.id = nodeData.id;
        
        await editor.addNode(node);
        if (area) {
            console.log(`Translating node ${node.id} to position:`, nodeData.x, nodeData.y);
            await area.translate(node.id, { x: nodeData.x, y: nodeData.y });
        }
    }

    console.log('All nodes created successfully');

    // 接続を作成
    for (const connData of data.connections) {
        console.log('Creating connection:', connData.source, '->', connData.target);
        const source = editor.getNode(connData.source);
        const target = editor.getNode(connData.target);
        
        if (source && target) {
            try {
                const sourceOutput = (source.outputs as any)[connData.sourceOutput];
                const targetInput = (target.inputs as any)[connData.targetInput];
                
                if (sourceOutput && targetInput) {
                    const conn = new ClassicPreset.Connection(source, connData.sourceOutput as any, target, connData.targetInput as any);
                    conn.id = connData.id;
                    await editor.addConnection(conn);
                } else {
                    console.warn(`Invalid connection: source output or target input not found`, connData);
                }
            } catch (error) {
                console.warn(`Failed to create connection:`, connData, error);
            }
        } else {
            console.warn(`Connection skipped: source or target node not found`, connData);
        }
    }
    
    console.log('Import completed successfully');
}
