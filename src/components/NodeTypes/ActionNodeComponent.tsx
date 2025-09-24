import { ClassicPreset } from 'rete-react-plugin';
import { Schemes } from '../../utils/jsonSchema';

type Props = {
  data: Schemes['Node'] & { selected?: boolean };
};

export function ActionNodeComponent({ data }: Props) {
  const { inputs, outputs, label, data: nodeData } = data;

  return (
    <div
      className={`w-48 bg-white border-2 rounded-lg shadow-md relative ${
        data.selected ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <div className="bg-gray-100 text-center font-bold p-2 rounded-t-lg border-b">
        {label}
      </div>

      {(nodeData.url || nodeData.text) && (
        <div className="p-2 text-left">
          {nodeData.url && (
            <img
              src={nodeData.url}
              alt="Node content"
              className="w-full h-auto rounded-md mb-2"
            />
          )}
          {nodeData.text && (
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {String(nodeData.text)}
            </p>
          )}
        </div>
      )}

      {/* Input Sockets */}
      {inputs?.exec && (
        <div className="absolute -left-4 top-1/2 -translate-y-1/2" data-testid="input-socket">
          <ClassicPreset.Socket
            {...inputs.exec}
          />
        </div>
      )}

      {/* Output Sockets */}
      {outputs?.exec && (
        <div className="absolute -right-4 top-1/2 -translate-y-1/2" data-testid="output-socket">
          <ClassicPreset.Socket
            {...outputs.exec}
          />
        </div>
      )}
    </div>
  );
}
