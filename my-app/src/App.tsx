import { useState } from 'react';
import { NodeEditor, ClassicPreset } from 'rete';
import NodeEditorComponent from './components/NodeEditor';
import Toolbar from './components/Toolbar';
import JsonViewer from './components/JsonViewer';
import { StartNode, ActionNode, ConditionNode, EndNode, ImageNode } from './components/NodeTypes';
import { exportData, importData } from './utils/jsonHandler';
import EditorPanel from './components/EditorPanel';

// Define the schemes for the editor
export type Schemes = GetSchemes<
    (ClassicPreset.Node & { data: { [key: string]: any } }),
    ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;

// Define GetSchemes type locally to avoid import issues
export type GetSchemes<T, U> = T extends { type: string }
  ? U extends { type: string }
    ? {
        Node: T;
        Connection: U;
      }
    : never
  : never;


export default function App() {
    const [editor, setEditor] = useState<NodeEditor<Schemes> | null>(null);
    const [jsonData, setJsonData] = useState<string>('// JSONデータがここに表示されます');
    const [selectedNode, setSelectedNode] = useState<Schemes['Node'] | null>(null);
    const [gridEnabled, setGridEnabled] = useState<boolean>(true);
    const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
    const [gridSize, setGridSize] = useState<number>(16);

    const addNode = async (type: 'start' | 'action' | 'condition' | 'end' | 'image') => {
        if (!editor) return;
        let node;
        switch (type) {
            case 'start': node = new StartNode(); break;
            case 'action': node = new ActionNode('New Action'); break;
            case 'condition': node = new ConditionNode('New Condition'); break;
            case 'end': node = new EndNode(); break;
            case 'image': node = new ImageNode(); break;
        }
        await editor.addNode(node);
    };

    const updateNodeData = (nodeId: string, newData: { [key: string]: any }) => {
        if (!editor) return;
        const node = editor.getNode(nodeId);
        if (node) {
            node.data = { ...node.data, ...newData };
            editor.getPlugin('rete-area-plugin').update('node', nodeId);
            setSelectedNode({ ...node });
        }
    };

    const handleExport = async () => {
        if (!editor) return;
        const data = await exportData(editor);
        setJsonData(JSON.stringify(data, null, 2));
    };

    const handleImport = async (file: File) => {
        if (!editor) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result as string);
                await importData(editor, data);
                setJsonData(JSON.stringify(data, null, 2));
            } catch (error) {
                alert('JSONファイルの読み込みに失敗しました: ' + (error as Error).message);
            }
        };
        reader.readAsText(file);
    };

    const clearCanvas = async () => {
        if (!editor) return;
        await editor.clear();
        setSelectedNode(null);
        setJsonData('// キャンバスがクリアされました');
    }

    return (
        <div className="bg-gray-50 p-8 max-w-full min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Rete.js シナリオエディタ</h1>
            <Toolbar
                onAddNode={addNode}
                onExport={handleExport}
                onImport={handleImport}
                onClear={clearCanvas}
                gridEnabled={gridEnabled}
                onGridEnabledChange={setGridEnabled}
                snapEnabled={snapEnabled}
                onSnapEnabledChange={setSnapEnabled}
                gridSize={gridSize}
                onGridSizeChange={setGridSize}
            />
            <div className="flex gap-4 mt-4">
                <div className="flex-grow bg-white rounded-lg shadow-lg p-4">
                    <NodeEditorComponent
                        setEditor={setEditor}
                        onNodeSelected={setSelectedNode}
                        gridEnabled={gridEnabled}
                        snapEnabled={snapEnabled}
                        gridSize={gridSize}
                    />
                </div>
                <div className="w-96 flex-shrink-0">
                    <EditorPanel
                        node={selectedNode}
                        onUpdate={updateNodeData}
                    />
                </div>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800">JSON出力</h2>
                <JsonViewer data={jsonData} />
            </div>
        </div>
    );
}
