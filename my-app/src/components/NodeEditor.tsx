import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { NodeEditor } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactPlugin, Presets as ReactPresets } from 'rete-react-plugin';
import { Schemes } from '../App';
import GridBackground from './GridBackground';

type EditorProps = {
  setEditor: (editor: NodeEditor<Schemes>) => void;
  onNodeSelected: (node: Schemes['Node'] | null) => void;
  gridEnabled: boolean;
  snapEnabled: boolean;
  gridSize: number;
};

export function useEditor(props: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<NodeEditor<Schemes>>();
  const gridRootRef = useRef<ReturnType<typeof createRoot> | null>(null);
  const [transform, setTransform] = useState('');

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

      const gridContainer = document.createElement('div');
      gridContainer.style.position = 'absolute';
      gridContainer.style.width = '100%';
      gridContainer.style.height = '100%';
      gridContainer.style.zIndex = '-1';
      gridContainer.style.pointerEvents = 'none';

      const gridRoot = createRoot(gridContainer);
      gridRootRef.current = gridRoot;
      area.area.content.add(gridContainer, true);

      const updateTransform = () => {
        const { x, y } = area.area.transform;
        const k = area.area.transform.k;
        setTransform(`translate(${x}px, ${y}px) scale(${k})`);
      };

      area.addPipe(context => {
        if (context.type === 'nodepicked' || context.type === 'pointerup') {
          setTimeout(handleSelection, 0);
        }
        if (props.snapEnabled && context.type === 'nodedragged') {
            const { id } = context.data;
            const node = editor.getNode(id);
            if (!node) return context;

            const x = Math.round(node.position.x / props.gridSize) * props.gridSize;
            const y = Math.round(node.position.y / props.gridSize) * props.gridSize;

            if(node.position.x !== x || node.position.y !== y) {
              area.translate(id, { x, y });
            }
        }
        if (context.type === 'translated' || context.type === 'zoomed') {
            updateTransform();
        }
        return context;
      });

      const handleSelection = () => {
        const selected = Array.from(selector.entities.values());
        if (selected.length === 1 && 'label' in selected[0] && selected[0].label === 'node') {
          const node = editor.getNode(selected[0].id);
          props.onNodeSelected(node);
        } else {
          props.onNodeSelected(null);
        }
      };

      const handleKeyDown = async (e: KeyboardEvent) => {
        if (e.key === 'Delete') {
          const nodesToDelete = Array.from(selector.entities.values())
            .filter(e => 'label' in e && e.label === 'node')
            .map(e => e.id);

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

      setTimeout(updateTransform, 10);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        gridRootRef.current?.unmount();
        area.destroy();
      };
    }
  }, [containerRef.current]);

  useEffect(() => {
    if (gridRootRef.current) {
      if (props.gridEnabled) {
        gridRootRef.current.render(<GridBackground size={props.gridSize} transform={transform} />);
      } else {
        gridRootRef.current.render(null);
      }
    }
  }, [props.gridEnabled, props.gridSize, transform, gridRootRef.current]);

  return {
    ref: containerRef
  };
}

export default function NodeEditorComponent(props: EditorProps) {
  const { ref } = useEditor(props);
  return <div ref={ref} className="rete-editor" />;
}
