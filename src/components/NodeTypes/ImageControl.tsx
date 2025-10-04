import { ClassicPreset } from 'rete';

/**
 * 画像表示用のカスタムControl
 * Rete.jsのControlsシステムを使用してノード内に画像を表示
 */
export class ImageControl extends ClassicPreset.Control {
  constructor(public imageUrl: string, public text?: string) {
    super();
  }
}

/**
 * Reactコンポーネントとして画像Controlをレンダリング
 */
export function ImageControlComponent({ data }: { data: ImageControl }) {
  if (!data.imageUrl) return null;
  
  return (
    <div 
      className="image-control" 
      style={{ 
        padding: '8px',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <img 
        src={data.imageUrl} 
        alt="Node content"
        style={{
          maxWidth: '100%',
          width: 'auto',
          maxHeight: '150px',
          height: 'auto',
          objectFit: 'contain',
          borderRadius: '4px',
          display: 'block',
          margin: '0 auto'
        }}
        onError={(e) => {
          // 画像読み込みエラー時のフォールバック
          console.warn('Image failed to load:', data.imageUrl);
          e.currentTarget.src = 'https://placehold.co/200x150/cccccc/666666?text=No+Image';
        }}
      />
      {data.text && (
        <p style={{
          marginTop: '8px',
          marginBottom: '4px',
          fontSize: '12px',
          color: '#374151',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: '1.4'
        }}>
          {data.text}
        </p>
      )}
    </div>
  );
}
