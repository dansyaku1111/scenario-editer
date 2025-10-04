import { NodeEditor } from 'rete';
import { StartNode, EndNode } from '../components/NodeTypes';
import { isSocketCompatible } from '../components/NodeTypes/sockets';

export interface ValidationError {
  type: 'error' | 'warning';
  nodeId?: string;
  message: string;
  code: string;
}

/**
 * Validate the node graph for common issues
 */
export function validateGraph(editor: NodeEditor<any>): ValidationError[] {
  const errors: ValidationError[] = [];
  const nodes = editor.getNodes();
  const connections = editor.getConnections();

  // Check for Start node
  const startNodes = nodes.filter(n => n instanceof StartNode);
  if (startNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Graph must have at least one Start node',
      code: 'NO_START_NODE'
    });
  } else if (startNodes.length > 1) {
    errors.push({
      type: 'warning',
      message: 'Multiple Start nodes found. Only one is recommended.',
      code: 'MULTIPLE_START_NODES'
    });
  }

  // Check for End node
  const endNodes = nodes.filter(n => n instanceof EndNode);
  if (endNodes.length === 0) {
    errors.push({
      type: 'warning',
      message: 'No End node found. Consider adding at least one End node.',
      code: 'NO_END_NODE'
    });
  }

  // Check for disconnected nodes
  for (const node of nodes) {
    const hasInputs = Object.keys(node.inputs).length > 0;
    const hasOutputs = Object.keys(node.outputs).length > 0;
    
    if (!hasInputs && !hasOutputs) {
      continue; // Node has no sockets, skip
    }

    const connectedAsSource = connections.some(c => c.source === node.id);
    const connectedAsTarget = connections.some(c => c.target === node.id);

    if (!(node instanceof StartNode) && !connectedAsTarget && hasInputs) {
      errors.push({
        type: 'warning',
        nodeId: node.id,
        message: `Node "${node.label}" has no incoming connections`,
        code: 'NO_INPUT_CONNECTION'
      });
    }

    if (!(node instanceof EndNode) && !connectedAsSource && hasOutputs) {
      errors.push({
        type: 'warning',
        nodeId: node.id,
        message: `Node "${node.label}" has no outgoing connections`,
        code: 'NO_OUTPUT_CONNECTION'
      });
    }
  }

  // Check for required socket connections
  for (const node of nodes) {
    // This is a simplified check - in a real implementation,
    // you would check socket metadata for required fields
    const inputs = node.inputs as any;
    const inputKeys = Object.keys(inputs);
    for (const key of inputKeys) {
      const input = inputs[key];
      if (input && 'socket' in input) {
        const hasConnection = connections.some(
          c => c.target === node.id && c.targetInput === key
        );
        
        // Only 'exec' inputs are considered required for now
        if (!hasConnection && key === 'exec' && !(node instanceof StartNode)) {
          errors.push({
            type: 'warning',
            nodeId: node.id,
            message: `Node "${node.label}" missing required input connection: ${key}`,
            code: 'MISSING_REQUIRED_INPUT'
          });
        }
      }
    }
  }

  // Check for potential infinite loops (simplified check)
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function hasCycle(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const outgoingConnections = connections.filter(c => c.source === nodeId);
    for (const conn of outgoingConnections) {
      if (!visited.has(conn.target)) {
        if (hasCycle(conn.target)) {
          return true;
        }
      } else if (recursionStack.has(conn.target)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) {
        errors.push({
          type: 'warning',
          message: 'Potential infinite loop detected in graph',
          code: 'POTENTIAL_CYCLE'
        });
        break; // Only report once
      }
    }
  }

  return errors;
}

/**
 * Get validation errors grouped by node
 */
export function getErrorsByNode(errors: ValidationError[]): Map<string, ValidationError[]> {
  const errorMap = new Map<string, ValidationError[]>();
  
  for (const error of errors) {
    if (error.nodeId) {
      const existing = errorMap.get(error.nodeId) || [];
      existing.push(error);
      errorMap.set(error.nodeId, existing);
    }
  }
  
  return errorMap;
}

/**
 * Check if a connection between two sockets is valid
 */
export function isConnectionValid(
  sourceNode: any,
  sourceKey: string,
  targetNode: any,
  targetKey: string
): boolean {
  const outputs = sourceNode.outputs || {};
  const inputs = targetNode.inputs || {};
  const sourceOutput = outputs[sourceKey];
  const targetInput = inputs[targetKey];

  if (!sourceOutput || !targetInput) {
    return false;
  }

  if (!('socket' in sourceOutput) || !('socket' in targetInput)) {
    return false;
  }

  return isSocketCompatible(sourceOutput.socket, targetInput.socket);
}
