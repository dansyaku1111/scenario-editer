# 2ボックスアプローチ実装ドキュメント

## コンセプト

1つのノードを2つのボックスで表現：
- **外側ボックス**: ソケットとラベルを配置
- **内側ボックス**: 画像とテキストを配置

これにより、ソケットを確実にノードの端に配置し、理想的なレイアウトを実現します。

## 実装方法

### CSS Grid レイアウト

```
┌─────────────────────────────────────────┐
│           Node Name (上部外側)           │
├───────┬─────────────────────┬───────────┤
│ Input │                     │  Output   │
│   ●   │  ┌───────────────┐ │     ●     │
│   ●   │  │               │ │     ●     │
│       │  │    Image      │ │           │
│       │  │               │ │           │
│       │  ├───────────────┤ │           │
│       │  │ Description   │ │           │
│       │  └───────────────┘ │           │
├───────┴─────────────────────┴───────────┤
│         Node Type (下部外側)            │
└─────────────────────────────────────────┘
```

### CSS構造

```css
[data-testid='node'] {
    display: grid;
    grid-template-columns: auto 1fr auto; /* 3列 */
    padding: 0 24px; /* ソケット用スペース */
}

/* 列の配置 */
.input  { grid-column: 1; } /* 左列 */
.controls { grid-column: 2; } /* 中央列（内側ボックス） */
.output { grid-column: 3; } /* 右列 */

/* 内側ボックスのスタイル */
.controls {
    background: white;
    border: 2px solid #3b82f6;
    border-radius: 8px;
    padding: 12px 8px;
    box-shadow: ...;
}
```

## 修正したファイル

### 1. src/styles/editor.css

- **外側ボックス**: `[data-testid='node']`
  - `display: grid` で3列レイアウト
  - `background: transparent`（透明）
  - `border: none`（境界線なし）

- **内側ボックス**: `.controls`
  - 白背景またはグラデーション
  - 境界線と影
  - ホバー・選択効果

- **ソケット**: `.input`, `.output`
  - グリッドの左右列に配置
  - `z-index: 10`で前面に

### 2. src/components/NodeEditor.tsx

- デフォルトの`ReactPresets.classic.Node`を使用
- カスタマイズは最小限（ラベル追加のみ）
- Rete.jsの機能（ドラッグ、選択、接続）を保持

### 3. src/components/NodeTypes/ImageControl.tsx

- 画像サイズ: 160px
- テキストスタイル: 12px, 行間1.5

## 利点

### 1. 確実なソケット配置
- CSS Gridにより、ソケットが必ず左右に分離
- 接続線が自然に伸びる

### 2. レイアウトの柔軟性
- 内側ボックスのサイズを自由に調整可能
- ソケットの位置が独立

### 3. スタイルの適用が容易
- ノードタイプ別のスタイルを`.controls`に適用
- ホバー・選択効果が正しく動作

### 4. Rete.jsとの互換性
- デフォルトのNodeコンポーネントを使用
- 内部機能（ドラッグ、接続など）が正常に動作

## 確認ポイント

### 視覚的な確認
- [ ] ソケットがノードの左右に配置されている
- [ ] 内側ボックスに画像とテキストが表示
- [ ] Node Nameがノード上部に表示
- [ ] Node Typeがノード下部に表示
- [ ] ノードタイプ別の色が適用されている

### 機能的な確認
- [ ] ノードをドラッグできる
- [ ] ノードを選択できる
- [ ] ソケット間を接続できる
- [ ] 接続線が正しく描画される
- [ ] ノードを削除できる

## トラブルシューティング

### ソケットが表示されない
- グリッドレイアウトが正しく適用されているか確認
- `.input`と`.output`の`grid-column`を確認

### 内側ボックスが表示されない
- `.controls`のスタイルが適用されているか確認
- `background`と`border`が設定されているか確認

### レイアウトが崩れる
- `padding: 0 24px`の値を調整
- グリッドの列幅を調整

### ソケットの位置を調整したい
```css
[data-testid='node'] {
    padding: 0 30px; /* 値を大きく → ソケットが外側へ */
}
```

## 今後の改善案

### 1. ソケットの垂直位置
複数のソケットがある場合、それぞれの位置を最適化

### 2. アニメーション
内側ボックスのホバー時にスムーズなアニメーション

### 3. レスポンシブ対応
ノードサイズに応じた自動調整

## 参考

- CSS Grid: https://css-tricks.com/snippets/css/complete-guide-grid/
- Rete.js Custom Rendering: https://retejs.org/docs/guides/renderers/react
