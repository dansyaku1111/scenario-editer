# ノードラベル名と レイアウト改善

## 実装した変更点

### 1. ノードラベル名機能の追加

全てのノードタイプに `name` フィールドを追加しました。このラベル名はノードの種類名の上部に表示されます。

#### 変更したファイル:
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

各ノードタイプのdataオブジェクトに `name?: string` フィールドを追加し、デフォルト値を空文字列に設定しました。

### 2. ノードラベル名の表示

`src/components/NodeEditor.tsx` を更新して、ノードの上部にラベル名を表示するようにしました。

#### 特徴:
- ノードの上部（-28px）に配置
- 半透明の白い背景
- 影とボーダーラジウスで視認性を向上
- テキストオーバーフローを省略記号で処理
- ラベル名が設定されている場合のみ表示

### 3. エディタパネルの更新

`src/components/EditorPanel.tsx` を更新して、ノードラベル名を編集できるようにしました。

#### 機能:
- 全てのノードタイプで「ラベル名」入力フィールドを追加
- Start/Endノード: ラベル名 + 画像
- Imageノード: ラベル名 + 画像
- その他のノード: ラベル名 + 内容テキスト + 画像

### 4. レイアウトとスタイルの改善

`src/styles/editor.css` と `src/components/NodeTypes/ImageControl.tsx` を更新して、ソケット、画像、テキストの配置を改善しました。

#### 改善点:

**ノードの基本スタイル:**
- パディングを12pxから10pxに削減
- overflowをvisibleに設定してラベル名が表示できるように

**ソケットのスタイル:**
- サイズを16pxから14pxに削減
- ボーダー幅を3pxから2.5pxに削減
- ホバー時のスケールを1.2から1.15に調整
- 最小高さ（20px）を設定して配置を安定化

**画像コントロール:**
- パディングを8pxから6pxに削減
- 最大高さを150pxから120pxに削減
- 画像の幅を100%に設定してコンテナに合わせる
- テキストのフォントサイズを12pxから11pxに削減
- テキストの最大高さを80pxに設定してオーバーフローを防止
- 行の高さを1.4から1.3に調整

**ノードのサイズ調整:**
- Start/Endノード: 180px x 200px（高さ+20px）
- Action/Image/Content/Condition/Timerノード: 220px x 300px（高さ+20px）
- Character/Event/ExternalResourceノード: 240px x 340px（高さ+20px）

### 5. データの永続化

ノードの `name` フィールドは以下で自動的に保存・読み込みされます:
- JSON エクスポート機能
- JSON インポート機能
- ノードのデータ更新機能

## 使用方法

1. **ノードを作成**: ツールバーから任意のノードタイプを追加
2. **ノードを選択**: ノードをクリックして選択
3. **ラベル名を入力**: 右側の編集パネルで「ラベル名」フィールドに名前を入力
4. **表示確認**: ノードの上部にラベル名が表示されます

## 技術的な詳細

### ラベル名の表示ロジック

```tsx
{nodeName && (
  <div className="node-name-label" style={{...}}>
    {nodeName}
  </div>
)}
```

ラベル名が空文字列でない場合のみ表示されます。

### スタイルの優先順位

1. インラインスタイル（NodeEditor.tsx内）
2. CSSクラス（editor.css内）
3. Rete.jsのデフォルトスタイル

### レスポンシブデザイン

- テキストオーバーフロー: 省略記号で処理
- 画像: アスペクト比を保持しながらコンテナに合わせる
- ソケット: 固定サイズで安定した配置

## 互換性

- 既存のJSONファイルは引き続き動作します（nameフィールドはオプション）
- 新しいJSONエクスポートにはnameフィールドが含まれます
- 古いJSONファイルを読み込むとnameフィールドは空文字列になります

## 今後の改善案

1. ラベル名の文字数制限の追加
2. ラベル名の色やスタイルのカスタマイズ
3. ラベル名の位置調整オプション
4. 複数行のラベル名のサポート
