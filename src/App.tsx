import { useState, useCallback } from 'react'; // useCallbackをインポート
import { NodeEditor } from 'rete';
import NodeEditorComponent from './components/NodeEditor';
import Toolbar from './components/Toolbar';
import JsonViewer from './components/JsonViewer';
import EditorPanel from './components/EditorPanel';
import { exportData, importData } from './utils/jsonHandler';
import { Schemes } from './utils/jsonSchema';
import { StartNode, ActionNode, ConditionNode, EndNode, ImageNode } from './components/NodeTypes';

export default function App() {
    const [editor, setEditor] = useState<NodeEditor<Schemes> | null>(null);
    const [jsonData, setJsonData] = useState<string>('// JSONデータがここに表示されます');
    const [selectedNode, setSelectedNode] = useState<Schemes['Node'] | null>(null);
    const [isGridSnapEnabled, setGridSnapEnabled] = useState(true);

    // ▼▼▼ useCallbackで関数をメモ化（安定化）させる ▼▼▼
    const handleNodeSelected = useCallback((node: Schemes['Node'] | null) => {
        setSelectedNode(node);
    }, []); // 依存配列は空なので、この関数は一度しか生成されない

    // ... (addNode, updateNodeData, handleExport, etc. は変更なし) ...
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
    const updateNodeData = (nodeId: string, data: Partial<Schemes['Node']['data']>) => {
        if (!editor) return;

        const node = editor.getNode(nodeId);
        if (node) {
            // ノードのデータを更新
            node.data = { ...node.data, ...data };
            // EditorPanelを再描画するために、selectedNodeの状態を更新
            setSelectedNode({ ...node });
        }
    };
    const handleExport = async () => { if(editor) await exportData(editor) };
    const handleImport = async (file: File) => { if(editor) await importData(editor, file) };
    const clearCanvas = async () => { if(editor) await editor.clear() };

    return (
        <div className="bg-gray-50 p-8 max-w-full min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Rete.js シナリオエディタ</h1>
            <Toolbar
                onAddNode={addNode}
                onExport={handleExport}
                onImport={handleImport}
                onClear={clearCanvas}
                isGridSnapEnabled={isGridSnapEnabled}
                onToggleGridSnap={() => setGridSnapEnabled(prev => !prev)}
            />
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-grow bg-white rounded-lg shadow-lg p-4 relative" style={{ height: '75vh' }}>
                    <NodeEditorComponent
                        setEditor={setEditor}
                        onNodeSelected={handleNodeSelected} // メモ化された関数を渡す
                    />
                </div>
                <div className="w-full md:w-96 flex-shrink-0">
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