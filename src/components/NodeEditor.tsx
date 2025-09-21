import { useEffect, useRef } from 'react';
import { NodeEditor } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactPlugin, Presets as ReactPresets } from 'rete-react-plugin';
import { createRoot } from 'react-dom/client';
import { Schemes } from '../App';

type EditorProps = {
  setEditor: (editor: NodeEditor<Schemes>) => void;
  onNodeSelected: (node: Schemes['Node'] | null) => void;
};

export function useEditor(props: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<NodeEditor<Schemes>>();

  useEffect(() => {
    if (containerRef.current) {
      const editor = new NodeEditor<Schemes>();
      const area = new AreaPlugin<Schemes, any>(containerRef.current);
      const connection = new ConnectionPlugin<Schemes, any>();
      const render = new ReactPlugin<Schemes>({ createRoot });
      const selector = AreaExtensions.selector();
      const accumulating = AreaExtensions.accumulateOnCtrl();
      
      AreaExtensions.selectableNodes(area, selector, { accumulating });

      editor.use(area);
      area.use(connection);
      area.use(render);
      
      connection.addPreset(ConnectionPresets.classic.setup());
      render.addPreset(ReactPresets.classic.setup());

      AreaExtensions.simpleNodesOrder(area);
      
      const handleSelection = () => {
        // ★★★ ここを修正: .get() から .entities プロパティに変更 ★★★
        const selected = Array.from(selector.entities.values());
        // =========================================================

        if (selected.length === 1 && 'label' in selected[0] && selected[0].label === 'node') {
          const node = editor.getNode(selected[0].id);
          props.onNodeSelected(node);
        } else {
          props.onNodeSelected(null);
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
          // ★★★ ここを修正: .get() から .entities プロパティに変更 ★★★
          const nodesToDelete = Array.from(selector.entities.values())
            .filter(e => 'label' in e && e.label === 'node')
            .map(e => e.id);
          // =========================================================

          if (nodesToDelete.length === 0) return;

          for (const nodeId of nodesToDelete) {
            const connections = editor.getConnections().filter(c => c.source === nodeId || c.target === nodeId);
            for (const connection of connections) {
              await editor.removeConnection(connection.id);
            }
            await editor.removeNode(nodeId);
          }
          handleSelection();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      editorRef.current = editor;
      props.setEditor(editor);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        area.destroy();
      };
    }
  }, [containerRef.current]);

  return {
    ref: containerRef
  };
}

export default function NodeEditorComponent(props: EditorProps) {
  const { ref } = useEditor(props);
  return <div ref={ref} className="rete-editor" />;
}