import { Schemes } from '../../utils/jsonSchema';

type Props = {
  data: Schemes['Node'] & { selected?: boolean };
};

export function ActionNodeComponent({ data }: Props) {
  const { label, data: nodeData } = data;

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
        {(nodeData.url || nodeData.imageUrl) && (
          <img
            src={nodeData.url || nodeData.imageUrl}
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
    </div>
  );
}
