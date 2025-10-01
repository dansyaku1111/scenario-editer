import { ClassicPreset } from 'rete';
import { Schemes } from '../../utils/jsonSchema';

type Props = {
  data: Schemes['Node'] & { selected?: boolean };
};

export function ConditionNodeComponent({ data }: Props) {
  const { inputs, outputs, label, data: nodeData } = data;

  return (
    <div
      className={`w-auto bg-white border-2 rounded-lg shadow-md relative ${
        data.selected ? 'border-blue-500' : 'border-gray-300'
      }`}
      style={{ maxWidth: '240px' }}
    >
      <div className="bg-gray-100 text-center font-bold p-2 rounded-t-lg border-b">
        {nodeData.title || label}
      </div>

      <div className="p-2 text-left">
        {nodeData.imageUrl && (
          <img
            src={nodeData.imageUrl}
            alt="Node content"
            className="w-full h-auto rounded-md mb-2"
            style={{ maxWidth: '220px', maxHeight: '150px', objectFit: 'contain' }}
          />
        )}
        {nodeData.text && (
          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
            {String(nodeData.text)}
          </p>
        )}
      </div>

      {/* Input Sockets */}
      {inputs?.exec && (
        <div className="absolute -left-4 top-1/2 -translate-y-1/2" data-testid="input-socket">
          <ClassicPreset.Socket
            {...inputs.exec}
          />
        </div>
      )}

      {/* Output Sockets */}
      {outputs?.true && (
        <div className="absolute -right-4 top-1/4 -translate-y-1/2" data-testid="output-socket-true">
          <ClassicPreset.Socket
            {...outputs.true}
          />
        </div>
      )}
      {outputs?.false && (
        <div className="absolute -right-4 top-3/4 -translate-y-1/2" data-testid="output-socket-false">
          <ClassicPreset.Socket
            {...outputs.false}
          />
        </div>
      )}
    </div>
  );
}
