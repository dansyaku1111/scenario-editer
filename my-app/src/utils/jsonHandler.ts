import { NodeEditor } from 'rete';
import { Schemes } from '../App';
import { StartNode, ActionNode, ConditionNode, EndNode, ImageNode } from '../components/NodeTypes';

export async function exportData(editor: NodeEditor<Schemes>) {
    const data = editor.toJSON();
    // We can add any custom processing here if needed
    return data;
}

export async function importData(editor: NodeEditor<Schemes>, data: any) {
    await editor.fromJSON(data);

    // This is a workaround to re-create nodes with their correct classes
    // as fromJSON doesn't handle class instances.
    const nodes = editor.getNodes();
    for (const nodeData of nodes) {
        await editor.removeNode(nodeData.id);
        let newNode;
        if (nodeData.label === 'Start') {
            newNode = new StartNode();
        } else if (nodeData.label === 'End') {
            newNode = new EndNode();
        } else if (nodeData.label === 'Image') {
            newNode = new ImageNode();
        } else if (nodeData.label.startsWith('Action')) {
            newNode = new ActionNode(nodeData.label);
        } else if (nodeData.label.startsWith('Condition')) {
            newNode = new ConditionNode(nodeData.label);
        } else {
            // Fallback for other node types
            continue;
        }

        newNode.id = nodeData.id;
        await editor.addNode(newNode);
        await editor.translate(newNode.id, { x: nodeData.position.x, y: nodeData.position.y });
    }

    // Re-create connections
    for (const conn of data.connections) {
        await editor.addConnection(conn);
    }
}
