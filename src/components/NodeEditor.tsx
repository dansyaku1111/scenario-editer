import { useEffect, useRef } from 'react';
import { NodeEditor } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactPlugin, Presets as ReactPresets, ReactArea2D } from 'rete-react-plugin';
import { createRoot, Root } from 'react-dom/client';
import GridBackground from './GridBackground';
import { ImageControlComponent } from './NodeTypes/ImageControl';

type Area = ReactArea2D<any>;

type EditorProps = {
  setEditor: (editor: NodeEditor<any> | null) => void;
  onNodeSelected: (node: any | null) => void;
};

export function useEditor(props: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<NodeEditor<any>>();
  const areaRef = useRef<AreaPlugin<any, Area>>();

  // === エディタのセットアップとイベントリスナー登録をまとめて管理するuseEffect ===
  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. 初回のみ実行する処理 ---
    const editor = new NodeEditor<any>();
    const area = new AreaPlugin<any, Area>(containerRef.current);
    editorRef.current = editor;
    areaRef.current = area;

    const connection = new ConnectionPlugin<any, Area>();
    const render = new ReactPlugin<any, Area>({ createRoot });
    
    editor.use(area);
    area.use(connection);
    area.use(render);
    
    connection.addPreset(ConnectionPresets.classic.setup());

    // デフォルトのノードレンダリングを使用（ソケットの接続機能を保持）
    // カスタムControlコンポーネントを登録
    render.addPreset(ReactPresets.classic.setup({
      customize: {
        control(context) {
          if (context.payload.constructor.name === 'ImageControl') {
            return ImageControlComponent;
          }
          return ReactPresets.classic.Control;
        },
        node(context) {
          // カスタムNodeコンポーネントでdata-node-type属性を追加
          const Component = ReactPresets.classic.Node;
          return (props: any) => {
            const nodeType = props.data.label || 'Unknown';
            return (
              <div data-node-type={nodeType}>
                <Component {...props} />
              </div>
            );
          };
        }
      }
    }));
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
    const selectionDisposer: any = area.addPipe(context => {
        if (context.type === 'nodepicked' || context.type === 'pointerup' || context.type === 'nodedragged') {
            setTimeout(handleSelection, 0);
        }
        return context;
    });

    const handleKeyDown = async (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        // 入力フィールドにフォーカスがある場合は何もしない
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

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
        if (typeof selectionDisposer === 'function') {
            selectionDisposer(); // イベントリスナーを解除
        }
        // ここでarea.destroy()は呼ばない。コンポーネント自体が消える時に呼ぶ
    };
  }, [props.setEditor]); // setEditorが変更されたら再実行

  // === グリッドとスナップ機能だけを管理するuseEffect ===
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    
    const snapSize = 16;
    let gridRoot: Root | null = null;
    let gridContainer: HTMLDivElement | null = null;
    let disposer: any = null;

    gridContainer = document.createElement('div');
    gridContainer.className = 'grid-background';
    const backgroundHolder = area.area.content.holder;
    backgroundHolder.insertBefore(gridContainer, backgroundHolder.firstChild);
    gridRoot = createRoot(gridContainer);
    gridRoot.render(<GridBackground size={snapSize} />);
    
    // SVG arrow marker を追加
    const svgElement = area.area.content.holder.querySelector('svg');
    if (svgElement) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'arrowhead');
      marker.setAttribute('markerWidth', '10');
      marker.setAttribute('markerHeight', '10');
      marker.setAttribute('refX', '9');
      marker.setAttribute('refY', '3');
      marker.setAttribute('orient', 'auto');
      marker.setAttribute('markerUnits', 'strokeWidth');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M0,0 L0,6 L9,3 z');
      path.setAttribute('fill', '#94a3b8');
      
      marker.appendChild(path);
      defs.appendChild(marker);
      svgElement.insertBefore(defs, svgElement.firstChild);
    }
    
    disposer = area.addPipe(context => {
        if (context.type === 'nodetranslated') {
            const id = context.data.id;
            const view = area.nodeViews.get(id);
            if (view) {
                const { x, y } = view.position;
                const snappedX = Math.round(x / snapSize) * snapSize;
                const snappedY = Math.round(y / snapSize) * snapSize;
                // 現在位置がスナップ後の位置と異なるときだけ translate を呼ぶ
                if (x !== snappedX || y !== snappedY) {
                    view.translate(snappedX, snappedY);
                }
            }
        }
        return context;
    });

    return () => {
        if (disposer) disposer();

        // unmountとDOM操作を非同期にして、Reactのレンダリングサイクルとの競合を避ける
        setTimeout(() => {
            if (gridRoot) {
                gridRoot.unmount();
            }
            if (gridContainer && area.area.content.holder.contains(gridContainer)) {
                area.area.content.holder.removeChild(gridContainer);
            }
        }, 0);
    };
  }, []);
  
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