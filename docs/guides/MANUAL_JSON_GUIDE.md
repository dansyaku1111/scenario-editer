# 手動でのJSONファイル作成ガイド

## 概要

このガイドは、テキストエディタで手動でシナリオJSONファイルを作成する方法を説明します。

## 最小構成のテンプレート

以下は、最小限のシナリオファイルのテンプレートです。コピーして編集してください。

```json
{
  "nodes": [
    {
      "id": "start-1",
      "label": "Start",
      "type": "start",
      "x": 100,
      "y": 100,
      "data": {
        "title": "Start"
      }
    },
    {
      "id": "end-1",
      "label": "End",
      "type": "end",
      "x": 600,
      "y": 100,
      "data": {
        "title": "End"
      }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "source": "start-1",
      "sourceOutput": "exec",
      "target": "end-1",
      "targetInput": "exec"
    }
  ],
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2024-01-15T10:00:00.000Z"
  }
}
```

## クイックリファレンス

### ノードタイプ別のテンプレート

#### 1. Start Node（開始ノード）

```json
{
  "id": "start-1",
  "label": "Start",
  "type": "start",
  "x": 100,
  "y": 100,
  "data": {
    "title": "Start",
    "name": "シナリオ開始"
  }
}
```

**新機能:** `name` フィールドでノードにラベル名を付けられます。ラベル名はノードの上部に表示されます。

#### 2. Action Node（アクションノード）

```json
{
  "id": "action-1",
  "label": "Action",
  "type": "action",
  "x": 350,
  "y": 100,
  "data": {
    "title": "アクションのタイトル",
    "name": "重要な行動",
    "text": "ここにアクションの説明を記述します。",
    "imageUrl": "https://placehold.co/200x150"
  }
}
```

**`name` フィールド:** ノード上部に表示されるラベル名（省略可能）

#### 3. Condition Node（条件分岐ノード）

```json
{
  "id": "condition-1",
  "label": "Condition",
  "type": "condition",
  "x": 600,
  "y": 100,
  "data": {
    "title": "条件チェック",
    "name": "分岐点A",
    "text": "条件の説明",
    "conditionExpression": "value > 10"
  }
}
```

**重要**: 条件ノードは2つの出力があります
- `"sourceOutput": "true"` - 条件が真の場合
- `"sourceOutput": "false"` - 条件が偽の場合

#### 4. Character Node（キャラクターノード）

```json
{
  "id": "character-1",
  "label": "Character",
  "type": "character",
  "x": 200,
  "y": 300,
  "data": {
    "title": "Character",
    "name": "主人公",
    "characterName": "キャラクター名",
    "role": "Protagonist",
    "text": "キャラクターの説明",
    "imageUrl": "https://placehold.co/200x150",
    "attributes": {
      "age": 25,
      "occupation": "職業"
    },
    "relationships": []
  }
}
```

**role（役割）の値:**
- `"Protagonist"` - 主人公
- `"Antagonist"` - 敵対者
- `"Supporting"` - 脇役

#### 5. Event Node（イベントノード）

```json
{
  "id": "event-1",
  "label": "Event",
  "type": "event",
  "x": 500,
  "y": 400,
  "data": {
    "title": "Event",
    "name": "重要イベント",
    "eventName": "イベント名",
    "text": "イベントの説明",
    "imageUrl": "https://placehold.co/200x150",
    "timestamp": "2024-01-15T14:30:00.000Z",
    "duration": 3600,
    "location": "場所",
    "participants": []
  }
}
```

**タイムスタンプの形式**: `YYYY-MM-DDTHH:mm:ss.sssZ`
**duration**: 秒単位（3600 = 1時間）

#### 6. End Node（終了ノード）

```json
{
  "id": "end-1",
  "label": "End",
  "type": "end",
  "x": 1000,
  "y": 100,
  "data": {
    "title": "End",
    "name": "エンディング"
  }
}
```

### 接続のテンプレート

#### 基本的な接続

```json
{
  "id": "conn-1",
  "source": "start-1",
  "sourceOutput": "exec",
  "target": "action-1",
  "targetInput": "exec"
}
```

#### 条件分岐の接続

```json
{
  "id": "conn-2",
  "source": "condition-1",
  "sourceOutput": "true",
  "target": "action-success",
  "targetInput": "exec"
},
{
  "id": "conn-3",
  "source": "condition-1",
  "sourceOutput": "false",
  "target": "action-fail",
  "targetInput": "exec"
}
```

## 完全な例：シンプルなストーリー

以下は、完全に動作するシナリオの例です。**v2.1.0の新機能である`name`フィールドを使用しています。**

```json
{
  "nodes": [
    {
      "id": "start-1",
      "label": "Start",
      "type": "start",
      "x": 100,
      "y": 200,
      "data": {
        "title": "物語の始まり",
        "name": "プロローグ"
      }
    },
    {
      "id": "char-hero",
      "label": "Character",
      "type": "character",
      "x": 100,
      "y": 400,
      "data": {
        "title": "Character",
        "name": "主人公",
        "characterName": "勇者アレックス",
        "role": "Protagonist",
        "text": "正義感の強い若き勇者",
        "imageUrl": "https://placehold.co/200x150",
        "attributes": {
          "age": 20,
          "weapon": "剣",
          "level": 5
        },
        "relationships": []
      }
    },
    {
      "id": "action-depart",
      "label": "Action",
      "type": "action",
      "x": 400,
      "y": 200,
      "data": {
        "title": "旅立ち",
        "name": "冒険の始まり",
        "text": "勇者は魔王を倒すために旅立った。",
        "imageUrl": "https://placehold.co/200x150"
      }
    },
    {
      "id": "event-village",
      "label": "Event",
      "type": "event",
      "x": 400,
      "y": 400,
      "data": {
        "title": "Event",
        "name": "村イベント",
        "eventName": "村での出会い",
        "text": "道中の村で仲間と出会う",
        "imageUrl": "https://placehold.co/200x150",
        "timestamp": "2024-01-15T10:00:00.000Z",
        "duration": 1800,
        "location": "平和の村",
        "participants": ["char-hero"]
      }
    },
    {
      "id": "action-forest",
      "label": "Action",
      "type": "action",
      "x": 700,
      "y": 200,
      "data": {
        "title": "森の探索",
        "name": "暗黒の森",
        "text": "魔王の城へ続く暗黒の森を抜ける。",
        "imageUrl": "https://placehold.co/200x150"
      }
    },
    {
      "id": "condition-monster",
      "label": "Condition",
      "type": "condition",
      "x": 1000,
      "y": 200,
      "data": {
        "title": "モンスター遭遇",
        "name": "戦闘判定",
        "text": "モンスターに遭遇した！戦いますか？",
        "conditionExpression": "fight_choice == true"
      }
    },
    {
      "id": "action-battle",
      "label": "Action",
      "type": "action",
      "x": 1300,
      "y": 100,
      "data": {
        "title": "戦闘",
        "name": "勝利への道",
        "text": "勇者はモンスターと戦った！",
        "imageUrl": "https://placehold.co/200x150"
      }
    },
    {
      "id": "action-flee",
      "label": "Action",
      "type": "action",
      "x": 1300,
      "y": 300,
      "data": {
        "title": "逃走",
        "name": "撤退",
        "text": "勇者は逃げ出した。",
        "imageUrl": "https://placehold.co/200x150"
      }
    },
    {
      "id": "end-success",
      "label": "End",
      "type": "end",
      "x": 1600,
      "y": 100,
      "data": {
        "title": "勝利",
        "name": "ハッピーエンド"
      }
    },
    {
      "id": "end-flee",
      "label": "End",
      "type": "end",
      "x": 1600,
      "y": 300,
      "data": {
        "title": "撤退",
        "name": "バッドエンド"
      }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "source": "start-1",
      "sourceOutput": "exec",
      "target": "action-depart",
      "targetInput": "exec"
    },
    {
      "id": "conn-2",
      "source": "char-hero",
      "sourceOutput": "entity",
      "target": "event-village",
      "targetInput": "participants"
    },
    {
      "id": "conn-3",
      "source": "action-depart",
      "sourceOutput": "exec",
      "target": "action-forest",
      "targetInput": "exec"
    },
    {
      "id": "conn-4",
      "source": "action-forest",
      "sourceOutput": "exec",
      "target": "condition-monster",
      "targetInput": "exec"
    },
    {
      "id": "conn-5",
      "source": "condition-monster",
      "sourceOutput": "true",
      "target": "action-battle",
      "targetInput": "exec"
    },
    {
      "id": "conn-6",
      "source": "condition-monster",
      "sourceOutput": "false",
      "target": "action-flee",
      "targetInput": "exec"
    },
    {
      "id": "conn-7",
      "source": "action-battle",
      "sourceOutput": "exec",
      "target": "end-success",
      "targetInput": "exec"
    },
    {
      "id": "conn-8",
      "source": "action-flee",
      "sourceOutput": "exec",
      "target": "end-flee",
      "targetInput": "exec"
    }
  ],
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2024-01-15T10:00:00.000Z",
    "description": "勇者の冒険物語",
    "author": "手動作成",
    "tags": ["ファンタジー", "RPG", "冒険"]
  }
}
```

## よくある間違い

### ❌ カンマの抜け・余分

```json
{
  "nodes": [
    {...}  // ← カンマが必要
    {...}
  ]
}
```

✅ 正しい：
```json
{
  "nodes": [
    {...},  // ← カンマあり
    {...}   // ← 最後の要素にはカンマ不要
  ]
}
```

### ❌ 文字列のクォート忘れ

```json
{
  "type": start  // ← 間違い
}
```

✅ 正しい：
```json
{
  "type": "start"  // ← ダブルクォートで囲む
}
```

### ❌ 存在しないノードIDへの接続

```json
{
  "source": "node-999",  // ← このIDのノードが存在しない
  "target": "node-1"
}
```

### ❌ ソケット名の間違い

```json
{
  "sourceOutput": "output",  // ← 存在しないソケット名
  "targetInput": "input"
}
```

✅ 正しい：
```json
{
  "sourceOutput": "exec",  // ← 正しいソケット名
  "targetInput": "exec"
}
```

## 座標配置のヒント

### 水平方向のレイアウト

```
x座標の目安:
100  →  350  →  600  →  850  →  1100

[Start] → [Action] → [Condition] → [Action] → [End]
```

- ノード間隔: 250px推奨
- 最小間隔: 64px以上

### 垂直方向の分岐

```
                 y=50   [Action Success]
                          ↗
x=600    [Condition]
                          ↘
                 y=150  [Action Fail]
```

- 分岐の垂直間隔: 100px推奨

## チェックリスト

JSONファイルを作成したら、以下を確認してください：

- [ ] 全てのノードに`id`, `label`, `type`, `x`, `y`, `data`がある
- [ ] ノードIDがユニーク（重複していない）
- [ ] 全ての接続に`id`, `source`, `sourceOutput`, `target`, `targetInput`がある
- [ ] 接続の`source`と`target`が存在するノードIDを参照している
- [ ] ソケット名が正しい（`exec`, `true`, `false`など）
- [ ] JSON構文が正しい（カンマ、クォートなど）
- [ ] `metadata.version`が`"2.0.0"`になっている
- [ ] （オプション）`name`フィールドでノードにラベル名を設定

## JSONバリデーションツール

作成したJSONが正しいか確認するツール：

1. **JSONLint** - https://jsonlint.com/
   - JSONの構文チェック

2. **VSCode** - JSON編集時に自動でエラーチェック

3. **オンラインフォーマッター**
   - インデントを整える
   - 見やすくする

## ファイル名の推奨形式

```
scenario_YYYYMMDD_HHMM.json
例: scenario_20240115_1030.json

または

{scenario_name}.json
例: rpg_quest_dragon.json
```

## 保存時の注意

- **文字コード**: UTF-8で保存
- **改行コード**: LF または CRLF
- **拡張子**: `.json`
- **BOM**: BOMなし推奨

## テスト方法

1. JSONファイルをシナリオエディタでインポート
2. ブラウザコンソール（F12）を開いてエラーを確認
3. ノードが正しい位置に配置されているか確認
4. 接続が正しく表示されているか確認

## サポート

問題が発生した場合：
1. ブラウザコンソールのエラーメッセージを確認
2. JSONLintで構文エラーをチェック
3. 仕様書（IMPORT_DATA_SPECIFICATION.md）を参照
4. 最小構成のテンプレートから始めて段階的に追加

---

**ヒント**: 大きなシナリオを作成する場合は、小さな単位で作成してテストし、徐々に拡張していくと良いでしょう。
