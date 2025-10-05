# ノードレイアウト再設計アプローチ

## 1. 目標とする新しいレイアウト

```
                     Node Name           
                  ┌─────────────────────┐
                  │  ┌───────────────┐  │
● Input Socket    │  │    Image      │  │    ● Output Socket
  (境界線上)       │  │   (160px)     │  │      (境界線上)
                  │  └───────────────┘  │
                  │  Description text   │ 
                  └─────────────────────┘
                     [Node Type]
```

### 主な変更点

1. **ソケットの配置**: ノード内部から境界線上へ移動
2. **画像とソケットの重なり**: 画像エリアにソケットが重なる
3. **画像サイズ**: 160px固定幅
4. **ノードタイプラベル**: ノードの下に配置

## 2. 現状の分析

### 2.1 現在の実装構造

**ファイル**: `src/components/NodeEditor.tsx` (L43-64)

```typescript
render.addPreset(ReactPresets.classic.setup({
  customize: {
    control(context) {
      if (context.payload.constructor.name === 'ImageControl') {
        return ImageControlComponent;
      }
      return ReactPresets.classic.Control;
    },
    node(context) {
      const Component = ReactPresets.classic.Node;
      return (props: any) => {
        const nodeType = props.data.label || 'Unknown';
        return (
          <div data-node-type={nodeType}>
            <Component {...props} />
          </div>
        );
      };
    }
  }
}));
```

**現状の問題点**:
- デフォルトの`ReactPresets.classic.Node`をラッパーでくるんでいるだけ
- ソケットの配置はデフォルトのまま（ノード内部の左右端）
- 画像とソケットが重ならない構造
- ノードタイプラベルの位置制御ができていない

### 2.2 現在のスタイリング

**ファイル**: `src/styles/editor.css`

```css
[data-testid='node'] {
    background: white;
    border: 2px solid #3b82f6;
    border-radius: 12px;
    padding: 12px;
    min-width: 180px;
    /* ... */
}

[data-testid='socket'] {
    width: 16px;
    height: 16px;
    background: #ffffff;
    border: 3px solid #3b82f6;
    /* ... */
}
```

**現状の制約**:
- ソケットの位置はRete.jsのデフォルトロジックで決定される
- CSSだけではソケットを境界線上に配置できない
- 画像領域との重なりは実現困難

## 3. Rete.js v2でのカスタマイズアプローチ（StyleCustmizeGuide.mdより）

### 3.1 推奨される主要アプローチ

**第2章「主要アプローチ: `customize`によるコンポーネントベースのカスタマイズ」**より:

> Rete.js v2でビジュアル要素をカスタマイズする上で最も強力かつ公式に推奨される手法は、
> レンダリングプラグインのプリセットが提供する`customize`プロパティを利用した
> コンポーネントの置換である。

**ポイント**:
1. `customize.node()`で完全カスタムNodeコンポーネントを返す
2. デフォルトコンポーネントに依存せず、自由な構造を実装可能
3. UIフレームワーク（React）の思想に沿った実装

### 3.2 ソケット位置のカスタマイズ

**第3.3章「ソケット位置のカスタマイズ」**より:

> デフォルトでは、ソケットはノード内の特定の位置に配置されますが、
> カスタムコンポーネント内でソケット要素のCSSを調整することで、
> 任意の位置に配置できます。

**重要な注意点**:
- ソケットの**視覚的な位置**はCSSで変更可能
- しかし、**接続点の計算**は別途調整が必要
- `SocketPositionWatcher`の理解が重要

### 3.3 ソケット接続点の計算（高度なカスタマイズ）

**第3.4章「接続点の位置計算のカスタマイズ」**より:

Rete.jsはソケットの接続点をDOM要素の`getBoundingClientRect()`から計算する。
視覚的位置を変更した場合、接続点も正しく計算されるようにする必要がある。

**方法1: CSS変更のみ（推奨）**
- `position: absolute`でソケットを配置
- DOM要素自体が正しい位置にあれば、自動計算が正しく機能

**方法2: カスタム計算ロジック（高度）**
- `BaseSocketPosition`クラスの継承
- カスタムウォッチャーの実装
- 複雑な形状のノード（円形など）に対応

## 4. 実装アプローチの提案

### 4.1 フェーズ1: カスタムNodeコンポーネントの作成

**目標**: 完全にカスタマイズされたノード構造を実装

**実装内容**:

1. **新ファイル作成**: `src/components/NodeTypes/CustomNode.tsx`
2. **構造**:
   ```tsx
   <div className="custom-node" data-node-type={nodeType}>
     {/* ノード名（上部） */}
     <div className="node-name">{nodeName}</div>
     
     {/* メインコンテナ（境界線付き） */}
     <div className="node-main-container">
       {/* 入力ソケット群（境界線上・左） */}
       <div className="input-sockets">
         {renderInputSockets()}
       </div>
       
       {/* 中央コンテンツ（画像+説明） */}
       <div className="node-content">
         <div className="node-image">
           {renderImage()}
         </div>
         <div className="node-description">
           {renderDescription()}
         </div>
       </div>
       
       {/* 出力ソケット群（境界線上・右） */}
       <div className="output-sockets">
         {renderOutputSockets()}
       </div>
     </div>
     
     {/* ノードタイプラベル（下部） */}
     <div className="node-type-label">{nodeType}</div>
   </div>
   ```

3. **ソケット配置のポイント**:
   - `position: absolute`で境界線上に配置
   - `left: 0`（入力）、`right: 0`（出力）
   - `top`は画像の中央に合わせて計算（例: `top: 50%`）
   - `transform: translateX(-50%)`で中心を境界線に合わせる

### 4.2 フェーズ2: スタイリング

**新ファイル作成**: `src/styles/custom-node.css`

```css
.custom-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.node-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  text-align: center;
}

.node-main-container {
  position: relative;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 12px;
  background: white;
  min-width: 200px;
}

/* ソケットを境界線上に配置 */
.input-sockets {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10; /* 画像より前面 */
}

.output-sockets {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.node-image {
  width: 160px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.node-description {
  width: 100%;
  font-size: 12px;
  color: #374151;
  text-align: left;
}

.node-type-label {
  margin-top: 4px;
  font-size: 11px;
  color: #6b7280;
  text-align: center;
  font-weight: 500;
}
```

### 4.3 フェーズ3: NodeEditor.tsxでの統合

**ファイル**: `src/components/NodeEditor.tsx`

```typescript
import { CustomNodeComponent } from './NodeTypes/CustomNode';

render.addPreset(ReactPresets.classic.setup({
  customize: {
    control(context) {
      if (context.payload.constructor.name === 'ImageControl') {
        return ImageControlComponent;
      }
      return ReactPresets.classic.Control;
    },
    node(context) {
      // カスタムNodeコンポーネントを使用
      return CustomNodeComponent;
    }
  }
}));
```

### 4.4 フェーズ4: ソケット接続点の検証と調整

1. **動作確認**:
   - ノードを配置し、ソケット同士を接続
   - 接続線がソケットの中心から出ているか確認

2. **問題があった場合**:
   - ブラウザの開発者ツールでソケット要素の位置を確認
   - `getBoundingClientRect()`の結果をコンソールで確認
   - 必要に応じて`transform`の調整

3. **高度な調整が必要な場合**:
   - `rete-connection-plugin`のカスタマイズを検討
   - SocketPositionWatcherの実装（StyleCustmizeGuide.md 第3.4章参照）

## 5. 実装手順の詳細

### ステップ1: CustomNode.tsxの作成

```tsx
// src/components/NodeTypes/CustomNode.tsx
import React from 'react';
import { ClassicPreset } from 'rete';

interface CustomNodeProps {
  data: ClassicPreset.Node;
  emit: (data: any) => void;
}

export function CustomNodeComponent({ data, emit }: CustomNodeProps) {
  const inputs = Object.entries(data.inputs);
  const outputs = Object.entries(data.outputs);
  const controls = Object.entries(data.controls);

  const nodeType = data.label || 'Unknown';

  return (
    <div className="custom-node" data-node-type={nodeType}>
      {/* ノード名 */}
      <div className="node-name">{data.label}</div>

      {/* メインコンテナ */}
      <div className="node-main-container">
        {/* 入力ソケット */}
        {inputs.length > 0 && (
          <div className="input-sockets">
            {inputs.map(([key, input]) => (
              <div
                key={key}
                className="socket-wrapper"
                data-testid="socket"
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
            ))}
          </div>
        )}

        {/* コンテンツ */}
        <div className="node-content">
          {/* Controls（画像など） */}
          {controls.map(([key, control]) => (
            <div key={key} className="control">
              {/* Controlコンポーネントのレンダリング */}
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
          ))}
        </div>

        {/* 出力ソケット */}
        {outputs.length > 0 && (
          <div className="output-sockets">
            {outputs.map(([key, output]) => (
              <div
                key={key}
                className="socket-wrapper"
                data-testid="socket"
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
            ))}
          </div>
        )}
      </div>

      {/* ノードタイプラベル */}
      <div className="node-type-label">[{nodeType}]</div>
    </div>
  );
}
```

### ステップ2: CSSファイルのインポート

```typescript
// src/main.tsx または src/App.tsx
import './styles/custom-node.css';
```

### ステップ3: 段階的なテスト

1. **基本構造のテスト**: ノードが表示されるか確認
2. **ソケットの表示テスト**: ソケットが境界線上に表示されるか確認
3. **接続テスト**: ソケット同士を接続できるか確認
4. **接続線の位置テスト**: 線が正しい位置から出ているか確認
5. **複数ノードでのテスト**: レイアウトが崩れないか確認

## 6. 想定される課題と対策

### 課題1: ソケットの`emit`イベントが正しく機能しない

**原因**: Rete.jsのレンダリングシステムとの統合が不完全

**対策**:
- 公式の`rete-react-plugin`のソースコード参照
- `ReactPresets.classic.Node`の実装を確認
- `emit`の呼び出し方を模倣

**参考**: StyleCustmizeGuide.md 第2.2章の実装例

### 課題2: 接続線がソケットの中心から出ない

**原因**: DOM要素の位置計算が正しくない

**対策**:
1. `socket-wrapper`のサイズを明示的に設定（16px × 16px）
2. `transform`の影響を考慮
3. 開発者ツールで実際のBounding Rectを確認

**高度な対策**:
- カスタムSocketPositionWatcherの実装（必要な場合のみ）

### 課題3: z-indexの競合

**原因**: ソケットが画像の背面に隠れる

**対策**:
- ソケット要素に`z-index: 10`を設定
- コンテンツ要素に`z-index: 1`を設定
- `position: relative`で新しいスタッキングコンテキストを作成

### 課題4: 複数のソケットの配置

**原因**: 複数のソケットが重なる

**対策**:
- `flex-direction: column`で縦に並べる
- `gap: 8px`で間隔を設定
- ソケット数に応じて`top`の位置を動的に計算

```tsx
const socketCount = inputs.length;
const topPosition = `calc(50% - ${(socketCount - 1) * 12}px)`;
```

## 7. 代替アプローチ（もし上記が困難な場合）

### アプローチA: デフォルトコンポーネントの拡張

デフォルトの`ReactPresets.classic.Node`を完全に置き換えず、
CSSの`position: absolute`で調整する方法。

**メリット**: 実装が簡単
**デメリット**: レイアウトの自由度が低い

### アプローチB: SVGベースのカスタムレンダリング

ノード自体をSVGで描画し、完全に制御する方法。

**メリット**: 完全な制御
**デメリット**: 実装が複雑、Reactコンポーネントの恩恵が少ない

### アプローチC: ラッパーコンポーネント + CSS Grid

デフォルトコンポーネントをCSS Gridでラップし、
グリッドレイアウトでソケット位置を調整。

**メリット**: CSS Gridの強力なレイアウト機能を活用
**デメリット**: ソケットの接続点計算が複雑化

## 8. 推奨実装プラン

### 第1優先: コンポーネントベースのカスタマイズ（本アプローチ）

**理由**:
- StyleCustmizeGuide.mdで推奨されている
- 最も柔軟で保守性が高い
- Reactの思想に沿っている
- 将来の拡張が容易

**実装時間**: 4-6時間（テスト含む）

### 第2優先: CSS Gridアプローチ（フォールバック）

もし接続点の計算で問題が発生し、解決が困難な場合の代替案。

**実装時間**: 2-3時間

## 9. 次のステップ

1. **CustomNode.tsxの作成**: 基本構造の実装
2. **custom-node.cssの作成**: スタイリング
3. **NodeEditor.tsxの修正**: 統合
4. **動作確認**: ブラウザでテスト
5. **微調整**: 接続点、間隔、z-indexなど
6. **全ノードタイプへの適用**: ノードタイプ別のスタイリング
7. **ドキュメント更新**: 実装内容の記録

## 10. 参考資料

### Rete.js公式ドキュメント
- React.js customization: https://retejs.org/docs/guides/renderers/react/
- Customization example: https://retejs.org/examples/customization/react/

### プロジェクト内ドキュメント
- `StyleCustmizeGuide.md`: Rete.js v2のカスタマイズ手法の包括的分析
- `NODE_STYLE_GUIDE.md`: 現在のノードスタイルガイド
- `NODES_SOCKETS_EDGES.md`: ノード・ソケット・エッジシステム仕様

### ソースコード参照
- `rete-react-plugin` GitHub: https://github.com/retejs/react-plugin
- 特に`src/presets/classic/components/`配下のコンポーネント

## まとめ

目標とするノードレイアウトは、Rete.js v2の`customize`プロパティによる
コンポーネントベースのカスタマイズで実現可能です。

**キーポイント**:
1. 完全カスタムのNodeコンポーネントを作成
2. ソケットを`position: absolute`で境界線上に配置
3. z-indexで画像とソケットの重なりを制御
4. `emit`イベントで正しくRete.jsと統合

**成功の鍵**:
- 公式プラグインのソースコードを参考にする
- 段階的に実装し、各段階で動作確認
- 接続点の計算を慎重に検証

このアプローチにより、要望通りの美しく機能的なノードレイアウトを実現できます。
