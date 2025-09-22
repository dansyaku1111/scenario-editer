import { useEffect, useRef } from 'react';
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

export function useEditor(props: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<NodeEditor<Schemes>>();
  const areaRef = useRef<AreaPlugin<Schemes, any>>();

  // === エディタのセットアップとイベントリスナー登録をまとめて管理するuseEffect ===
  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. 初回のみ実行する処理 ---
    const editor = new NodeEditor<Schemes>();
    const area = new AreaPlugin<Schemes, any>(containerRef.current);
    editorRef.current = editor;
    areaRef.current = area;

    const connection = new ConnectionPlugin<Schemes, any>();
    const render = new ReactPlugin<Schemes>({ createRoot });
    
    editor.use(area);
    area.use(connection);
    area.use(render);
    
    connection.addPreset(ConnectionPresets.classic.setup());
    render.addPreset(ReactPresets.classic.setup());
    AreaExtensions.simpleNodesOrder(area);

    props.setEditor(editor);

    // --- 2. 毎回のレンダリングで設定が必要なイベントハンドラ ---
    const selector = AreaExtensions.selector();
    const accumulating = AreaExtensions.accumulateOnCtrl();
    AreaExtensions.selectableNodes(area, selector, { accumulating });

    const handleSelection = () => {
        const selected = Array.from(selector.entities.values());
        if (selected.length === 1 && 'label' in selected[0] && selected[0].label === 'node') {
            props.onNodeSelected(editor.getNode(selected[0].id));
        } else {
            props.onNodeSelected(null);
        }
    };
    const selectionDisposer = area.addPipe(context => {
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
    
    // --- 3. クリーンアップ関数 ---
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        selectionDisposer(); // イベントリスナーを解除
        // ここでarea.destroy()は呼ばない。コンポーネント自体が消える時に呼ぶ
    };
  }, [props.onNodeSelected]); // onNodeSelectedが変更されたら再実行

  // === グリッドとスナップ機能だけを管理するuseEffect ===
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    
    const snapSize = 16;
    let gridRoot: Root | null = null;
    let gridContainer: HTMLDivElement | null = null;
    let disposer: (() => void) | null = null;

    if (props.isGridSnapEnabled) {
        gridContainer = document.createElement('div');
        gridContainer.className = 'grid-background';
        const backgroundHolder = area.area.content.holder;
        backgroundHolder.insertBefore(gridContainer, backgroundHolder.firstChild);
        gridRoot = createRoot(gridContainer);
        gridRoot.render(<GridBackground size={snapSize} />);
        disposer = area.addPipe(context => {
            if (context.type === 'nodetranslated') {
                const id = context.data.id;
                const view = area.nodeViews.get(id);
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
        if (gridContainer && area.area.content.holder.contains(gridContainer)) {
            area.area.content.holder.removeChild(gridContainer);
        }
        if (disposer) disposer();
    };
  }, [props.isGridSnapEnabled]);
  
  // === コンポーネントが完全にアンマウントされる時の最終クリーンアップ ===
  useEffect(() => {
      return () => {
          props.setEditor(null);
          if (areaRef.current) {
              areaRef.current.destroy();
          }
      }
  }, []);

  return { ref: containerRef };
}

export default function NodeEditorComponent(props: EditorProps) {
  const { ref } = useEditor(props);
  return <div ref={ref} className="rete-editor" />;
}