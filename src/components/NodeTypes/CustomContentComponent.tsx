import { CustomContentControl } from './controls';

type CustomControlProps = {
  data: CustomContentControl;
};

export function CustomContentComponent({ data }: CustomControlProps) {
  const { title, text, imageUrl } = data.data;

  return (
    <div
      className="w-auto bg-white border-2 rounded-lg shadow-md relative"
      style={{ maxWidth: '240px' }}
    >
      <div className="bg-gray-100 text-center font-bold p-2 rounded-t-lg border-b">
        {title}
      </div>
      <div className="p-2 text-left">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Node content"
            className="w-full h-auto rounded-md mb-2"
            style={{
              maxWidth: '220px',
              maxHeight: '150px',
              objectFit: 'contain',
            }}
          />
        )}
        {text && (
          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
            {String(text)}
          </p>
        )}
      </div>
    </div>
  );
}