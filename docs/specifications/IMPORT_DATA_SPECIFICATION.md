# シナリオエディタ インポートデータ仕様書 v2.1.0

## 概要

このドキュメントは、シナリオエディタのインポート機能で使用されるJSONデータフォーマットの完全な仕様を定義します。外部プログラムでデータを生成する場合や、手動でJSONファイルを作成する場合に参照してください。

## 🆕 v2.1.0の新機能

### ノードラベル名機能
全てのノードタイプに `labelName` フィールドが追加されました。このラベル名はノードの種類名の上部に表示され、シナリオの視認性を大幅に向上させます。

**特徴:**
- ノード上部に表示
- 空文字列の場合は非表示
- 編集パネルで簡単に編集可能
- JSONデータに自動保存

**新しいdataフィールド:**
```json
{
  "data": {
    "labelName": "ノードのラベル名"  // ← 新規追加（オプション）
  }
}
```

### ノードサイズの拡大
全てのノードの横幅が1.5倍に拡大され、テキストがより読みやすくなりました。

**変更点:**
- ノードの最小幅: 200px → 300px
- 画像サイズ: 160px × 120px → 240px × 180px
- テキスト表示領域の拡大

## 目次

1. [基本構造](#基本構造)
2. [ノードタイプ一覧](#ノードタイプ一覧)
3. [接続（コネクション）の定義](#接続コネクションの定義)
4. [ソケットタイプ](#ソケットタイプ)
5. [各ノードタイプの詳細仕様](#各ノードタイプの詳細仕様)
6. [サンプルデータ](#サンプルデータ)
7. [バリデーションルール](#バリデーションルール)

---

## 基本構造

JSONファイルは以下の3つの主要セクションで構成されます。

```json
{
  "nodes": [...],
  "connections": [...],
  "metadata": {...}
}
```

### トップレベルプロパティ

| プロパティ | 型 | 必須 | 説明 |
|----------|---|-----|------|
| `nodes` | Array | ✓ | ノードの配列 |
| `connections` | Array | ✓ | 接続の配列 |
| `metadata` | Object | ✓ | メタデータ情報 |

### メタデータオブジェクト

```json
{
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2024-01-01T00:00:00.000Z",
    "description": "シナリオの説明（オプション）",
    "author": "作成者名（オプション）",
    "tags": ["tag1", "tag2"]
  }
}
```

| プロパティ | 型 | 必須 | 説明 |
|----------|---|-----|------|
| `version` | String | ✓ | データフォーマットバージョン（現在: "2.0.0"） |
| `exported_at` | String | 推奨 | ISO 8601形式のタイムスタンプ |
| `description` | String | - | シナリオの説明 |
| `author` | String | - | 作成者名 |
| `tags` | Array | - | タグの配列 |

**注:** バージョン2.1.0の機能を使用していても、`version`は"2.0.0"のままで問題ありません。`name`フィールドは下位互換性があります。

---

## ノードタイプ一覧

| ノードタイプ | type値 | 説明 | 主な用途 |
|------------|--------|------|---------|
| **Start Node** | `start` | 開始ノード | フローの開始点 |
| **Action Node** | `action` | アクションノード | 処理、操作、行動の表現 |
| **Condition Node** | `condition` | 条件分岐ノード | if/else、条件判定 |
| **End Node** | `end` | 終了ノード | フローの終了点 |
| **Image Node** | `image` | 画像ノード | 画像リソースの管理 |
| **Content Node** | `content` | コンテンツノード | 一般的なコンテンツ |
| **Character Node** | `character` | キャラクターノード | キャラクター情報 |
| **Event Node** | `event` | イベントノード | イベントの定義 |
| **Timer Node** | `timer` | タイマーノード | 時間制御、遅延処理 |
| **External Resource Node** | `external-resource` | 外部リソースノード | API、ファイル、DB接続 |

---

## 接続（コネクション）の定義

ノード間の接続を定義します。

### 接続オブジェクト

```json
{
  "id": "unique-connection-id",
  "source": "source-node-id",
  "sourceOutput": "exec",
  "target": "target-node-id",
  "targetInput": "exec"
}
```

### プロパティ

| プロパティ | 型 | 必須 | 説明 |
|----------|---|-----|------|
| `id` | String | ✓ | 接続の一意識別子 |
| `source` | String | ✓ | 接続元ノードのID |
| `sourceOutput` | String | ✓ | 接続元のソケット名 |
| `target` | String | ✓ | 接続先ノードのID |
| `targetInput` | String | ✓ | 接続先のソケット名 |

---

## ソケットタイプ

ノードの入出力ポイント（ソケット）の種類と互換性。

| ソケット名 | 型 | アイコン | 説明 | 色 |
|----------|---|---------|------|-----|
| `exec` | event | ⚡ | 実行フロー | Gold |
| `true` | event | ⚡ | True分岐 | Gold |
| `false` | event | ⚡ | False分岐 | Gold |
| `text` | string | ✏️ | テキスト入力 | Mint |
| `content` | content | 📝 | リッチコンテンツ | Pink |
| `image` | image | 🖼️ | 画像データ | Purple |
| `entity` | entity | 🔗 | エンティティ参照 | Rose |
| `meta` | meta | ⚙️ | メタデータ | Salmon |
| `time` | time | ⏰ | 時刻・期間 | Bronze |
| `value` | bool | 🔀 | 真偽値 | Red |
| `condition` | bool | 🔀 | 条件値 | Red |
| `delay` | number | 🔢 | 数値（秒） | Teal |
| `url` | string | ✏️ | URL文字列 | Mint |
| `data` | meta | ⚙️ | 任意データ | Salmon |
| `participants` | list | 📋 | リスト | Sky Blue |

### ソケット互換性

以下のソケット間は相互接続可能です：

- `string` ⟷ `content`
- `number` → `string`
- `bool` → `string`, `number`
- `entity` → `string`, `meta`
- `list` → `meta`
- `time` → `string`, `number`

---

## 各ノードタイプの詳細仕様

### 1. Start Node（開始ノード）

**type:** `start`

フローの開始点を表すノード。

#### ノードオブジェクト

```json
{
  "id": "start-1",
  "label": "Start",
  "type": "start",
  "x": 100,
  "y": 100,
  "data": {
    "title": "Start",
    "name": "シナリオ開始",
    "imageUrl": "https://placehold.co/150x100/4ade80/ffffff?text=Start"
  }
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|----------|---|-----|------------|------|
| `id` | String | ✓ | - | ノードの一意識別子 |
| `label` | String | ✓ | "Start" | ノードのラベル |
| `type` | String | ✓ | "start" | ノードタイプ |
| `x` | Number | ✓ | 0 | X座標（ピクセル） |
| `y` | Number | ✓ | 0 | Y座標（ピクセル） |
| `data.title` | String | - | "Start" | タイトル |
| `data.labelName` | String | - | "" | **🆕 ノードラベル名（上部に表示）** |
| `data.imageUrl` | String | - | (デフォルト画像) | 表示画像のURL |
| `data.url` | String | - | - | Base64エンコード画像 |

#### ソケット

**出力:**
- `exec` (event): 実行フロー

---

### 2. Action Node（アクションノード）

**type:** `action`

処理、操作、行動を表すノード。

#### ノードオブジェクト

```json
{
  "id": "action-1",
  "label": "Action",
  "type": "action",
  "x": 350,
  "y": 100,
  "data": {
    "title": "Action Node",
    "name": "重要な行動",
    "text": "This is the default action text.",
    "imageUrl": "https://placehold.co/200x150",
    "url": "data:image/png;base64,..."
  }
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|----------|---|-----|------------|------|
| `data.title` | String | - | "Action Node" | タイトル |
| `data.labelName` | String | - | "" | **🆕 ノードラベル名** |
| `data.text` | String | - | "" | アクションの説明テキスト |
| `data.imageUrl` | String | - | (デフォルト画像) | 表示画像のURL |
| `data.url` | String | - | - | Base64エンコード画像 |

#### ソケット

**入力:**
- `exec` (event): 実行フロー
- `text` (string, 複数可): テキスト入力

**出力:**
- `exec` (event): 実行フロー
- `content` (content): コンテンツ出力

---

### 3. Condition Node（条件分岐ノード）

**type:** `condition`

条件分岐を表すノード。

#### ノードオブジェクト

```json
{
  "id": "condition-1",
  "label": "Condition",
  "type": "condition",
  "x": 600,
  "y": 100,
  "data": {
    "title": "Condition Node",
    "name": "分岐点A",
    "text": "This is the default condition text.",
    "imageUrl": "https://placehold.co/200x150",
    "conditionExpression": "value > 10"
  }
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|----------|---|-----|------------|------|
| `data.title` | String | - | "Condition Node" | タイトル |
| `data.labelName` | String | - | "" | **🆕 ノードラベル名** |
| `data.text` | String | - | "" | 条件の説明テキスト |
| `data.imageUrl` | String | - | (デフォルト画像) | 表示画像のURL |
| `data.conditionExpression` | String | - | "" | 条件式 |

#### ソケット

**入力:**
- `exec` (event): 実行フロー
- `condition` (bool): 条件値

**出力:**
- `true` (event): True分岐
- `false` (event): False分岐
- `value` (bool): 条件値の出力

---

### 4. End Node（終了ノード）

**type:** `end`

フローの終了点を表すノード。

#### ノードオブジェクト

```json
{
  "id": "end-1",
  "label": "End",
  "type": "end",
  "x": 850,
  "y": 100,
  "data": {
    "title": "End",
    "name": "エンディング",
    "imageUrl": "https://placehold.co/150x100/ef4444/ffffff?text=End"
  }
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|----------|---|-----|------------|------|
| `data.title` | String | - | "End" | タイトル |
| `data.labelName` | String | - | "" | **🆕 ノードラベル名** |
| `data.imageUrl` | String | - | (デフォルト画像) | 表示画像のURL |

#### ソケット

**入力:**
- `exec` (event): 実行フロー

---

### 5. Content Node（コンテンツノード）

**type:** `content`

一般的なコンテンツを表すノード。

#### ノードオブジェクト

```json
{
  "id": "content-1",
  "label": "Content",
  "type": "content",
  "x": 400,
  "y": 300,
  "data": {
    "title": "Node Title",
    "name": "コンテンツA",
    "text": "This is the default text content for the node.",
    "imageUrl": "https://placehold.co/200x150"
  }
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|----------|---|-----|------------|------|
| `data.title` | String | - | "Node Title" | タイトル |
| `data.labelName` | String | - | "" | **🆕 ノードラベル名** |
| `data.text` | String | - | "" | コンテンツテキスト |
| `data.imageUrl` | String | - | (デフォルト画像) | 表示画像のURL |

#### ソケット

**入力:**
- `exec` (event): 実行フロー

**出力:**
- `exec` (event): 実行フロー
- `content` (content): コンテンツ出力

---

### 6. Character Node（キャラクターノード）

**type:** `character`

キャラクター情報を管理するノード。

#### ノードオブジェクト

```json
{
  "id": "character-1",
  "label": "Character",
  "type": "character",
  "x": 200,
  "y": 400,
  "data": {
    "title": "Character",
    "name": "主人公",
    "text": "Character description",
    "imageUrl": "https://placehold.co/200x150",
    "characterName": "John Doe",
    "role": "Protagonist",
    "attributes": {
      "age": 25,
      "occupation": "Detective",
      "skill": "Investigation"
    },
    "relationships": [
      {
        "targetId": "character-2",
        "type": "friend",
        "description": "Childhood friend"
      }
    ]
  }
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|----------|---|-----|------------|------|
| `data.title` | String | - | "Character" | タイトル |
| `data.labelName` | String | - | "" | **🆕 ノードラベル名** |
| `data.text` | String | - | "" | キャラクターの説明 |
| `data.imageUrl` | String | - | (デフォルト画像) | キャラクター画像のURL |
| `data.characterName` | String | - | "New Character" | キャラクター名 |
| `data.role` | String | - | "Protagonist" | 役割（Protagonist, Antagonist, Supporting等） |
| `data.attributes` | Object | - | {} | 任意の属性（年齢、職業など） |
| `data.relationships` | Array | - | [] | 他キャラクターとの関係 |

#### relationships配列の要素

| プロパティ | 型 | 必須 | 説明 |
|----------|---|-----|------|
| `targetId` | String | ✓ | 関係先キャラクターのノードID |
| `type` | String | ✓ | 関係の種類（friend, enemy, family等） |
| `description` | String | - | 関係の説明 |

#### ソケット

**入力:**
- `exec` (event): 実行フロー

**出力:**
- `exec` (event): 実行フロー
- `entity` (entity): キャラクター参照
- `meta` (meta): キャラクターデータ

---

### 7. Event Node（イベントノード）

**type:** `event`

イベントの定義と管理を行うノード。

#### ノードオブジェクト

```json
{
  "id": "event-1",
  "label": "Event",
  "type": "event",
  "x": 500,
  "y": 500,
  "data": {
    "title": "Event",
    "name": "重要イベント",
    "text": "Event description",
    "imageUrl": "https://placehold.co/200x150",
    "eventName": "Battle at the Bridge",
    "timestamp": "2024-01-15T14:30:00.000Z",
    "duration": 3600,
    "location": "Old Bridge",
    "participants": ["character-1", "character-2"]
  }
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|----------|---|-----|------------|------|
| `data.title` | String | - | "Event" | タイトル |
| `data.labelName` | String | - | "" | **🆕 ノードラベル名** |
| `data.text` | String | - | "" | イベントの説明 |
| `data.imageUrl` | String | - | (デフォルト画像) | イベント画像のURL |
| `data.eventName` | String | - | "New Event" | イベント名 |
| `data.timestamp` | String | - | (現在時刻) | ISO 8601形式のタイムスタンプ |
| `data.duration` | Number | - | 0 | イベントの継続時間（秒） |
| `data.location` | String | - | "" | イベントの場所 |
| `data.participants` | Array | - | [] | 参加者のノードID配列 |

#### ソケット

**入力:**
- `exec` (event): 実行フロー
- `participants` (list, 複数可): 参加者リスト

**出力:**
- `exec` (event): 実行フロー
- `time` (time): タイムスタンプ
- `content` (content): イベント説明

---

### 8. Timer Node（タイマーノード）

**type:** `timer`

時間制御や遅延処理を行うノード。

#### ノードオブジェクト

```json
{
  "id": "timer-1",
  "label": "Timer",
  "type": "timer",
  "x": 300,
  "y": 600,
  "data": {
    "title": "Timer",
    "name": "カウントダウン",
    "text": "Timer configuration",
    "imageUrl": "https://placehold.co/200x150",
    "timerType": "delay",
    "delaySeconds": 5,
    "scheduledTime": "",
    "repeat": false,
    "repeatInterval": 0
  }
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|----------|---|-----|------------|------|
| `data.title` | String | - | "Timer" | タイトル |
| `data.labelName` | String | - | "" | **🆕 ノードラベル名** |
| `data.text` | String | - | "" | タイマーの説明 |
| `data.imageUrl` | String | - | (デフォルト画像) | 画像のURL |
| `data.timerType` | String | - | "delay" | タイマータイプ（delay/schedule/deadline） |
| `data.delaySeconds` | Number | - | 5 | 遅延時間（秒） |
| `data.scheduledTime` | String | - | "" | スケジュール時刻（ISO 8601形式） |
| `data.repeat` | Boolean | - | false | 繰り返し実行 |
| `data.repeatInterval` | Number | - | 0 | 繰り返し間隔（秒） |

#### timerTypeの値

- `delay`: 指定秒数の遅延
- `schedule`: 特定時刻に実行
- `deadline`: 期限までの時間

#### ソケット

**入力:**
- `exec` (event): 実行フロー
- `delay` (number): 遅延時間（秒）

**出力:**
- `exec` (event): 実行フロー
- `time` (time): タイムスタンプ

---

### 9. Image Node（画像ノード）

**type:** `image`

画像リソースを管理するノード。

#### ノードオブジェクト

```json
{
  "id": "image-1",
  "label": "Image",
  "type": "image",
  "x": 700,
  "y": 600,
  "data": {
    "title": "Image Node",
    "name": "メイン画像",
    "text": "This is the default image text.",
    "imageUrl": "https://example.com/image.png",
    "url": "data:image/png;base64,iVBORw0KGgo..."
  }
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|----------|---|-----|------------|------|
| `data.title` | String | - | "Image Node" | タイトル |
| `data.labelName` | String | - | "" | **🆕 ノードラベル名** |
| `data.text` | String | - | "" | 画像の説明 |
| `data.imageUrl` | String | - | (デフォルト画像) | 画像のURL |
| `data.url` | String | - | - | Base64エンコード画像 |

#### ソケット

**出力:**
- `image` (image): 画像データ

---

### 10. External Resource Node（外部リソースノード）

**type:** `external-resource`

外部API、ファイル、データベース接続を表すノード。

#### ノードオブジェクト

```json
{
  "id": "external-1",
  "label": "External Resource",
  "type": "external-resource",
  "x": 100,
  "y": 700,
  "data": {
    "title": "External Resource",
    "name": "API接続",
    "text": "External resource configuration",
    "imageUrl": "https://placehold.co/200x150",
    "resourceType": "api",
    "resourceUrl": "https://api.example.com/data",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer token123",
      "Content-Type": "application/json"
    },
    "body": null
  }
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト値 | 説明 |
|----------|---|-----|------------|------|
| `data.title` | String | - | "External Resource" | タイトル |
| `data.labelName` | String | - | "" | **🆕 ノードラベル名** |
| `data.text` | String | - | "" | リソースの説明 |
| `data.imageUrl` | String | - | (デフォルト画像) | 画像のURL |
| `data.resourceType` | String | - | "url" | リソースタイプ（url/api/file/database） |
| `data.resourceUrl` | String | - | "" | リソースのURL |
| `data.method` | String | - | "GET" | HTTPメソッド（GET/POST/PUT/DELETE） |
| `data.headers` | Object | - | {} | HTTPヘッダー |
| `data.body` | Any | - | null | リクエストボディ |

#### resourceTypeの値

- `url`: 一般的なURL
- `api`: REST API
- `file`: ファイルパス
- `database`: データベース接続

#### ソケット

**入力:**
- `exec` (event): 実行フロー

**出力:**
- `exec` (event): 実行フロー
- `url` (string): URL文字列
- `data` (meta): レスポンスデータ

---

## サンプルデータ

### 完全なシナリオ例

```json
{
  "nodes": [
    {
      "id": "start-001",
      "label": "Start",
      "type": "start",
      "x": 100,
      "y": 100,
      "data": {
        "title": "Story Beginning"
      }
    },
    {
      "id": "char-001",
      "label": "Character",
      "type": "character",
      "x": 100,
      "y": 300,
      "data": {
        "characterName": "Alice",
        "role": "Protagonist",
        "text": "A curious young detective",
        "attributes": {
          "age": 28,
          "skill": "Observation"
        }
      }
    },
    {
      "id": "action-001",
      "label": "Action",
      "type": "action",
      "x": 400,
      "y": 100,
      "data": {
        "title": "Investigation Begins",
        "text": "Alice starts investigating the mysterious case."
      }
    },
    {
      "id": "event-001",
      "label": "Event",
      "type": "event",
      "x": 400,
      "y": 300,
      "data": {
        "eventName": "Crime Scene Discovery",
        "text": "A crime scene is discovered at the old warehouse.",
        "timestamp": "2024-03-15T09:00:00.000Z",
        "location": "Old Warehouse District",
        "participants": ["char-001"]
      }
    },
    {
      "id": "condition-001",
      "label": "Condition",
      "type": "condition",
      "x": 700,
      "y": 100,
      "data": {
        "title": "Evidence Found?",
        "text": "Check if evidence was found",
        "conditionExpression": "evidence_count > 0"
      }
    },
    {
      "id": "end-success",
      "label": "End",
      "type": "end",
      "x": 1000,
      "y": 50,
      "data": {
        "title": "Case Solved"
      }
    },
    {
      "id": "end-fail",
      "label": "End",
      "type": "end",
      "x": 1000,
      "y": 200,
      "data": {
        "title": "Case Unsolved"
      }
    }
  ],
  "connections": [
    {
      "id": "conn-001",
      "source": "start-001",
      "sourceOutput": "exec",
      "target": "action-001",
      "targetInput": "exec"
    },
    {
      "id": "conn-002",
      "source": "char-001",
      "sourceOutput": "entity",
      "target": "event-001",
      "targetInput": "participants"
    },
    {
      "id": "conn-003",
      "source": "action-001",
      "sourceOutput": "exec",
      "target": "condition-001",
      "targetInput": "exec"
    },
    {
      "id": "conn-004",
      "source": "condition-001",
      "sourceOutput": "true",
      "target": "end-success",
      "targetInput": "exec"
    },
    {
      "id": "conn-005",
      "source": "condition-001",
      "sourceOutput": "false",
      "target": "end-fail",
      "targetInput": "exec"
    }
  ],
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2024-03-15T10:00:00.000Z",
    "description": "Detective story scenario - Case of the Old Warehouse",
    "author": "Scenario Designer",
    "tags": ["detective", "mystery", "investigation"]
  }
}
```

---

## バリデーションルール

### 必須検証項目

1. **トップレベル構造**
   - `nodes`配列が存在し、配列型であること
   - `connections`配列が存在し、配列型であること
   - `metadata`オブジェクトが存在すること

2. **ノードの検証**
   - 各ノードに`id`、`label`、`type`、`x`、`y`が存在すること
   - `id`がユニークであること
   - `type`が定義済みタイプのいずれかであること
   - `x`と`y`が数値であること

3. **接続の検証**
   - 各接続に`id`、`source`、`sourceOutput`、`target`、`targetInput`が存在すること
   - `source`と`target`が存在するノードIDを参照していること
   - `sourceOutput`が接続元ノードに定義されているソケット名であること
   - `targetInput`が接続先ノードに定義されているソケット名であること

### 推奨事項

1. **座標の範囲**
   - x, y座標は0以上の値を推奨
   - ノード間の最小距離: 64px以上

2. **ID命名規則**
   - ノードID: `{type}-{number}` 形式を推奨（例: `action-001`）
   - 接続ID: `conn-{number}` 形式を推奨（例: `conn-001`）

3. **画像URL**
   - HTTPSプロトコルの使用を推奨
   - Base64エンコードを使用する場合は、適切なデータURIスキーマを使用

4. **タイムスタンプ**
   - ISO 8601形式（YYYY-MM-DDTHH:mm:ss.sssZ）を使用

---

## エラー処理

インポート時に以下のエラーが発生する可能性があります：

| エラーメッセージ | 原因 | 対処方法 |
|----------------|------|---------|
| `Invalid JSON file` | JSON構文エラー | JSONフォーマットを確認 |
| `nodes must be an array` | nodes配列が不正 | nodesを配列として定義 |
| `connections must be an array` | connections配列が不正 | connectionsを配列として定義 |
| `Unknown node type: {type}` | 未知のノードタイプ | サポートされているタイプを使用 |
| `Node view not found for {id}` | ノードIDが重複または不正 | ノードIDをユニークに |
| `Invalid connection: source output or target input not found` | ソケット名が不正 | 正しいソケット名を使用 |

---

## 付録

### A. ID生成の推奨方法

**JavaScript/TypeScript:**
```javascript
// UUID v4
const nodeId = crypto.randomUUID();

// カスタム形式
const nodeId = `${nodeType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 連番形式
let counter = 1;
const nodeId = `${nodeType}-${String(counter++).padStart(3, '0')}`;
```

**Python:**
```python
import uuid

# UUID v4
node_id = str(uuid.uuid4())

# カスタム形式
import time
import random
node_id = f"{node_type}-{int(time.time())}-{random.randint(1000, 9999)}"
```

### B. 画像のBase64エンコード

**JavaScript/Browser:**
```javascript
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

**Python:**
```python
import base64

def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        encoded = base64.b64encode(image_file.read()).decode('utf-8')
        return f"data:image/png;base64,{encoded}"
```

### C. バージョン互換性

| バージョン | リリース日 | 主な変更点 |
|----------|-----------|----------|
| 2.1.1 | 2025-01 | ノード横幅1.5倍拡大（300px）、画像サイズ拡大（240px×180px）、ソケット接続位置の修正 |
| 2.1.0 | 2025-01 | ノードラベル名機能追加（`labelName`フィールド）、レイアウト改善（ソケット・画像・テキスト配置最適化） |
| 2.0.0 | 2024-01 | 座標情報の正確な保存、全ノードへのImageControl追加 |
| 1.0.0 | 2023-12 | 初期リリース |

#### 下位互換性
- v2.1.1の`labelName`フィールドはオプションです
- 既存のv2.1.0、v2.0.0およびv1.0.0のJSONファイルは引き続き動作します
- `labelName`フィールドがない場合は空文字列として扱われます

#### 上位互換性
- v2.1.1で作成したファイルは、`labelName`フィールドを無視すればv2.0.0でも読み込めます
- ただし、ラベル名は表示されず、ノードサイズが異なる可能性があります

### D. ノードサイズ情報（v2.1.1以降）

画像を含むノードは横幅が拡大されました：

| 要素 | v2.1.0以前 | v2.1.1以降 | 備考 |
|-----|-----------|-----------|------|
| ノード最小幅 | 200px | 300px | 1.5倍 |
| 画像表示幅 | 160px | 240px | 1.5倍 |
| 画像表示高さ | 120px | 180px | 1.5倍 |
| ラベル名最大幅 | 220px | 330px | 1.5倍 |

**注意:** 既存のJSONファイルは座標調整なしで読み込めますが、ノードが大きくなるため、重なりが発生する可能性があります。ノード間隔は最低でも320px以上を推奨します。

---

## 問い合わせ

仕様に関する質問や不明点がある場合は、プロジェクトのIssueトラッカーまでお問い合わせください。

---

**ドキュメントバージョン:** 2.1.1  
**最終更新日:** 2025-01-07
