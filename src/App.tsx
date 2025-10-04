import { useState, useCallback } from 'react';
import { NodeEditor } from 'rete';
import NodeEditorComponent from './components/NodeEditor';
import Toolbar from './components/Toolbar';
import JsonViewer from './components/JsonViewer';
import EditorPanel from './components/EditorPanel';
import { exportData, importData } from './utils/jsonHandler';
import { Schemes } from './utils/jsonSchema';
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
} from './components/NodeTypes';

export default function App() {
    const [editor, setEditor] = useState<NodeEditor<any> | null>(null);
    const [area, setArea] = useState<any>(null);
    const [jsonData, setJsonData] = useState<string>('// JSONデータがここに表示されます');
    const [selectedNode, setSelectedNode] = useState<any | null>(null);

    // ▼▼▼ useCallbackで関数をメモ化（安定化）させる ▼▼▼
    const handleNodeSelected = useCallback((node: any | null) => {
        setSelectedNode(node);
    }, []); // 依存配列は空なので、この関数は一度しか生成されない
    
    const handleSetEditor = useCallback((newEditor: NodeEditor<any> | null, newArea?: any) => {
        setEditor(newEditor);
        setArea(newArea || null);
    }, []);

    // ... (addNode, updateNodeData, handleExport, etc. は変更なし) ...
    const addNode = async (type: 'start' | 'action' | 'condition' | 'end' | 'image' | 'content' | 'character' | 'event' | 'timer' | 'external-resource') => {
        if (!editor) return;
        let node;
        switch (type) {
            case 'start': node = new StartNode(); break;
            case 'action': node = new ActionNode(); break;
            case 'condition': node = new ConditionNode(); break;
            case 'end': node = new EndNode(); break;
            case 'image': node = new ImageNode(); break;
            case 'content': node = new ContentNode(); break;
            case 'character': node = new CharacterNode(); break;
            case 'event': node = new EventNode(); break;
            case 'timer': node = new TimerNode(); break;
            case 'external-resource': node = new ExternalResourceNode(); break;
        }
        await editor.addNode(node);
    };
    const updateNodeData = (nodeId: string, data: Partial<any>) => {
        if (!editor) return;

        const node = editor.getNode(nodeId);
        if (node && 'data' in node) {
            // ノードのデータを更新
            node.data = { ...node.data, ...data };
            
            // ノードにupdateDataメソッドがあれば呼び出す（Controlを再作成）
            if (typeof (node as any).updateData === 'function') {
                (node as any).updateData(data);
            }
            
            // EditorPanelを再描画
            setSelectedNode({ ...node } as any);
            
            // Rete.jsのビューを更新するために、エディタ全体を再レンダリング
            // これによりImageControlが再描画される
            editor.getNodes().forEach(n => {
                if (n.id === nodeId) {
                    // 強制的にノードビューを更新
                    const event = new CustomEvent('render', { detail: { type: 'node', data: n } });
                    window.dispatchEvent(event);
                }
            });
        }
    };
    const handleExport = async () => { 
        if(editor && area) {
            console.log('Exporting with editor and area:', editor, area);
            await exportData(editor, area);
        } else {
            console.warn('Cannot export: editor or area not available', { editor, area });
        }
    };
    const handleImport = async (file: File) => { 
        if(editor && area) {
            await importData(editor, area, file);
        }
    };
    const clearCanvas = async () => { if(editor) await editor.clear() };

    return (
        <div className="bg-gray-50 p-8 max-w-full min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Rete.js シナリオエディタ</h1>
            <Toolbar
                onAddNode={addNode}
                onExport={handleExport}
                onImport={handleImport}
                onClear={clearCanvas}
            />
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-grow bg-white rounded-lg shadow-lg p-4 relative" style={{ height: '75vh' }}>
                    <NodeEditorComponent
                        setEditor={handleSetEditor}
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