import { ClassicPreset, NodeEditor } from 'rete';
import { AreaPlugin } from 'rete-area-plugin';
import { Schemes } from '../App'; 
import { ScenarioData, NodeData, ConnectionData } from './jsonSchema';
import { StartNode, ActionNode, ConditionNode, EndNode, ImageNode } from '../components/NodeTypes';

function getNodeSpecificType(node: Schemes['Node']): 'start' | 'action' | 'condition' | 'end' | 'image' {
    if (node instanceof StartNode) return 'start';
    if (node instanceof ActionNode) return 'action';
    if (node instanceof ConditionNode) return 'condition';
    if (node instanceof EndNode) return 'end';
    if (node instanceof ImageNode) return 'image';
    throw new Error('Unknown node type');
}

export async function exportData(editor: NodeEditor<Schemes>): Promise<any> { // 戻り値の型を一旦anyに
    const area = editor.getPlugin(AreaPlugin);
    const nodes: any[] = []; // 型を一旦anyに
    const connections: ConnectionData[] = [];

    for (const node of editor.getNodes()) {
        const pos = area.nodeViews.get(node.id)?.position;
        nodes.push({
            id: node.id,
            label: node.label,
            type: getNodeSpecificType(node),
            data: node.data, // node.dataを直接保存
            x: pos?.x || 0,
            y: pos?.y || 0
        });
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

export async function importData(editor: NodeEditor<Schemes>, data: any) { // dataの型を一旦anyに
    await editor.clear();
    const area = editor.getPlugin(AreaPlugin);

    for (const nodeData of data.nodes) {
        let node: Schemes['Node'];
        switch (nodeData.type) {
            case 'start': node = new StartNode(); break;
            case 'action': node = new ActionNode(nodeData.data?.text); break;
            case 'condition': node = new ConditionNode(nodeData.data?.text); break;
            case 'end': node = new EndNode(); break;
            case 'image': node = new ImageNode(nodeData.data?.url); break;
            default: continue; // 不明なタイプはスキップ
        }
        node.id = nodeData.id;
        
        await editor.addNode(node);
        await area.translate(node.id, { x: nodeData.x, y: nodeData.y });
    }

    for (const connData of data.connections) {
        const source = editor.getNode(connData.source);
        const target = editor.getNode(connData.target);
        
        if (source && target) {
            const conn = new ClassicPreset.Connection(source, connData.sourceOutput as any, target, connData.targetInput as any);
            conn.id = connData.id;
            await editor.addConnection(conn);
        }
    }
}
