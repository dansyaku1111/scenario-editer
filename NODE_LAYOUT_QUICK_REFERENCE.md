# ノードスタイル変更 - クイックリファレンス

## 📋 ドキュメント一覧

### 1. **NODE_LAYOUT_SUMMARY.md** ⭐ まずはこれを読む
- **内容**: 現状分析と実装アプローチの要約
- **対象**: プロジェクト全体を把握したい人
- **所要時間**: 5-10分

### 2. **NODE_LAYOUT_REDESIGN_APPROACH.md** 📘 詳細ガイド
- **内容**: 段階的な実装手順とコード例
- **対象**: 実際に実装する開発者
- **所要時間**: 20-30分

### 3. **NODE_LAYOUT_TECHNICAL_DETAILS.md** 🔧 技術詳細
- **内容**: CSS、DOM構造、z-indexなどの技術的解説
- **対象**: 実装中に詳細を確認したい人
- **所要時間**: 15-20分

### 4. **StyleCustmizeGuide.md** 📚 Rete.js v2完全ガイド
- **内容**: Rete.js v2のカスタマイズ手法の包括的分析
- **対象**: Rete.jsの仕組みを深く理解したい人
- **所要時間**: 60分以上

---

## 🎯 目標とするレイアウト

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
- ✅ ソケットが境界線上に配置される
- ✅ 画像とソケットが視覚的に重なる
- ✅ 画像サイズは160px固定幅
- ✅ ノードタイプラベルがノードの下に配置

---

## 🚀 実装の核心（1分で理解）

### アプローチ
**コンポーネントベースのカスタマイズ** （Rete.js v2公式推奨）

### 必要なファイル
1. `src/components/NodeTypes/CustomNode.tsx` - カスタムNodeコンポーネント
2. `src/styles/custom-node.css` - スタイリング
3. `src/components/NodeEditor.tsx` - 統合（既存ファイルを修正）

### キーとなるCSS
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
```

### NodeEditor.tsxでの統合
```typescript
render.addPreset(ReactPresets.classic.setup({
  customize: {
    node(context) {
      return CustomNodeComponent; // カスタムコンポーネント使用
    }
  }
}));
```

---

## 📊 実装手順（概要）

### フェーズ1: CustomNode.tsx作成
- 3層構造の実装（ノード名 → メインコンテナ → タイプラベル）
- ソケットの配置（absolute positioning）
- `emit`イベントの統合

### フェーズ2: custom-node.css作成
- ソケットの境界線上配置
- z-indexによる重なり制御
- ノードタイプ別のスタイリング

### フェーズ3: NodeEditor.tsx修正
- `customize.node()`で新コンポーネント使用
- 既存の`customize.control()`は維持

### フェーズ4: テストと微調整
- 動作確認（表示、接続、接続線の位置）
- 複数ソケットの配置調整
- 全ノードタイプへの展開

---

## ⚡ 重要なポイント

### 1. ソケットの配置
```
境界線
   ↓
   ●  ← transform: translate(-50%, -50%)
   │     でソケット中心が境界線上に
```

### 2. z-indexの階層
```
z-index: 10  ← ソケット（最前面、クリック可能）
z-index: 1   ← コンテンツ（画像・テキスト）
z-index: 0   ← 背景
```

### 3. Rete.jsとの統合
- `ref`でDOM要素を取得
- `emit`イベントでRete.jsに通知
- Rete.jsが自動的に接続点を計算

---

## 🛠️ トラブルシューティング

### 問題1: ソケットが表示されない
→ `emit`イベントが正しく発行されているか確認

### 問題2: 接続線の位置がずれる
→ DOM要素のBounding Rectを確認（開発者ツール）

### 問題3: ソケットがクリックできない
→ z-indexを確認、`z-index: 10`に設定

### 問題4: 複数ソケットが重なる
→ `flex-direction: column`と`gap: 8px`を設定

---

## 📈 実装時間の見積もり

| フェーズ | 作業内容 | 所要時間 |
|---------|---------|---------|
| 1 | CustomNode.tsx作成 | 2-3時間 |
| 2 | custom-node.css作成 | 1時間 |
| 3 | NodeEditor.tsx修正 | 30分 |
| 4 | 動作確認・テスト | 1時間 |
| 5 | 微調整 | 1-2時間 |
| 6 | 全ノードタイプ対応 | 1時間 |
| **合計** | | **6-8時間** |

---

## ✅ 実現可能性

### 結論: **高い（確実に実現可能）**

**理由**:
- ✅ Rete.js v2の公式推奨アプローチを使用
- ✅ StyleCustmizeGuide.mdで実証済みの手法
- ✅ CSSの`position: absolute`で実現可能
- ✅ DOM要素の位置が正しければ接続点も自動計算

**リスク**: **低い**
- 段階的に実装できる
- 各段階で動作確認可能
- 公式プラグインのソースコードが参考になる

---

## 🔗 参考リンク

### プロジェクト内
- [StyleCustmizeGuide.md](./StyleCustmizeGuide.md) - Rete.js v2カスタマイズの全知識
- [NODE_STYLE_GUIDE.md](./NODE_STYLE_GUIDE.md) - 現在のスタイルガイド
- [NODES_SOCKETS_EDGES.md](./NODES_SOCKETS_EDGES.md) - システム仕様

### Rete.js公式
- React.js customization: https://retejs.org/docs/guides/renderers/react/
- Customization example: https://retejs.org/examples/customization/react/
- GitHub (react-plugin): https://github.com/retejs/react-plugin

---

## 🎓 学習パス

### 初心者向け
1. NODE_LAYOUT_SUMMARY.md を読む
2. NODE_LAYOUT_TECHNICAL_DETAILS.md の図解を確認
3. 簡単なプロトタイプを作成

### 中級者向け
1. NODE_LAYOUT_REDESIGN_APPROACH.md を読む
2. CustomNode.tsx を実装
3. テストと微調整

### 上級者向け
1. StyleCustmizeGuide.md を熟読
2. 完全な実装
3. 高度なカスタマイズ（複数ソケット、動的レイアウトなど）

---

## 💡 次のステップ

### すぐに始める場合
1. **NODE_LAYOUT_SUMMARY.md** を読む（5分）
2. **NODE_LAYOUT_REDESIGN_APPROACH.md** のステップ1から実装開始
3. 段階的にテストしながら進める

### じっくり理解してから始める場合
1. **StyleCustmizeGuide.md** の第2章を読む（20分）
2. **NODE_LAYOUT_TECHNICAL_DETAILS.md** で技術詳細を確認（15分）
3. **NODE_LAYOUT_REDESIGN_APPROACH.md** を見ながら実装

### 質問がある場合
- 各ドキュメントの該当セクションを参照
- ブラウザの開発者ツールで実際のDOM構造を確認
- Rete.js公式ドキュメントを確認

---

## 📝 実装チェックリスト

- [ ] NODE_LAYOUT_SUMMARY.md を読んだ
- [ ] CustomNode.tsx を作成した
- [ ] custom-node.css を作成した
- [ ] NodeEditor.tsx を修正した
- [ ] ノードが表示されることを確認した
- [ ] ソケットが境界線上に表示されることを確認した
- [ ] ソケット同士を接続できることを確認した
- [ ] 接続線がソケットの中心から出ることを確認した
- [ ] 複数ソケットの配置が正しいことを確認した
- [ ] 全ノードタイプにスタイルを適用した
- [ ] ドキュメントを更新した

---

**最終更新**: 2025/10/05
**作成者**: GitHub Copilot CLI
**関連Issue**: ノードスタイルのカスタマイズ
