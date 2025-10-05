# 実装概要: ノードラベル名とレイアウト改善

## 実装日時
2025年1月5日

## 要求仕様
1. ノードにラベル名を付けられるようにする
2. メインパネルではノードの種類名の上に表示する
3. ソケット・画像・テキストの位置を調整し、ノードからはみ出さないようにする

## 実装内容

### ✅ 1. ノードラベル名フィールドの追加

全てのノードタイプ（10種類）に `name` フィールドを追加:
- StartNode
- EndNode
- ActionNode
- ImageNode
- ContentNode
- ConditionNode
- CharacterNode
- EventNode
- TimerNode
- ExternalResourceNode

```typescript
data: { 
  title: string;
  name?: string;  // ← 追加
  // ... その他のフィールド
}
```

### ✅ 2. ラベル名の視覚的表示

**NodeEditor.tsx** を更新してノードの上部にラベル名を表示:

```tsx
{nodeName && (
  <div className="node-name-label">
    {nodeName}
  </div>
)}
```

**表示スタイル:**
- ノードの上部28px上に配置
- 半透明白背景 (rgba(255, 255, 255, 0.95))
- シャドウ効果で視認性向上
- テキストオーバーフローは省略記号で表示

### ✅ 3. エディタパネルでのラベル名編集

**EditorPanel.tsx** に「ラベル名」入力フィールドを追加:

```tsx
<input
  type="text"
  value={node.data?.name || ''}
  onChange={handleNameChange}
  placeholder="ノードのラベル名を入力"
/>
```

全てのノードタイプで編集可能に:
- Start/End/Image: ラベル名 + 画像
- その他: ラベル名 + 内容 + 画像

### ✅ 4. レイアウトとスタイルの最適化

#### ノードサイズの調整
| ノードタイプ | 変更前 | 変更後 | 理由 |
|------------|--------|--------|------|
| Start/End | 180×180 | 180×200 | ラベル名スペース確保 |
| Action/Image/Content/Condition/Timer | 220×280 | 220×300 | コンテンツ収容改善 |
| Character/Event/ExternalResource | 240×320 | 240×340 | 追加情報表示スペース |

#### ソケットサイズの調整
- サイズ: 16px → 14px
- ボーダー: 3px → 2.5px
- ホバー拡大: 1.2倍 → 1.15倍

#### 画像コントロールの最適化
- 最大高さ: 150px → 120px
- 画像幅: auto → 100%
- テキストサイズ: 12px → 11px
- テキスト最大高さ: なし → 80px

#### パディングとマージンの最適化
```css
/* ノード */
padding: 12px → 10px

/* 画像コントロール */
padding: 8px → 6px
margin: 8px 0 → 6px 0

/* ソケット */
margin: 4px 0
min-height: 20px
```

### ✅ 5. オーバーフロー対策

```css
/* ノード本体 */
overflow: visible;  /* ラベル名が表示できるように */

/* 画像コントロール */
overflow: hidden;  /* コンテンツがはみ出さないように */

/* テキスト */
max-height: 80px;
text-overflow: ellipsis;
```

## 動作確認

### ビルドテスト
```bash
npm run build
```
✅ TypeScriptコンパイル成功
✅ Viteビルド成功
✅ エラー・警告なし

### 機能テスト項目
- [x] ノード作成
- [x] ラベル名入力
- [x] ラベル名表示
- [x] 画像アップロード
- [x] テキスト編集
- [x] JSONエクスポート
- [x] JSONインポート
- [x] レイアウト崩れなし

## ファイル変更一覧

### 新規作成
- `NODE_LABEL_AND_LAYOUT_IMPROVEMENTS.md`
- `IMPLEMENTATION_SUMMARY_JA.md`

### 更新ファイル
**コンポーネント:**
- `src/components/NodeEditor.tsx` - ラベル名表示ロジック追加
- `src/components/EditorPanel.tsx` - ラベル名編集機能追加
- `src/components/NodeTypes/ImageControl.tsx` - レイアウト最適化

**ノードタイプ（全10種類）:**
- `src/components/NodeTypes/StartNode.ts`
- `src/components/NodeTypes/EndNode.ts`
- `src/components/NodeTypes/ActionNode.ts`
- `src/components/NodeTypes/ImageNode.ts`
- `src/components/NodeTypes/ContentNode.ts`
- `src/components/NodeTypes/ConditionNode.ts`
- `src/components/NodeTypes/CharacterNode.ts`
- `src/components/NodeTypes/EventNode.ts`
- `src/components/NodeTypes/TimerNode.ts`
- `src/components/NodeTypes/ExternalResourceNode.ts`

**スタイル:**
- `src/styles/editor.css` - レイアウト改善

## 互換性

### 下位互換性
✅ 既存のJSONファイルは引き続き動作
- `name` フィールドがない場合は空文字列として扱われる
- ラベル名が空の場合は表示されない

### 上位互換性
✅ 新しいJSONエクスポートには `name` フィールドが含まれる
✅ 古いバージョンでも読み込み可能（フィールドは無視される）

## 使用方法

### ラベル名の設定
1. ノードを選択
2. 右側の編集パネルで「ラベル名」を入力
3. ノードの上部に表示される

### ラベル名の削除
1. 編集パネルで「ラベル名」を空にする
2. ラベルが非表示になる

## 技術的なポイント

### React コンポーネントのメモ化
ラベル名の更新時にノード全体を再レンダリングするため、Rete.jsのビューシステムと統合。

### CSSのz-index管理
```
ラベル名 (z-index: 10)
  ↓
ソケット (z-index: 2)
  ↓
ノード本体 (z-index: 1)
  ↓
コントロール (z-index: 0)
  ↓
グリッド背景 (z-index: 0)
```

### レスポンシブ対応
- 画像: object-fit: contain でアスペクト比維持
- テキスト: word-break: break-word で自動折り返し
- ラベル: text-overflow: ellipsis で長い名前を省略

## まとめ

✅ 全ての要求仕様を実装完了
✅ ビルドエラーなし
✅ 既存機能への影響なし
✅ レイアウト改善により視認性向上
✅ ドキュメント整備完了
