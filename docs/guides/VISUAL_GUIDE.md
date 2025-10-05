# 新機能ビジュアルガイド

## ツールバーの新しいレイアウト

```
┌─────────────────────────────────────────────────────────────────────┐
│ 基本: [▶ Start] [⚡ Action] [🔀 Condition] [📝 Content]             │
│       [⏹ End] [🖼️ Image]                                            │
├─────────────────────────────────────────────────────────────────────┤
│ シナリオ: [🔗 Character] [📅 Event] [⏰ Timer] [🌐 Resource]        │
│                                   [💾 Export] [📂 Import] [🗑️ Clear] │
└─────────────────────────────────────────────────────────────────────┘
```

## ノード外観

### Character Node（人物ノード）
```
┌────────────────────────────────┐
│ 🔗 主人公                       │  ← ピンク→パープルグラデーション
├────────────────────────────────┤
│ [画像]                          │
│ Role: Protagonist              │
│ 物語の中心人物                  │
│ Relations: 3                   │
└────────────────────────────────┘
  ↓exec  →entity  →meta
```

### Event Node（イベントノード）
```
┌────────────────────────────────┐
│ 📅 重要な出会い                 │  ← ブルー→インディゴグラデーション
├────────────────────────────────┤
│ [画像]                          │
│ ⏰ 2024/01/15 14:30            │
│ 📍 カフェテリア                 │
│ 二人が初めて出会った場所        │
│ Participants: 2                │
└────────────────────────────────┘
  ↓exec  ←participants  →time  →content
```

### Timer Node（タイマーノード）
```
┌────────────────────────────────┐
│ ⏰ Timer                        │  ← イエロー→オレンジグラデーション
├────────────────────────────────┤
│ Type: DELAY                    │
│ Delay: 5s                      │
│ 🔁 Repeat: 10s                 │
└────────────────────────────────┘
  ↓exec  ←delay  →time
```

### External Resource Node（外部リソースノード）
```
┌────────────────────────────────┐
│ 🌐 External Resource           │  ← グリーン→ティールグラデーション
├────────────────────────────────┤
│ Type: API                      │
│ [GET]                          │
│ 🔗 https://api.example.com     │
└────────────────────────────────┘
  ↓exec  →url  →data
```

## ソケット表示

```
入力側（左）                      出力側（右）
    ⚡ exec   ───────────────→   exec ⚡
    🔀 bool   ───────────────→   bool 🔀
    🔢 number ───────────────→   number 🔢
    ✏️ string ───────────────→   string ✏️
    📝 content ──────────────→   content 📝
    🖼️ image  ───────────────→   image 🖼️
    🔗 entity ───────────────→   entity 🔗
    📋 list   ───────────────→   list 📋
    ⚙️ meta   ───────────────→   meta ⚙️
    ⏰ time   ───────────────→   time ⏰
```

## エッジスタイル

### Control Edge（制御フローエッジ）
```
[Start] ═══════════════════════> [Action]
        太い実線・ゴールド
```

### Data Edge（データエッジ）
```
[Action] ───────────────────────> [Content]
         細い実線・型に応じた色
```

### Relation Edge（関係エッジ）
```
[Character A] ┄┄┄┄┄┄┄┄┄┄┄┄┄┄> [Character B]
              破線・ピンク（関係性）
```

### Reference Edge（参照エッジ）
```
[Event] ···························> [Character]
        点線・グレー（参照のみ）
```

## ワークフロー例：シンプルなシナリオ

```
    [Start]
       ↓ exec
    [Character: 主人公]
       ↓ exec    → entity
    [Event: 出会い] ←
       ↓ exec
    [Condition: 好感度チェック]
       ├─→ true → [Action: 好印象]
       └─→ false → [Action: 普通の反応]
                        ↓
                     [End]
```

## ワークフロー例：人物相関図

```
    [Character: 太郎]
          ↓ entity (関係)
    [Character: 花子] ←┄┄ 恋愛関係
          ↓ entity
    [Character: 次郎] ←┄┄ 兄弟関係
```

## 接続の互換性マトリクス

```
出力 \ 入力  │ event │ bool │ number │ string │ content │ image │ entity │ list │ meta │ time │
─────────────┼───────┼──────┼────────┼────────┼─────────┼───────┼────────┼──────┼──────┼──────┤
event        │   ✓   │      │        │        │         │       │        │      │      │      │
bool         │       │  ✓   │   ✓    │   ✓    │         │       │        │      │      │      │
number       │       │      │   ✓    │   ✓    │         │       │        │      │      │      │
string       │       │      │        │   ✓    │    ✓    │       │        │      │      │      │
content      │       │      │        │   ✓    │    ✓    │       │        │      │      │      │
image        │       │      │        │        │         │   ✓   │        │      │      │      │
entity       │       │      │        │   ✓    │         │       │   ✓    │      │  ✓   │      │
list         │       │      │        │        │         │       │        │  ✓   │  ✓   │      │
meta         │       │      │        │        │         │       │        │      │  ✓   │      │
time         │       │      │   ✓    │   ✓    │         │       │        │      │      │  ✓   │
```

✓ = 接続可能（自動変換あり）

## バリデーションの視覚化

### ✅ 正常なグラフ
```
[Start] → [Action] → [End]
```

### ❌ エラー: Startノードなし
```
[Action] → [End]  ← エラー: "Graph must have at least one Start node"
```

### ⚠️ 警告: 孤立ノード
```
[Start] → [Action] → [End]

[Content]  ← 警告: "Node has no incoming connections"
```

### ⚠️ 警告: 循環参照
```
[Start] → [Action A] → [Action B]
               ↑____________↓
          警告: "Potential infinite loop detected"
```

## JSONエクスポート形式

```json
{
  "nodes": [
    {
      "id": "char-001",
      "label": "Character",
      "type": "character",
      "data": {
        "characterName": "主人公",
        "role": "Protagonist",
        "text": "物語の中心人物",
        "relationships": [
          {
            "targetId": "char-002",
            "type": "friend",
            "description": "幼馴染"
          }
        ]
      },
      "x": 100,
      "y": 200
    }
  ],
  "connections": [
    {
      "id": "conn-001",
      "source": "char-001",
      "sourceOutput": "entity",
      "target": "event-001",
      "targetInput": "participants",
      "meta": {
        "edgeType": "data",
        "label": "参加者"
      }
    }
  ],
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## キーボードショートカット

```
Delete         - 選択ノードを削除
Ctrl + Click   - 複数選択
Drag           - ノードを移動
Scroll         - キャンバスをパン
Ctrl + Scroll  - ズーム（予定）
```

## 編集パネル

ノードを選択すると右側に表示：

```
┌─────────────────────────────┐
│ 編集パネル                   │
├─────────────────────────────┤
│ ノード ID: char-001         │
│                             │
│ [Title入力欄]               │
│ [Text入力欄（複数行）]      │
│ [画像アップロード]          │
│                             │
│ ※ノードタイプに応じて       │
│   追加フィールド表示         │
└─────────────────────────────┘
```

## 今後の機能（予定）

```
[ ] ミニマップ表示
[ ] Undo/Redo
[ ] ノード検索
[ ] エッジのカスタムスタイル編集
[ ] バリデーションエラーの視覚表示
[ ] ノードのグループ化
[ ] コピー&ペースト
[ ] 自動レイアウト
[ ] エクスポート形式の追加（PNG, SVG）
[ ] テーマのカスタマイズ
```

---

このビジュアルガイドは、新しいノード・ソケット・エッジシステムの使い方を視覚的に理解するためのものです。
詳細な仕様は [NODES_SOCKETS_EDGES.md](./NODES_SOCKETS_EDGES.md) をご覧ください。
