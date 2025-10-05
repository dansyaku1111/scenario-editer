# ノードレイアウト実装の技術的詳細

## 現在の構造 vs 目標の構造

### 現在の構造（デフォルトRete.js）
```
┌─────────────────────────────────┐
│  ┌──────────────────────────┐   │
│  │  ● Input Socket          │   │
│  │                          │   │
│  │  [Node Content]          │   │
│  │  - 画像                  │   │
│  │  - テキスト              │   │
│  │                          │   │
│  │          Output Socket ● │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```
**問題点**:
- ソケットがノード内部に配置
- 画像とソケットが重ならない
- ノードタイプラベルが統一されていない

### 目標の構造
```
              Node Name           
           ┌─────────────────────┐
           │  ┌───────────────┐  │
● Input    │  │    Image      │  │    ● Output
  Socket   │  │   (160px)     │  │      Socket
(境界線上)  │  └───────────────┘  │    (境界線上)
           │  Description text   │ 
           └─────────────────────┘
              [Node Type]
```
**改善点**:
- ソケットが境界線上に配置
- 画像とソケットが視覚的に重なる
- ノードタイプラベルが下部に統一

## HTML/CSS構造の詳細

### DOM構造
```html
<div class="custom-node" data-node-type="Action">
  <!-- レイヤー1: ノード名（最上部） -->
  <div class="node-name">
    アクション実行
  </div>
  
  <!-- レイヤー2: メインコンテナ（境界線付き） -->
  <div class="node-main-container" style="position: relative;">
    
    <!-- レイヤー2-1: 入力ソケット（境界線上・左） -->
    <div class="input-sockets" style="position: absolute; left: 0;">
      <div class="socket-wrapper" data-testid="socket">
        <div class="socket-indicator"></div>
      </div>
    </div>
    
    <!-- レイヤー2-2: 中央コンテンツ -->
    <div class="node-content">
      <div class="node-image">
        <img src="..." />
      </div>
      <div class="node-description">
        説明文がここに入ります
      </div>
    </div>
    
    <!-- レイヤー2-3: 出力ソケット（境界線上・右） -->
    <div class="output-sockets" style="position: absolute; right: 0;">
      <div class="socket-wrapper" data-testid="socket">
        <div class="socket-indicator"></div>
      </div>
    </div>
    
  </div>
  
  <!-- レイヤー3: ノードタイプラベル（最下部） -->
  <div class="node-type-label">
    [Action]
  </div>
</div>
```

### CSSレイアウトのキーポイント

```css
/* 1. 全体コンテナ */
.custom-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  /* ノード全体が縦方向にレイアウト */
}

/* 2. ノード名（上部） */
.node-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  text-align: center;
  /* 境界線の外側に配置 */
}

/* 3. メインコンテナ（境界線付きボックス） */
.node-main-container {
  position: relative; /* ← 重要：子要素のabsoluteの基準 */
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 12px;
  background: white;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 4. 入力ソケット（左境界線上） */
.input-sockets {
  position: absolute; /* ← 絶対位置指定 */
  left: 0;            /* ← 左端 */
  top: 50%;           /* ← 上から50%の位置 */
  transform: translate(-50%, -50%); /* ← 中心を境界線に合わせる */
  z-index: 10;        /* ← 画像より前面に表示 */
  
  display: flex;
  flex-direction: column; /* ← 複数ソケットは縦並び */
  gap: 8px;
}

/* 5. 出力ソケット（右境界線上） */
.output-sockets {
  position: absolute;
  right: 0;           /* ← 右端 */
  top: 50%;
  transform: translate(50%, -50%); /* ← 中心を境界線に合わせる */
  z-index: 10;
  
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 6. ソケットの外観 */
.socket-wrapper {
  width: 16px;
  height: 16px;
  position: relative;
}

.socket-indicator {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border: 3px solid #3b82f6;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.socket-indicator:hover {
  background: #3b82f6;
  transform: scale(1.2);
}

/* 7. コンテンツエリア */
.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1; /* ← ソケットより背面 */
}

/* 8. 画像エリア */
.node-image {
  width: 160px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
}

.node-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* 9. 説明文 */
.node-description {
  width: 100%;
  font-size: 12px;
  color: #374151;
  text-align: left;
  line-height: 1.4;
}

/* 10. ノードタイプラベル（下部） */
.node-type-label {
  margin-top: 4px;
  font-size: 11px;
  color: #6b7280;
  text-align: center;
  font-weight: 500;
  /* 境界線の外側に配置 */
}
```

## z-index の階層構造

```
z-index: 10  ← ソケット（最前面）
z-index: 1   ← コンテンツ（中間）
z-index: 0   ← 背景（デフォルト）
```

### なぜこの階層が必要か？

1. **ソケットが最前面（z-index: 10）**:
   - 画像エリアとソケットが重なった時、ソケットがクリック可能である必要がある
   - 接続線の始点/終点として機能するため

2. **コンテンツが中間（z-index: 1）**:
   - 背景より前面にあるが、ソケットより背面
   - 画像がソケットを隠さないようにする

## transformの役割

### translate(-50%, -50%) の解説

```
             ┌─────────────────┐
             │                 │
←────────────●                 │  ← transform: translate(-50%, 0)
left: 0      │                 │     ソケットの中心が境界線上に来る
             │                 │
             └─────────────────┘
```

**計算の流れ**:
1. `left: 0` → 要素の左端が境界線の左端に配置される
2. `translate(-50%, 0)` → 要素を自身の幅の半分だけ左に移動
3. **結果**: 要素の中心が境界線上に配置される

### 複数ソケットの配置

```css
.input-sockets {
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* ソケット間に8pxの間隔 */
}
```

```
┌──────────────┐
│              │
●              │  ← ソケット1
│              │
●              │  ← ソケット2（8px下）
│              │
●              │  ← ソケット3（さらに8px下）
│              │
└──────────────┘
```

## Rete.jsとの統合ポイント

### emit イベントの発行

カスタムコンポーネント内で、Rete.jsにソケット要素を通知する必要があります：

```tsx
<div
  className="socket-wrapper"
  data-testid="socket"
  ref={(ref) => {
    if (ref) {
      emit({
        type: 'render',
        data: {
          type: 'socket',
          side: 'input',      // 'input' または 'output'
          key: 'exec',        // ソケットのキー名
          nodeId: data.id,    // ノードのID
          element: ref,       // DOM要素への参照
          payload: input.socket  // ソケットオブジェクト
        }
      });
    }
  }}
>
  <div className="socket-indicator" />
</div>
```

### 接続点の計算

Rete.jsは`element.getBoundingClientRect()`を使用して接続点を計算します：

```javascript
// Rete.js内部の処理（概念的）
const rect = socketElement.getBoundingClientRect();
const connectionPoint = {
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2
};
```

**重要**: DOM要素が正しい位置にあれば、接続点は自動的に正しく計算されます。

## ノードタイプ別のカスタマイズ

### 方法1: data属性によるスタイル分岐

```css
/* 基本スタイル */
.node-main-container {
  border: 2px solid #3b82f6;
  background: white;
}

/* Actionノード */
[data-node-type='Action'] .node-main-container {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #3b82f6;
}

/* Characterノード */
[data-node-type='Character'] .node-main-container {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-color: #8b5cf6;
}

/* Conditionノード */
[data-node-type='Condition'] .node-main-container {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}
```

### 方法2: 動的クラス名

```tsx
<div 
  className={`custom-node node-${nodeType.toLowerCase()}`}
  data-node-type={nodeType}
>
  {/* ... */}
</div>
```

```css
.node-action .node-main-container { /* ... */ }
.node-character .node-main-container { /* ... */ }
.node-condition .node-main-container { /* ... */ }
```

## 複数入力/出力ソケットへの対応

### 動的な位置計算

```tsx
const inputSocketsCount = Object.keys(data.inputs).length;
const outputSocketsCount = Object.keys(data.outputs).length;

// ソケットが1つの場合は中央（50%）
// 複数の場合は等間隔に配置
const calculateSocketPosition = (index: number, total: number) => {
  if (total === 1) return '50%';
  const spacing = 100 / (total + 1);
  return `${spacing * (index + 1)}%`;
};
```

```tsx
<div className="input-sockets">
  {inputs.map(([key, input], index) => (
    <div
      key={key}
      className="socket-wrapper"
      style={{
        position: 'absolute',
        left: 0,
        top: calculateSocketPosition(index, inputs.length),
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* ... */}
    </div>
  ))}
</div>
```

## レスポンシブ対応

### 画像サイズの調整

```css
.node-image {
  width: 160px;
  height: 120px;
}

/* 小さいビューポートでは画像を縮小 */
@media (max-width: 768px) {
  .node-image {
    width: 120px;
    height: 90px;
  }
}
```

### ソケットサイズの調整

```css
.socket-wrapper {
  width: 16px;
  height: 16px;
}

/* タッチデバイスではタップしやすいように大きく */
@media (hover: none) {
  .socket-wrapper {
    width: 20px;
    height: 20px;
  }
}
```

## パフォーマンスの考慮

### 1. 画像の最適化

```tsx
<img
  src={imageUrl}
  loading="lazy"  // 遅延読み込み
  alt="Node content"
  style={{
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  }}
/>
```

### 2. トランジションの最適化

```css
.socket-indicator {
  transition: transform 0.2s ease, background 0.2s ease;
  will-change: transform; /* GPUアクセラレーション */
}
```

### 3. 再レンダリングの最適化

```tsx
export const CustomNodeComponent = React.memo(({ data, emit }: Props) => {
  // コンポーネントの実装
}, (prevProps, nextProps) => {
  // カスタム比較関数
  return prevProps.data.id === nextProps.data.id &&
         prevProps.data.label === nextProps.data.label;
});
```

## デバッグのヒント

### 1. ソケット位置の確認

```tsx
useEffect(() => {
  const socketElements = document.querySelectorAll('.socket-wrapper');
  socketElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    console.log('Socket position:', {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
  });
}, []);
```

### 2. z-indexの確認

```css
/* デバッグ用：境界線を視覚化 */
.input-sockets {
  outline: 2px solid red;
}

.output-sockets {
  outline: 2px solid blue;
}

.node-content {
  outline: 2px solid green;
}
```

### 3. 接続線の開始/終了点の確認

ブラウザの開発者ツールでSVGパスの座標を確認：

```javascript
// コンソールで実行
const paths = document.querySelectorAll('[data-testid="connection"] path');
paths.forEach(path => {
  const d = path.getAttribute('d');
  console.log('Connection path:', d);
});
```

## まとめ

### 実装の核心ポイント

1. **構造**: 3層構造（ノード名 → メインコンテナ → タイプラベル）
2. **配置**: `position: absolute` + `transform: translate(-50%, -50%)`
3. **重なり**: z-indexによる制御（ソケット最前面）
4. **統合**: `emit`イベントでRete.jsに通知

### 成功への鍵

- DOM要素の位置が正しければ、接続点も自動的に正しい
- `ref`と`emit`を正しく使用してRete.jsと統合
- 段階的に実装し、各段階で動作確認

この技術的詳細に従って実装すれば、要望通りのノードレイアウトが実現できます。
