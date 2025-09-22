import { useEffect, useRef, useState } from 'react';
import { NodeEditor } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactPlugin, Presets as ReactPresets } from 'rete-react-plugin';
import { createRoot, Root } from 'react-dom/client';
import { Schemes } from '../App';
import GridBackground from './GridBackground';

type EditorProps = {
  setEditor: (editor: NodeEditor<Schemes> | null) => void;
  onNodeSelected: (node: Schemes['Node'] | null) => void;
  isGridSnapEnabled: boolean;
};

// ▼▼▼ propsを常に最新に保つためのカスタムフック ▼▼▼
function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}

export function useEditor(props: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorInstance, setEditorInstance] = useState<NodeEditor<Schemes> | null>(null);
  const [areaInstance, setAreaInstance] = useState<AreaPlugin<Schemes, any> | null>(null);

  // ▼▼▼ propsをrefとしてラップし、常に最新の値を参照できるようにする ▼▼▼
  const latestProps = useLatest(props);

  // === 1. 初回マウント時にエディタを一度だけセットアップするuseEffect ===
  useEffect(() => {
    if (!containerRef.current) return;

    const editor = new NodeEditor<Schemes>();
    const area = new AreaPlugin<Schemes, any>(containerRef.current);
    const connection = new ConnectionPlugin<Schemes, any>();
    const render = new ReactPlugin<Schemes>({ createRoot });
    
    editor.use(area);
    area.use(connection);
    area.use(render);
    
    connection.addPreset(ConnectionPresets.classic.setup());
    render.addPreset(ReactPresets.classic.setup());
    AreaExtensions.simpleNodesOrder(area);

    const selector = AreaExtensions.selector();
    const accumulating = AreaExtensions.accumulateOnCtrl();
    AreaExtensions.selectableNodes(area, selector, { accumulating });

    const handleSelection = () => {
        // ▼▼▼ 以下を検証のために追加 ▼▼▼
        console.log("--- handleSelectionが実行されました ---");
        console.log("onNodeSelectedRef オブジェクト:", onNodeSelectedRef);
        console.log("onNodeSelectedRef.current の値:", onNodeSelectedRef.current);
        console.log("typeof onNodeSelectedRef.current:", typeof onNodeSelectedRef.current);
        
        // エラーを一時的に防ぐため、関数であるかチェックしてから呼び出す
        if (typeof onNodeSelectedRef.current === 'function') {
            const selected = Array.from(selector.entities.values());
            if (selected.length === 1 && 'label' in selected[0] && selected[0].label === 'node') {
                onNodeSelectedRef.current(editor.getNode(selected[0].id));
            } else {
                onNodeSelectedRef.current(null);
            }
        } else {
            console.error("エラーの原因: onNodeSelectedRef.current は関数ではありません！");
        }
    };
    area.addPipe(context => {
        if (context.type === 'nodepicked' || context.type === 'pointerup' || context.type === 'nodedragged') {
            setTimeout(handleSelection, 0);
        }
        return context;
    });

    const handleKeyDown = async (e: KeyboardEvent) => {
        if (e.key === 'Delete') {
            const nodesToDelete = Array.from(selector.entities.values()).filter(e => 'label' in e && e.label === 'node').map(e => e.id);
            if (nodesToDelete.length === 0) return;
            for (const nodeId of nodesToDelete) {
                const connections = editor.getConnections().filter(c => c.source === nodeId || c.target === nodeId);
                for (const connection of connections) await editor.removeConnection(connection.id);
                await editor.removeNode(nodeId);
            }
            handleSelection();
        }
    };
    document.addEventListener('keydown', handleKeyDown);

    setEditorInstance(editor);
    setAreaInstance(area);
    latestProps.current.setEditor(editor);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        latestProps.current.setEditor(null);
        area.destroy();
    };
  }, []); // 依存配列は空のまま

  // === 2. isGridSnapEnabled の変更を監視するuseEffect (変更なし) ===
  useEffect(() => {
    if (!areaInstance) return;

    const snapSize = 16;
    let gridRoot: Root | null = null;
    let gridContainer: HTMLDivElement | null = null;
    let disposer: (() => void) | null = null;

    if (latestProps.current.isGridSnapEnabled) {
        gridContainer = document.createElement('div');
        gridContainer.className = 'grid-background';
        const backgroundHolder = areaInstance.area.content.holder;
        backgroundHolder.insertBefore(gridContainer, backgroundHolder.firstChild);
        gridRoot = createRoot(gridContainer);
        gridRoot.render(<GridBackground size={snapSize} />);
        disposer = areaInstance.addPipe(context => {
            if (context.type === 'nodetranslated') {
                const { id } = context.data;
                const view = areaInstance.nodeViews.get(id);
                if (view) {
                    const { x, y } = view.position;
                    const snappedX = Math.round(x / snapSize) * snapSize;
                    const snappedY = Math.round(y / snapSize) * snapSize;
                    view.translate(snappedX, snappedY);
                }
            }
            return context;
        });
    }

    return () => {
        if (gridRoot) gridRoot.unmount();
        if (gridContainer && areaInstance.area.content.holder.contains(gridContainer)) {
            areaInstance.area.content.holder.removeChild(gridContainer);
        }
        if (disposer) disposer();
    };
  }, [latestProps.current.isGridSnapEnabled, areaInstance]);

  return { ref: containerRef };
}

export default function NodeEditorComponent(props: EditorProps) {
  const { ref } = useEditor(props);
  return <div ref={ref} className="rete-editor" />;
}