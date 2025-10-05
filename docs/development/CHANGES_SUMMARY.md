# ノード・エッジのスタイル更新とImageControl実装

## 概要
全てのノードタイプにImageControlを追加し、Draw.io風のスタイリングを適用しました。これにより、メインパネル（キャンバス）上で全ノードに画像が表示されるようになります。

## 実装された変更

### 1. 全ノードへのImageControl追加

以下の全てのノードタイプにImageControl機能を実装しました：

#### ✅ 既に実装済みだったノード
- **CharacterNode** - キャラクター情報と画像を表示
- **ActionNode** - アクション内容と画像を表示

#### ✅ 新たに追加したノード
- **ContentNode** - コンテンツと画像を表示
- **ConditionNode** - 条件分岐と画像を表示
- **EventNode** - イベント情報と画像を表示
- **TimerNode** - タイマー設定と画像を表示
- **ImageNode** - 画像専用ノード
- **ExternalResourceNode** - 外部リソース情報と画像を表示
- **StartNode** - 開始ノード（緑色のプレースホルダー画像）
- **EndNode** - 終了ノード（赤色のプレースホルダー画像）

### 2. 各ノードの実装詳細

各ノードファイルに以下の機能を追加：

```typescript
// コンストラクタでImageControlを追加
constructor(initialData?: Partial<NodeData>) {
  // ... 既存のコード ...
  
  // 画像Controlを追加（url と imageUrl の両方をチェック）
  const imageUrl = (this.data as any).url || this.data.imageUrl;
  this.addControl('image', new ImageControl(imageUrl, this.data.text));
}

// データ更新メソッド
updateData(newData: Partial<NodeData>) {
  this.data = { ...this.data, ...newData };
  
  // Controlを削除して再作成（Reactの再レンダリングをトリガー）
  if (this.controls.image) {
    this.removeControl('image');
  }
  
  const imageUrl = (this.data as any).url || this.data.imageUrl;
  this.addControl('image', new ImageControl(imageUrl, this.data.text));
}
```

### 3. EditorPanel の更新

全ノードタイプで画像とテキストの編集が可能になりました：

- **Start/End/Imageノード**: 画像のみ編集可能
- **その他のノード**: テキストと画像の両方を編集可能

編集可能なノードタイプ：
- Action
- Condition
- Content
- Character
- Event
- Timer
- External Resource

### 4. Draw.io風スタイリングの実装

`src/styles/editor.css` に以下のスタイルを追加：

#### ノードスタイル
- **グラデーション背景**: 各ノードタイプに固有のカラーグラデーション
  - Start: 緑色グラデーション (#dcfce7 → #bbf7d0)
  - Action: 青色グラデーション (#dbeafe → #bfdbfe)
  - Character: 紫色グラデーション (#ede9fe → #ddd6fe)
  - Condition: 黄色グラデーション (#fef3c7 → #fde68a)
  - Content: シアングラデーション (#cffafe → #a5f3fc)
  - Event: ピンクグラデーション (#fce7f3 → #fbcfe8)
  - Timer: オレンジグラデーション (#fed7aa → #fdba74)
  - Image: インディゴグラデーション (#e0e7ff → #c7d2fe)
  - External Resource: ティールグラデーション (#ccfbf1 → #99f6e4)
  - End: 赤色グラデーション (#fee2e2 → #fecaca)

- **影とホバー効果**: 
  - ドロップシャドウで立体感を演出
  - ホバー時に影が強くなり、わずかに上に移動
  - 選択時は赤色の枠と影でハイライト

- **丸みを帯びた角**: border-radius: 12px

#### ソケット（接続点）スタイル
- 白い背景に青い枠線
- ホバー時に青く塗りつぶされ、1.2倍に拡大
- ドロップシャドウで立体感

#### コネクション（エッジ）スタイル
- 灰色の線（stroke-width: 2.5px）
- ホバー時に青色に変化し太くなる
- 選択時に赤色に変化
- SVG矢印マーカーで方向性を表示
- ドロップシャドウで立体感

### 5. NodeEditorコンポーネントの更新

- **カスタムノードレンダリング**: `data-node-type`属性を追加してCSSでノードタイプ別のスタイリングを可能に
- **SVG矢印マーカー**: 接続線に矢印を追加してデータフローの方向を明示化

## 技術的な詳細

### ImageControl の仕組み

```typescript
export class ImageControl extends ClassicPreset.Control {
  constructor(public imageUrl: string, public text?: string) {
    super();
  }
}
```

ImageControlはRete.jsのControlシステムを使用してノード内に画像を埋め込みます。Reactコンポーネント（`ImageControlComponent`）でレンダリングされ、以下の機能を提供：

- 画像のURLから自動読み込み
- エラー時のフォールバック画像表示
- テキスト説明の表示（オプション）
- レスポンシブなサイズ調整

### データフロー

1. ノード作成時に`imageUrl`と`text`を指定
2. `ImageControl`がノードに追加される
3. `ImageControlComponent`がReactでレンダリング
4. EditorPanelで画像を変更すると`updateData()`が呼ばれる
5. Controlが再作成されて画像が更新される

## 使用方法

### ノードに画像を追加する

1. キャンバス上のノードをクリックして選択
2. 右側の編集パネルで「画像ファイル」セクションを使用
3. ファイルを選択すると、自動的にBase64エンコードされてノードに表示される

### ノードのスタイル

各ノードタイプは自動的に適切な色とスタイルが適用されます。CSSのグラデーションとシャドウにより、Draw.ioのような洗練された外観になります。

## ファイル変更リスト

### 更新されたファイル
- `src/components/NodeTypes/ContentNode.ts`
- `src/components/NodeTypes/ConditionNode.ts`
- `src/components/NodeTypes/EventNode.ts`
- `src/components/NodeTypes/TimerNode.ts`
- `src/components/NodeTypes/ImageNode.ts`
- `src/components/NodeTypes/ExternalResourceNode.ts`
- `src/components/NodeTypes/StartNode.ts`
- `src/components/NodeTypes/EndNode.ts`
- `src/components/EditorPanel.tsx`
- `src/components/NodeEditor.tsx`
- `src/styles/editor.css`

### 変更なし（すでに実装済み）
- `src/components/NodeTypes/CharacterNode.ts`
- `src/components/NodeTypes/ActionNode.ts`
- `src/components/NodeTypes/ImageControl.tsx`

## 互換性

- 既存のデータと完全互換性あり
- `imageUrl`フィールドを持つノードはそのまま動作
- 新しい`url`フィールド（Base64画像）も自動的に検出して表示

## 今後の拡張可能性

- より多くのノードタイプの追加が容易
- カスタムアイコンやSVGグラフィックの統合
- アニメーション効果の追加
- テーマのカスタマイズ機能
