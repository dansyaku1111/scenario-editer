# ノードスタイル変更の実装アプローチ - 要約

## 現状の確認結果

### 現在の実装
- **NodeEditor.tsx**: デフォルトの`ReactPresets.classic.Node`をラッパーでくるんでいるのみ
- **editor.css**: CSSによる表面的なスタイリングのみ
- **ソケット位置**: Rete.jsのデフォルトロジックに依存（ノード内部の左右端）

### 制約
- CSSだけではソケットを境界線上に移動できない
- 画像とソケットの重なりは現状の構造では実現困難
- ノードタイプラベルの位置制御ができていない

## StyleCustmizeGuide.mdからの重要な知見

### 1. 推奨アプローチ（第2章）
**コンポーネントベースのカスタマイズ** が最も強力で公式推奨の方法：

```typescript
render.addPreset(ReactPresets.classic.setup({
  customize: {
    node(context) {
      return CustomNodeComponent; // 完全カスタムコンポーネント
    }
  }
}));
```

**メリット**:
- 完全な構造の自由度
- Reactの思想に沿った実装
- 保守性が高い
- 将来の拡張が容易

### 2. ソケット位置のカスタマイズ（第3.3章）
カスタムコンポーネント内でソケット要素を`position: absolute`で配置可能。

**重要ポイント**:
- 視覚的な位置はCSSで制御できる
- 接続点の計算はDOM要素の`getBoundingClientRect()`に基づく
- DOM要素自体が正しい位置にあれば、接続点も自動的に正しく計算される

### 3. 接続点の計算（第3.4章）
基本的には**方法1（CSS変更のみ）**で十分：
- `position: absolute`でソケットを配置
- DOM要素の実際の位置が接続点として使用される
- 複雑な形状の場合のみカスタム計算ロジック（BaseSocketPosition継承）が必要

## 実装戦略

### フェーズ1: カスタムNodeコンポーネント作成
**ファイル**: `src/components/NodeTypes/CustomNode.tsx`

**構造**:
```
<div className="custom-node">
  <div className="node-name">ノード名</div>
  <div className="node-main-container">
    <div className="input-sockets" style={{position: 'absolute', left: 0}}>
      {ソケット群}
    </div>
    <div className="node-content">
      <div className="node-image">画像</div>
      <div className="node-description">説明文</div>
    </div>
    <div className="output-sockets" style={{position: 'absolute', right: 0}}>
      {ソケット群}
    </div>
  </div>
  <div className="node-type-label">[ノードタイプ]</div>
</div>
```

### フェーズ2: CSS実装
**ファイル**: `src/styles/custom-node.css`

**キーポイント**:
```css
.input-sockets {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; /* 画像より前面 */
}

.output-sockets {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
  z-index: 10;
}

.node-image {
  width: 160px;
  height: 120px;
}
```

### フェーズ3: 統合とテスト
1. NodeEditor.tsxで`customize.node()`に新コンポーネントを設定
2. 動作確認（表示、接続、接続線の位置）
3. 微調整（z-index、間隔、複数ソケットの配置）

## 実装上の重要な注意点

### 1. Rete.jsとの統合
カスタムコンポーネント内で`emit`イベントを正しく発行する必要がある：

```tsx
<div
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
/>
```

### 2. ソケットの接続点
- `socket-wrapper`のサイズを明示的に設定（16px × 16px）
- `transform`の影響を考慮
- DOM要素の実際の位置が接続点として使用される

### 3. z-indexの制御
- ソケット: `z-index: 10`（最前面）
- コンテンツ: `z-index: 1`
- 境界線の枠より前面に配置

### 4. 複数ソケットの配置
```tsx
<div className="input-sockets" style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
}}>
  {/* 各ソケット */}
</div>
```

## 想定される課題と対策

### 課題1: emit イベントの統合
**対策**: 公式`rete-react-plugin`のソースコードを参考にする

### 課題2: 接続線の位置ずれ
**対策**: 
- 開発者ツールでBounding Rectを確認
- `transform`の調整
- 必要に応じてSocketPositionWatcherの実装（高度）

### 課題3: z-indexの競合
**対策**: 
- 明示的な`z-index`設定
- `position: relative`で新しいスタッキングコンテキスト

### 課題4: 複数ソケットの重なり
**対策**: 
- `flex-direction: column`で縦並び
- 動的な位置計算

## 推奨実装順序

1. ✅ **CustomNode.tsx作成**: 基本構造の実装（2-3時間）
2. ✅ **custom-node.css作成**: スタイリング（1時間）
3. ✅ **NodeEditor.tsx修正**: 統合（30分）
4. ✅ **動作確認**: テスト（1時間）
5. ✅ **微調整**: 接続点、間隔など（1-2時間）
6. ✅ **全ノードタイプ対応**: スタイル適用（1時間）

**合計実装時間**: 約6-8時間

## 代替案（もし困難な場合）

### プランB: CSS Gridアプローチ
デフォルトコンポーネントをCSS Gridでラップ。
- **メリット**: 実装が簡単
- **デメリット**: 接続点計算が複雑化

### プランC: ハイブリッドアプローチ
一部のみカスタマイズし、段階的に移行。
- **メリット**: リスク分散
- **デメリット**: 実装が中途半端

## 結論

### 実現可能性: ✅ **高い**

要望のノードレイアウトは、**Rete.js v2のコンポーネントベースのカスタマイズ**で確実に実現可能です。

### 成功の鍵:
1. 完全カスタムのNodeコンポーネントを作成
2. ソケットを`position: absolute`で配置
3. `emit`イベントで正しくRete.jsと統合
4. 段階的に実装し、各段階で動作確認

### 推奨アプローチ:
**コンポーネントベースのカスタマイズ（プランA）**
- StyleCustmizeGuide.mdで推奨されている正攻法
- 最も柔軟で保守性が高い
- 将来の拡張が容易

### 次のステップ:
1. `NODE_LAYOUT_REDESIGN_APPROACH.md`の詳細を確認
2. CustomNode.tsxの実装開始
3. 段階的なテスト
4. 全ノードタイプへの展開

---

## 参考ドキュメント

- **詳細実装ガイド**: `NODE_LAYOUT_REDESIGN_APPROACH.md`
- **Rete.js v2カスタマイズ**: `StyleCustmizeGuide.md`
- **現在のスタイルガイド**: `NODE_STYLE_GUIDE.md`
- **システム仕様**: `NODES_SOCKETS_EDGES.md`
