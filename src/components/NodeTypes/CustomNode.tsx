import React from 'react';
import { ClassicPreset } from 'rete';
import { RenderEmit } from 'rete-react-plugin';

/**
 * カスタムNodeコンポーネント
 * ソケットを境界線上に配置し、画像とソケットを重ねる新しいレイアウト
 */

interface CustomNodeProps {
  data: ClassicPreset.Node;
  emit: RenderEmit<any>;
}

export function CustomNodeComponent({ data, emit }: CustomNodeProps) {
  const inputs = Object.entries(data.inputs);
  const outputs = Object.entries(data.outputs);
  const controls = Object.entries(data.controls);

  const nodeType = data.label || 'Unknown';
  // ノードのカスタムラベル名を取得（data.dataにlabelNameがあればそれを使用）
  const customLabel = (data as any).data?.labelName || nodeType;
  
  const sortInputs = inputs.sort((a, b) => {
    const ai = (a[1] as any).index || 0;
    const bi = (b[1] as any).index || 0;
    return ai - bi;
  });
  const sortOutputs = outputs.sort((a, b) => {
    const ao = (a[1] as any).index || 0;
    const bo = (b[1] as any).index || 0;
    return ao - bo;
  });

  return (
    <div className="custom-node" data-node-type={nodeType}>
      {/* ノードのカスタムラベル名（上部） */}
      <div className="node-label-name">{customLabel}</div>

      {/* メインコンテナ（境界線付き） */}
      <div className="node-main-container">
        {/* 入力ソケット群（境界線上・左） */}
        {sortInputs.length > 0 && (
          <div className="input-sockets">
            {sortInputs.map(([key, input]) => {
              if (!input) return null;
              return (
                <div
                  key={key}
                  className="socket-container"
                  data-testid="socket"
                  data-side="input"
                  ref={(ref) => {
                    if (ref) {
                      emit({
                        type: 'render',
                        data: {
                          type: 'socket',
                          side: 'input',
                          key,
                          nodeId: data.id,
                          element: ref,
                          payload: input.socket
                        }
                      });
                    }
                  }}
                >
                  <div className="socket-indicator" />
                </div>
              );
            })}
          </div>
        )}

        {/* コンテンツエリア */}
        <div className="node-content">
          {/* Controls（画像など） */}
          {controls.map(([key, control]) => {
            if (control) {
              return (
                <div key={key} className="control">
                  <div
                    ref={(ref) => {
                      if (ref) {
                        emit({
                          type: 'render',
                          data: {
                            type: 'control',
                            element: ref,
                            payload: control
                          }
                        });
                      }
                    }}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* 出力ソケット群（境界線上・右） */}
        {sortOutputs.length > 0 && (
          <div className="output-sockets">
            {sortOutputs.map(([key, output]) => {
              if (!output) return null;
              return (
                <div
                  key={key}
                  className="socket-container"
                  data-testid="socket"
                  data-side="output"
                  ref={(ref) => {
                    if (ref) {
                      emit({
                        type: 'render',
                        data: {
                          type: 'socket',
                          side: 'output',
                          key,
                          nodeId: data.id,
                          element: ref,
                          payload: output.socket
                        }
                      });
                    }
                  }}
                >
                  <div className="socket-indicator" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ノードタイプラベル（下部） */}
      <div className="node-type-label">[{nodeType}]</div>
    </div>
  );
}
