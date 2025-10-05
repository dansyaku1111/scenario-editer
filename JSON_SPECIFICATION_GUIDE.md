# シナリオエディタ JSONファイル完全ガイド

## 目次
- [概要](#概要)
- [JSON構造の基本](#json構造の基本)
- [ノードタイプ完全リファレンス](#ノードタイプ完全リファレンス)
- [接続の仕様](#接続の仕様)
- [実践例](#実践例)
- [よくある間違いと対策](#よくある間違いと対策)
- [高度な使い方](#高度な使い方)

---

## 概要

このガイドは、シナリオエディタで使用するJSONファイルの完全な仕様と作成方法を説明します。

### バージョン情報
- **JSONスキーマバージョン**: 2.0.0
- **エディタバージョン**: 2.1.0
- **対応ノードタイプ**: 10種類
- **最終更新**: 2025年10月5日

### 新機能 (v2.1.0)
- ✨ **カスタムラベル名**: すべてのノードに`labelName`プロパティ追加
- ✨ **境界線上ソケット**: 新しいビジュアルレイアウト
- ✨ **画像固定サイズ**: 160px幅で統一表示

---

## JSON構造の基本

### 最小構成テンプレート

```json
{
  "nodes": [],
  "connections": [],
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### ルートオブジェクトの構造

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `nodes` | array | ✅ Yes | ノードの配列 |
| `connections` | array | ✅ Yes | 接続の配列 |
| `metadata` | object | ✅ Yes | メタデータ |

### Metadataオブジェクト

```json
{
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2025-01-01T12:00:00.000Z",
    "description": "シナリオの説明",
    "author": "作成者名",
    "tags": ["タグ1", "タグ2"]
  }
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `version` | string | ✅ Yes | スキーマバージョン（"2.0.0"固定） |
| `exported_at` | string | ✅ Yes | エクスポート日時（ISO 8601形式） |
| `description` | string | ❌ No | シナリオの説明 |
| `author` | string | ❌ No | 作成者名 |
| `tags` | array | ❌ No | タグの配列 |

---

## ノードタイプ完全リファレンス

### 共通プロパティ

すべてのノードが持つ共通プロパティ：

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | string | ✅ Yes | ノードの一意なID |
| `label` | string | ✅ Yes | ノードタイプ（表示名） |
| `type` | string | ✅ Yes | ノードタイプ識別子 |
| `x` | number | ✅ Yes | X座標（キャンバス上の位置） |
| `y` | number | ✅ Yes | Y座標（キャンバス上の位置） |
| `data` | object | ✅ Yes | ノード固有のデータ |

### ノード共通のdataプロパティ

| フィールド | 型 | 必須 | 説明 | 新機能 |
|-----------|-----|------|------|---------|
| `labelName` | string | ❌ No | カスタムラベル名（ノード上部に表示） | ✨ v2.1.0 |
| `title` | string | ❌ No | ノードのタイトル |  |
| `text` | string | ❌ No | ノードの説明文 |  |
| `imageUrl` | string | ❌ No | 画像URL（外部URL） |  |
| `url` | string | ❌ No | 画像データ（Base64エンコード） |  |

---

## 1. Start Node（開始ノード）

### 基本情報
- **type**: `"start"`
- **label**: `"Start"`
- **ソケット**: 出力のみ（`exec`）

### テンプレート

```json
{
  "id": "start-1",
  "label": "Start",
  "type": "start",
  "x": 100,
  "y": 100,
  "data": {
    "title": "Start",
    "labelName": "シナリオ開始",
    "imageUrl": "https://placehold.co/150x100/4ade80/ffffff?text=Start"
  }
}
```

### dataプロパティ

| フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `title` | string | ❌ No | "Start" | タイトル |
| `labelName` | string | ❌ No | "Start" | カスタムラベル名 |
| `imageUrl` | string | ❌ No | 緑のプレースホルダー | 画像URL |
| `url` | string | ❌ No | - | Base64画像データ |

### ソケット

| 種類 | 名前 | 型 | 説明 |
|-----|------|-----|------|
| Output | `exec` | event | 実行フロー出力 |

---

## 2. End Node（終了ノード）

### 基本情報
- **type**: `"end"`
- **label**: `"End"`
- **ソケット**: 入力のみ（`exec`）

### テンプレート

```json
{
  "id": "end-1",
  "label": "End",
  "type": "end",
  "x": 1000,
  "y": 100,
  "data": {
    "title": "End",
    "labelName": "エンディング",
    "imageUrl": "https://placehold.co/150x100/ef4444/ffffff?text=End"
  }
}
```

### dataプロパティ

| フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `title` | string | ❌ No | "End" | タイトル |
| `labelName` | string | ❌ No | "End" | カスタムラベル名 |
| `imageUrl` | string | ❌ No | 赤のプレースホルダー | 画像URL |
| `url` | string | ❌ No | - | Base64画像データ |

### ソケット

| 種類 | 名前 | 型 | 説明 |
|-----|------|-----|------|
| Input | `exec` | event | 実行フロー入力 |

---

## 3. Action Node（アクションノード）

### 基本情報
- **type**: `"action"`
- **label**: `"Action"`
- **ソケット**: 入力2個、出力2個

### テンプレート

```json
{
  "id": "action-1",
  "label": "Action",
  "type": "action",
  "x": 400,
  "y": 100,
  "data": {
    "title": "Action Node",
    "labelName": "重要な行動",
    "text": "アクションの詳細な説明をここに記述します。",
    "imageUrl": "https://placehold.co/200x150"
  }
}
```

### dataプロパティ

| フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `title` | string | ❌ No | "Action Node" | タイトル |
| `labelName` | string | ❌ No | "Action" | カスタムラベル名 |
| `text` | string | ❌ No | デフォルトテキスト | アクションの説明 |
| `imageUrl` | string | ❌ No | プレースホルダー | 画像URL |
| `url` | string | ❌ No | - | Base64画像データ |

### ソケット

| 種類 | 名前 | 型 | 複数接続 | 説明 |
|-----|------|-----|----------|------|
| Input | `exec` | event | ❌ No | 実行フロー入力 |
| Input | `text` | string | ✅ Yes | テキスト入力（複数可） |
| Output | `exec` | event | ❌ No | 実行フロー出力 |
| Output | `content` | content | ❌ No | コンテンツ出力 |

---

## 4. Condition Node（条件分岐ノード）

### 基本情報
- **type**: `"condition"`
- **label**: `"Condition"`
- **ソケット**: 入力2個、出力3個（true/false分岐）

### テンプレート

```json
{
  "id": "condition-1",
  "label": "Condition",
  "type": "condition",
  "x": 700,
  "y": 100,
  "data": {
    "title": "Condition Node",
    "labelName": "分岐点A",
    "text": "条件の説明",
    "imageUrl": "https://placehold.co/200x150",
    "conditionExpression": "value > 10"
  }
}
```

### dataプロパティ

| フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `title` | string | ❌ No | "Condition Node" | タイトル |
| `labelName` | string | ❌ No | "Condition" | カスタムラベル名 |
| `text` | string | ❌ No | デフォルトテキスト | 条件の説明 |
| `imageUrl` | string | ❌ No | プレースホルダー | 画像URL |
| `url` | string | ❌ No | - | Base64画像データ |
| `conditionExpression` | string | ❌ No | "" | 条件式 |

### ソケット

| 種類 | 名前 | 型 | 複数接続 | 説明 |
|-----|------|-----|----------|------|
| Input | `exec` | event | ❌ No | 実行フロー入力 |
| Input | `condition` | bool | ❌ No | 条件値入力 |
| Output | `true` | event | ❌ No | 条件が真の場合の出力 |
| Output | `false` | event | ❌ No | 条件が偽の場合の出力 |
| Output | `value` | bool | ❌ No | 条件値出力 |

### 使用例：条件分岐

```json
{
  "connections": [
    {
      "id": "conn-true",
      "source": "condition-1",
      "sourceOutput": "true",
      "target": "action-success",
      "targetInput": "exec"
    },
    {
      "id": "conn-false",
      "source": "condition-1",
      "sourceOutput": "false",
      "target": "action-fail",
      "targetInput": "exec"
    }
  ]
}
```

---

## 5. Content Node（コンテンツノード）

### 基本情報
- **type**: `"content"`
- **label**: `"Content"`
- **ソケット**: 入力1個、出力2個

### テンプレート

```json
{
  "id": "content-1",
  "label": "Content",
  "type": "content",
  "x": 400,
  "y": 300,
  "data": {
    "title": "Node Title",
    "labelName": "重要なコンテンツ",
    "text": "コンテンツの詳細な説明。\n複数行も可能です。",
    "imageUrl": "https://placehold.co/200x150"
  }
}
```

### dataプロパティ

| フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `title` | string | ❌ No | "Node Title" | タイトル |
| `labelName` | string | ❌ No | "Content" | カスタムラベル名 |
| `text` | string | ❌ No | デフォルトテキスト | コンテンツ本文 |
| `imageUrl` | string | ❌ No | プレースホルダー | 画像URL |
| `url` | string | ❌ No | - | Base64画像データ |

### ソケット

| 種類 | 名前 | 型 | 説明 |
|-----|------|-----|------|
| Input | `exec` | event | 実行フロー入力 |
| Output | `exec` | event | 実行フロー出力 |
| Output | `content` | content | コンテンツ出力 |

---

## 6. Image Node（画像ノード）

### 基本情報
- **type**: `"image"`
- **label**: `"Image"`
- **ソケット**: 出力のみ（`image`）

### テンプレート

```json
{
  "id": "image-1",
  "label": "Image",
  "type": "image",
  "x": 100,
  "y": 500,
  "data": {
    "title": "Image Node",
    "labelName": "背景画像",
    "text": "画像の説明",
    "imageUrl": "https://placehold.co/200x150"
  }
}
```

### dataプロパティ

| フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `title` | string | ❌ No | "Image Node" | タイトル |
| `labelName` | string | ❌ No | "Image" | カスタムラベル名 |
| `text` | string | ❌ No | デフォルトテキスト | 画像の説明 |
| `imageUrl` | string | ❌ No | プレースホルダー | 画像URL |
| `url` | string | ❌ No | - | Base64画像データ |

### ソケット

| 種類 | 名前 | 型 | 説明 |
|-----|------|-----|------|
| Output | `image` | image | 画像データ出力 |

---

## 7. Character Node（キャラクターノード）

### 基本情報
- **type**: `"character"`
- **label**: `"Character"`
- **ソケット**: 入力1個、出力3個

### テンプレート

```json
{
  "id": "character-1",
  "label": "Character",
  "type": "character",
  "x": 200,
  "y": 400,
  "data": {
    "title": "Character",
    "labelName": "主人公",
    "characterName": "勇者アレックス",
    "role": "Protagonist",
    "text": "正義感の強い若き勇者",
    "imageUrl": "https://placehold.co/200x150",
    "attributes": {
      "age": 20,
      "weapon": "剣",
      "level": 5,
      "hp": 100
    },
    "relationships": [
      {
        "targetId": "character-2",
        "type": "friend",
        "description": "幼馴染"
      }
    ]
  }
}
```

### dataプロパティ

| フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `title` | string | ❌ No | "Character" | タイトル |
| `labelName` | string | ❌ No | "Character" | カスタムラベル名 |
| `characterName` | string | ❌ No | "New Character" | キャラクター名 |
| `role` | string | ❌ No | "Protagonist" | 役割 |
| `text` | string | ❌ No | "Character description" | キャラクター説明 |
| `imageUrl` | string | ❌ No | プレースホルダー | 画像URL |
| `url` | string | ❌ No | - | Base64画像データ |
| `attributes` | object | ❌ No | {} | 属性（任意のキー・値） |
| `relationships` | array | ❌ No | [] | 関係性の配列 |

### roleの値

| 値 | 説明 |
|----|------|
| `"Protagonist"` | 主人公 |
| `"Antagonist"` | 敵対者 |
| `"Supporting"` | 脇役 |
| `"Mentor"` | 師匠・指導者 |
| `"Comic Relief"` | コミックリリーフ |

### relationshipsの構造

```json
{
  "targetId": "character-2",
  "type": "friend",
  "description": "幼馴染"
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `targetId` | string | 関係先のキャラクターID |
| `type` | string | 関係タイプ（friend, enemy, family等） |
| `description` | string | 関係の説明 |

### ソケット

| 種類 | 名前 | 型 | 説明 |
|-----|------|-----|------|
| Input | `exec` | event | 実行フロー入力 |
| Output | `exec` | event | 実行フロー出力 |
| Output | `entity` | entity | キャラクターエンティティ出力 |
| Output | `meta` | meta | メタデータ出力 |

---

## 8. Event Node（イベントノード）

### 基本情報
- **type**: `"event"`
- **label**: `"Event"`
- **ソケット**: 入力2個、出力3個

### テンプレート

```json
{
  "id": "event-1",
  "label": "Event",
  "type": "event",
  "x": 500,
  "y": 400,
  "data": {
    "title": "Event",
    "labelName": "重要イベント",
    "eventName": "村での出会い",
    "text": "道中の村で仲間と出会う",
    "imageUrl": "https://placehold.co/200x150",
    "timestamp": "2025-01-15T10:00:00.000Z",
    "duration": 1800,
    "location": "平和の村",
    "participants": ["character-1", "character-2"]
  }
}
```

### dataプロパティ

| フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `title` | string | ❌ No | "Event" | タイトル |
| `labelName` | string | ❌ No | "Event" | カスタムラベル名 |
| `eventName` | string | ❌ No | "New Event" | イベント名 |
| `text` | string | ❌ No | "Event description" | イベント説明 |
| `imageUrl` | string | ❌ No | プレースホルダー | 画像URL |
| `url` | string | ❌ No | - | Base64画像データ |
| `timestamp` | string | ❌ No | 現在時刻 | イベント発生時刻（ISO 8601） |
| `duration` | number | ❌ No | 0 | イベント期間（秒） |
| `location` | string | ❌ No | "" | 場所 |
| `participants` | array | ❌ No | [] | 参加者IDの配列 |

### timestampの形式

```
YYYY-MM-DDTHH:mm:ss.sssZ
例: 2025-01-15T14:30:00.000Z
```

### ソケット

| 種類 | 名前 | 型 | 複数接続 | 説明 |
|-----|------|-----|----------|------|
| Input | `exec` | event | ❌ No | 実行フロー入力 |
| Input | `participants` | list | ✅ Yes | 参加者入力（複数可） |
| Output | `exec` | event | ❌ No | 実行フロー出力 |
| Output | `time` | time | ❌ No | 時刻情報出力 |
| Output | `content` | content | ❌ No | コンテンツ出力 |

---

## 9. Timer Node（タイマーノード）

### 基本情報
- **type**: `"timer"`
- **label**: `"Timer"`
- **ソケット**: 入力2個、出力2個

### テンプレート

```json
{
  "id": "timer-1",
  "label": "Timer",
  "type": "timer",
  "x": 800,
  "y": 400,
  "data": {
    "title": "Timer",
    "labelName": "待機時間",
    "text": "5秒間待機",
    "imageUrl": "https://placehold.co/200x150",
    "timerType": "delay",
    "delaySeconds": 5,
    "scheduledTime": "",
    "repeat": false,
    "repeatInterval": 0
  }
}
```

### dataプロパティ

| フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `title` | string | ❌ No | "Timer" | タイトル |
| `labelName` | string | ❌ No | "Timer" | カスタムラベル名 |
| `text` | string | ❌ No | "Timer configuration" | タイマー説明 |
| `imageUrl` | string | ❌ No | プレースホルダー | 画像URL |
| `url` | string | ❌ No | - | Base64画像データ |
| `timerType` | string | ❌ No | "delay" | タイマータイプ |
| `delaySeconds` | number | ❌ No | 5 | 遅延秒数 |
| `scheduledTime` | string | ❌ No | "" | 予定時刻（ISO 8601） |
| `repeat` | boolean | ❌ No | false | 繰り返しフラグ |
| `repeatInterval` | number | ❌ No | 0 | 繰り返し間隔（秒） |

### timerTypeの値

| 値 | 説明 |
|----|------|
| `"delay"` | 指定秒数の遅延 |
| `"schedule"` | 特定時刻にトリガー |
| `"deadline"` | 期限設定 |

### ソケット

| 種類 | 名前 | 型 | 説明 |
|-----|------|-----|------|
| Input | `exec` | event | 実行フロー入力 |
| Input | `delay` | number | 遅延時間入力 |
| Output | `exec` | event | 実行フロー出力 |
| Output | `time` | time | 時刻情報出力 |

---

## 10. External Resource Node（外部リソースノード）

### 基本情報
- **type**: `"external-resource"`
- **label**: `"External Resource"`
- **ソケット**: 入力1個、出力3個

### テンプレート

```json
{
  "id": "resource-1",
  "label": "External Resource",
  "type": "external-resource",
  "x": 1000,
  "y": 400,
  "data": {
    "title": "External Resource",
    "labelName": "API接続",
    "text": "外部APIからデータ取得",
    "imageUrl": "https://placehold.co/200x150",
    "resourceType": "api",
    "resourceUrl": "https://api.example.com/data",
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer token"
    },
    "body": null
  }
}
```

### dataプロパティ

| フィールド | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `title` | string | ❌ No | "External Resource" | タイトル |
| `labelName` | string | ❌ No | "External Resource" | カスタムラベル名 |
| `text` | string | ❌ No | 説明テキスト | リソース説明 |
| `imageUrl` | string | ❌ No | プレースホルダー | 画像URL |
| `url` | string | ❌ No | - | Base64画像データ |
| `resourceType` | string | ❌ No | "url" | リソースタイプ |
| `resourceUrl` | string | ❌ No | "" | リソースURL |
| `method` | string | ❌ No | "GET" | HTTPメソッド |
| `headers` | object | ❌ No | {} | HTTPヘッダー |
| `body` | any | ❌ No | null | リクエストボディ |

### resourceTypeの値

| 値 | 説明 |
|----|------|
| `"url"` | 単純なURL参照 |
| `"api"` | REST API |
| `"file"` | ファイル参照 |
| `"database"` | データベース接続 |

### methodの値

| 値 | 説明 |
|----|------|
| `"GET"` | データ取得 |
| `"POST"` | データ送信 |
| `"PUT"` | データ更新 |
| `"DELETE"` | データ削除 |

### ソケット

| 種類 | 名前 | 型 | 説明 |
|-----|------|-----|------|
| Input | `exec` | event | 実行フロー入力 |
| Output | `exec` | event | 実行フロー出力 |
| Output | `url` | string | URL文字列出力 |
| Output | `data` | meta | データ出力 |

---

## 接続の仕様

### 接続オブジェクトの構造

```json
{
  "id": "conn-1",
  "source": "node-1",
  "sourceOutput": "exec",
  "target": "node-2",
  "targetInput": "exec",
  "meta": {
    "label": "接続ラベル",
    "weight": 1.0
  }
}
```

### 必須フィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | string | ✅ Yes | 接続の一意なID |
| `source` | string | ✅ Yes | 始点ノードのID |
| `sourceOutput` | string | ✅ Yes | 始点のソケット名 |
| `target` | string | ✅ Yes | 終点ノードのID |
| `targetInput` | string | ✅ Yes | 終点のソケット名 |
| `meta` | object | ❌ No | メタデータ（オプション） |

### ソケット名一覧

#### 実行フロー系

| ソケット名 | 方向 | 説明 |
|-----------|------|------|
| `exec` | 入出力 | 基本的な実行フロー |
| `true` | 出力 | 条件が真の場合（Conditionノード） |
| `false` | 出力 | 条件が偽の場合（Conditionノード） |

#### データ系

| ソケット名 | 方向 | 説明 |
|-----------|------|------|
| `text` | 入力 | テキストデータ |
| `content` | 出力 | コンテンツデータ |
| `image` | 出力 | 画像データ |
| `value` | 出力 | 値データ |
| `condition` | 入力 | 条件値 |
| `delay` | 入力 | 遅延時間 |

#### エンティティ系

| ソケット名 | 方向 | 説明 |
|-----------|------|------|
| `entity` | 出力 | エンティティ（キャラクター等） |
| `meta` | 出力 | メタデータ |
| `time` | 出力 | 時刻情報 |
| `url` | 出力 | URL文字列 |
| `data` | 出力 | 汎用データ |
| `participants` | 入力 | 参加者（複数接続可） |

---

## 実践例

### 例1: 最小構成（Start → End）

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
        "title": "Start",
        "labelName": "開始"
      }
    },
    {
      "id": "end-1",
      "label": "End",
      "type": "end",
      "x": 400,
      "y": 100,
      "data": {
        "title": "End",
        "labelName": "終了"
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
    "exported_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### 例2: 条件分岐

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
        "labelName": "開始"
      }
    },
    {
      "id": "condition-1",
      "label": "Condition",
      "type": "condition",
      "x": 400,
      "y": 200,
      "data": {
        "labelName": "年齢チェック",
        "text": "20歳以上かチェック",
        "conditionExpression": "age >= 20"
      }
    },
    {
      "id": "action-adult",
      "label": "Action",
      "type": "action",
      "x": 700,
      "y": 100,
      "data": {
        "labelName": "成人ルート",
        "text": "成人向けコンテンツを表示"
      }
    },
    {
      "id": "action-child",
      "label": "Action",
      "type": "action",
      "x": 700,
      "y": 300,
      "data": {
        "labelName": "未成年ルート",
        "text": "一般向けコンテンツを表示"
      }
    },
    {
      "id": "end-1",
      "label": "End",
      "type": "end",
      "x": 1000,
      "y": 200,
      "data": {
        "labelName": "終了"
      }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "source": "start-1",
      "sourceOutput": "exec",
      "target": "condition-1",
      "targetInput": "exec"
    },
    {
      "id": "conn-2",
      "source": "condition-1",
      "sourceOutput": "true",
      "target": "action-adult",
      "targetInput": "exec"
    },
    {
      "id": "conn-3",
      "source": "condition-1",
      "sourceOutput": "false",
      "target": "action-child",
      "targetInput": "exec"
    },
    {
      "id": "conn-4",
      "source": "action-adult",
      "sourceOutput": "exec",
      "target": "end-1",
      "targetInput": "exec"
    },
    {
      "id": "conn-5",
      "source": "action-child",
      "sourceOutput": "exec",
      "target": "end-1",
      "targetInput": "exec"
    }
  ],
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2025-01-01T00:00:00.000Z",
    "description": "年齢による分岐処理"
  }
}
```

### 例3: キャラクターとイベント

```json
{
  "nodes": [
    {
      "id": "char-hero",
      "label": "Character",
      "type": "character",
      "x": 100,
      "y": 100,
      "data": {
        "labelName": "主人公",
        "characterName": "勇者アレックス",
        "role": "Protagonist",
        "text": "正義感の強い若き勇者",
        "attributes": {
          "age": 20,
          "level": 5
        }
      }
    },
    {
      "id": "char-mentor",
      "label": "Character",
      "type": "character",
      "x": 100,
      "y": 300,
      "data": {
        "labelName": "師匠",
        "characterName": "賢者マーリン",
        "role": "Mentor",
        "text": "経験豊富な魔法使い"
      }
    },
    {
      "id": "event-meeting",
      "label": "Event",
      "type": "event",
      "x": 400,
      "y": 200,
      "data": {
        "labelName": "出会いイベント",
        "eventName": "師との出会い",
        "text": "森で師匠と出会う",
        "location": "神秘の森",
        "participants": ["char-hero", "char-mentor"]
      }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "source": "char-hero",
      "sourceOutput": "entity",
      "target": "event-meeting",
      "targetInput": "participants"
    },
    {
      "id": "conn-2",
      "source": "char-mentor",
      "sourceOutput": "entity",
      "target": "event-meeting",
      "targetInput": "participants"
    }
  ],
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2025-01-01T00:00:00.000Z",
    "description": "キャラクターとイベントの関連付け"
  }
}
```

---

## よくある間違いと対策

### 1. JSON構文エラー

#### ❌ 間違い: カンマの抜け

```json
{
  "nodes": [
    {"id": "node-1"}  // ← カンマ必要
    {"id": "node-2"}
  ]
}
```

#### ✅ 正しい

```json
{
  "nodes": [
    {"id": "node-1"},  // ← カンマあり
    {"id": "node-2"}   // ← 最後はカンマ不要
  ]
}
```

### 2. 文字列のクォート忘れ

#### ❌ 間違い

```json
{
  "type": start  // ← クォート必要
}
```

#### ✅ 正しい

```json
{
  "type": "start"  // ← ダブルクォートで囲む
}
```

### 3. ノードID重複

#### ❌ 間違い

```json
{
  "nodes": [
    {"id": "node-1", ...},
    {"id": "node-1", ...}  // ← 重複
  ]
}
```

#### ✅ 正しい

```json
{
  "nodes": [
    {"id": "node-1", ...},
    {"id": "node-2", ...}  // ← ユニークなID
  ]
}
```

### 4. 存在しないノードへの接続

#### ❌ 間違い

```json
{
  "connections": [
    {
      "source": "node-999",  // ← このノードは存在しない
      "target": "node-1"
    }
  ]
}
```

#### ✅ 正しい: 接続前にノードが定義されていることを確認

### 5. 無効なソケット名

#### ❌ 間違い

```json
{
  "sourceOutput": "output",  // ← 存在しないソケット名
  "targetInput": "input"
}
```

#### ✅ 正しい: ノードタイプごとの正しいソケット名を使用

```json
{
  "sourceOutput": "exec",
  "targetInput": "exec"
}
```

### 6. labelNameの未設定（v2.1.0）

#### ⚠️ 注意: labelNameがない場合、labelが使用されます

```json
{
  "data": {
    "labelName": "カスタム名"  // ← 推奨
  }
}
```

---

## 高度な使い方

### Base64画像の埋め込み

画像を外部URLではなく、Base64エンコードしてJSONに直接埋め込むことができます。

```json
{
  "data": {
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
  }
}
```

**メリット**:
- 外部依存なし
- オフライン利用可能

**デメリット**:
- ファイルサイズが大きくなる
- 可読性が低下

### 座標の自動計算

ノードの配置を計算する際のガイドライン：

```javascript
// 横方向のレイアウト
const spacing = 300; // ノード間の間隔
const startX = 100;  // 開始X座標

nodes.forEach((node, index) => {
  node.x = startX + (index * spacing);
  node.y = 200; // 固定Y座標
});
```

```javascript
// 縦方向の分岐
const branchSpacing = 150;
const centerY = 200;

// 上の分岐
node1.y = centerY - branchSpacing / 2;

// 下の分岐
node2.y = centerY + branchSpacing / 2;
```

### メタデータの活用

```json
{
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2025-01-01T00:00:00.000Z",
    "description": "シナリオの説明",
    "author": "作成者名",
    "tags": ["RPG", "ファンタジー", "冒険"],
    "difficulty": "normal",
    "estimatedPlayTime": 3600,
    "customData": {
      "projectId": "proj-123",
      "branchName": "main"
    }
  }
}
```

### 複数接続の例

Actionノードのtext入力は複数接続可能：

```json
{
  "connections": [
    {
      "id": "conn-1",
      "source": "content-1",
      "sourceOutput": "content",
      "target": "action-1",
      "targetInput": "text"
    },
    {
      "id": "conn-2",
      "source": "content-2",
      "sourceOutput": "content",
      "target": "action-1",
      "targetInput": "text"
    }
  ]
}
```

---

## チェックリスト

JSONファイルを作成したら、以下を確認してください：

### 必須項目
- [ ] ルートに`nodes`, `connections`, `metadata`がある
- [ ] `metadata.version`が`"2.0.0"`
- [ ] すべてのノードに`id`, `label`, `type`, `x`, `y`, `data`がある
- [ ] ノードIDがユニーク（重複なし）
- [ ] すべての接続に必須フィールドがある
- [ ] 接続の`source`と`target`が存在するノードを参照

### 推奨項目
- [ ] すべてのノードに`labelName`を設定
- [ ] ソケット名が正しい
- [ ] JSON構文が正しい（カンマ、クォート）
- [ ] 座標が適切に配置されている
- [ ] 画像URLが有効（または適切なBase64データ）

### テスト
- [ ] JSONLintで構文チェック
- [ ] エディタでインポート可能
- [ ] ブラウザコンソールにエラーなし
- [ ] ノードが正しく表示される
- [ ] 接続が正しく表示される

---

## ツールとリソース

### JSONバリデーションツール

1. **JSONLint** - https://jsonlint.com/
   - JSON構文チェック

2. **VS Code**
   - JSON編集時に自動エラーチェック
   - Prettier拡張でフォーマット

3. **オンラインツール**
   - JSON Formatter & Validator
   - JSON Editor Online

### ファイル名の推奨形式

```
scenario_{name}_{date}.json

例:
scenario_rpg_quest_20250101.json
scenario_mystery_story_v2.json
```

### 保存時の設定

- **文字コード**: UTF-8
- **改行コード**: LF（推奨）またはCRLF
- **拡張子**: `.json`
- **BOM**: なし

---

## サポート情報

### トラブルシューティング

**問題**: インポート時にエラーが発生する
- JSONLintで構文エラーをチェック
- ブラウザコンソール（F12）でエラー内容を確認
- ノードIDの重複を確認

**問題**: ノードが表示されない
- `type`の値が正しいか確認
- 座標（x, y）が適切な範囲か確認
- ブラウザの倍率を確認（100%推奨）

**問題**: 接続が作成されない
- ソケット名が正しいか確認
- ノードIDが存在するか確認
- ソケットの方向（入力/出力）が正しいか確認

### 関連ドキュメント

- `NODES_SOCKETS_EDGES.md` - ノード・ソケット・エッジの詳細仕様
- `IMPORT_DATA_SPECIFICATION.md` - インポート機能の仕様
- `NODE_LAYOUT_SUMMARY.md` - ノードレイアウトの説明

---

**最終更新**: 2025年10月5日  
**ドキュメントバージョン**: 2.1.0  
**作成者**: シナリオエディタ開発チーム

