# シナリオ・人物相関図エディタ - ノード・ソケット・エッジシステム仕様

## 概要

本システムは、シナリオ作成と人物相関図の作成を支援するビジュアルフローエディタです。ノード、ソケット、エッジの3つの主要コンポーネントで構成されています。

## 1. ノード種類

### 必須ノード（基本ワークフロー）

#### Start Node（開始ノード）
- **役割**: フローのエントリーポイント
- **推奨**: 1つのみ配置
- **ソケット**: 
  - 出力: `exec` (event型) - 実行フロー

#### End Node（終了ノード）
- **役割**: フローの終了点
- **推奨**: 複数配置可能
- **ソケット**:
  - 入力: `exec` (event型) - 実行フロー

#### Action Node（アクションノード）
- **役割**: ユーザー操作やシステム処理を表現
- **用途**: API呼び出し、メール送信、データ処理など
- **ソケット**:
  - 入力: `exec` (event型), `text` (string型, 複数接続可)
  - 出力: `exec` (event型), `content` (content型)
- **データ**: title, text, imageUrl

#### Condition Node（条件分岐ノード）
- **役割**: Boolean判定による分岐処理
- **ソケット**:
  - 入力: `exec` (event型), `condition` (bool型)
  - 出力: `true` (event型), `false` (event型), `value` (bool型)
- **データ**: title, text, imageUrl, conditionExpression

#### Content Node（コンテンツノード）
- **役割**: テキスト、説明、台本などの表示
- **ソケット**:
  - 入力: `exec` (event型)
  - 出力: `exec` (event型), `content` (content型)
- **データ**: title, text, imageUrl

#### Image Node（画像ノード）
- **役割**: 画像の表示・参照
- **ソケット**:
  - 出力: `image` (image型)
- **データ**: title, text, imageUrl

### シナリオ向けノード

#### Character Node（人物ノード）
- **役割**: キャラクター情報と関係性の管理
- **用途**: 人物相関図の中心要素
- **ソケット**:
  - 入力: `exec` (event型)
  - 出力: `exec` (event型), `entity` (entity型), `meta` (meta型)
- **データ**:
  - characterName: 人物名
  - role: 役割（主人公、敵対者など）
  - attributes: 属性情報（辞書型）
  - relationships: 関係情報の配列
  - text, imageUrl: 説明と画像

#### Event Node（イベントノード）
- **役割**: シーンや出来事の表現（時間軸の単位）
- **ソケット**:
  - 入力: `exec` (event型), `participants` (list型, 複数接続可)
  - 出力: `exec` (event型), `time` (time型), `content` (content型)
- **データ**:
  - eventName: イベント名
  - timestamp: 発生時刻
  - duration: 期間
  - location: 場所
  - participants: 参加者リスト
  - text, imageUrl

#### Timer Node（タイマーノード）
- **役割**: 遅延、期限、時間経過のトリガー
- **ソケット**:
  - 入力: `exec` (event型), `delay` (number型)
  - 出力: `exec` (event型), `time` (time型)
- **データ**:
  - timerType: 'delay' | 'schedule' | 'deadline'
  - delaySeconds: 遅延秒数
  - scheduledTime: 予定時刻
  - repeat: 繰り返しフラグ
  - repeatInterval: 繰り返し間隔

#### External Resource Node（外部リソースノード）
- **役割**: URL、ファイル、APIなどの外部リソース参照
- **ソケット**:
  - 入力: `exec` (event型)
  - 出力: `exec` (event型), `url` (string型), `data` (meta型)
- **データ**:
  - resourceType: 'url' | 'api' | 'file' | 'database'
  - resourceUrl: リソースURL
  - method: HTTPメソッド（API用）
  - headers, body: リクエスト情報

## 2. ソケット仕様

### ソケット型の定義

| 型名 | 用途 | 視覚表現 | カラー |
|------|------|----------|--------|
| `event` | 制御フロー信号（トリガー） | ⚡ | ゴールド (#FFD700) |
| `bool` | 真偽値 | 🔀 | レッド (#FF6B6B) |
| `number` | 数値（スコア、重み、時間等） | 🔢 | ティール (#4ECDC4) |
| `string` | 文字列 | ✏️ | ミント (#95E1D3) |
| `content` | リッチテキスト（Markdown/HTML） | 📝 | ピンク (#F38181) |
| `image` | 画像参照（URL or assetId） | 🖼️ | パープル (#AA96DA) |
| `entity` | 人物や組織の参照 | 🔗 | ローズ (#FCBAD3) |
| `list` | 配列・リスト | 📋 | スカイブルー (#A8D8EA) |
| `meta` | 任意構造体（JSON） | ⚙️ | ライトサーモン (#FFA07A) |
| `time` | タイムスタンプ/期間 | ⏰ | ブロンズ (#DDA15E) |

### ソケット互換性

システムは自動的にソケットの型互換性をチェックします：

- 同一型は常に互換性あり
- `string` ⇔ `content`: 相互変換可能
- `number` → `string`: 変換可能
- `bool` → `string`, `number`: 変換可能
- `entity` → `string`, `meta`: ID展開可能
- `list` → `meta`: JSON化可能
- `time` → `string`, `number`: 文字列化/タイムスタンプ化可能

互換性のないソケット同士の接続は、エディタ上で視覚的に禁止されます。

## 3. エッジ（接続）の種類

### Control / Flow Edge（制御フローエッジ）
- **役割**: 実行順序やトリガー伝播
- **型**: `event`型ソケット間
- **視覚**: 太めのライン（幅3）、実線、ゴールド
- **用途**: ノード間の実行フローを定義

### Data Edge（データエッジ）
- **役割**: 値やコンテンツの伝搬
- **型**: `string`, `number`, `list`, `meta`, `image`等
- **視覚**: 細めのライン（幅2）、実線、型に応じた色
- **用途**: データの流れを表現

### Relation Edge（関係エッジ）
- **役割**: 人物間の関係（親子、恋愛、敵対等）
- **型**: 主に`entity`型ソケット間
- **視覚**: 破線、ピンク、幅2
- **用途**: 人物相関図の関係性表現
- **双方向**: 可能

### Reference Edge（参照エッジ）
- **役割**: 参照のみで実行フローなし
- **視覚**: 細い破線、グレー、幅1
- **用途**: ドキュメント的な繋がり

### Annotation Edge（注釈エッジ）
- **役割**: 設計者のコメント・メモ
- **視覚**: 点線、ライトグレー、幅1
- **用途**: 実行に影響しない注釈

### エッジメタデータ

各エッジは以下のメタデータを保持できます：

```typescript
{
  label?: string;          // 表示ラベル
  weight?: number;         // 優先度・重み
  condition?: string;      // 条件式
  style?: 'solid' | 'dashed' | 'dotted';
  bidirectional?: boolean; // 双方向フラグ
  edgeType?: EdgeType;     // エッジ種別
  color?: string;          // カスタムカラー
  description?: string;    // 説明
}
```

## 4. バリデーション機能

### 実装済みバリデーション

`src/utils/validation.ts` に実装されています：

1. **Startノードチェック**: 必須かつ1つのみ推奨
2. **Endノードチェック**: 存在を推奨
3. **孤立ノード検出**: 入力/出力接続のないノード
4. **必須接続チェック**: 必須ソケットの未接続警告
5. **循環参照検出**: 無限ループの可能性を警告

### バリデーション結果

```typescript
interface ValidationError {
  type: 'error' | 'warning';
  nodeId?: string;
  message: string;
  code: string;
}
```

### 使用方法

```typescript
import { validateGraph } from './utils/validation';

const errors = validateGraph(editor);
errors.forEach(error => {
  console.log(`${error.type}: ${error.message}`);
});
```

## 5. エクスポート/インポート

### JSONフォーマット

```json
{
  "nodes": [
    {
      "id": "node-id",
      "label": "Character",
      "type": "character",
      "data": {
        "characterName": "主人公",
        "role": "Protagonist",
        "text": "物語の主人公"
      },
      "x": 100,
      "y": 200
    }
  ],
  "connections": [
    {
      "id": "conn-id",
      "source": "node-1",
      "sourceOutput": "exec",
      "target": "node-2",
      "targetInput": "exec",
      "meta": {
        "edgeType": "control",
        "label": "Next"
      }
    }
  ],
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## 6. 使用方法

### ノードの追加

ツールバーから対応するボタンをクリック：

- **基本**: Start, Action, Condition, Content, End, Image
- **シナリオ**: Character, Event, Timer, Resource

### ノードの編集

1. ノードをクリックして選択
2. 右側の編集パネルで内容を編集
3. 画像のアップロード、テキストの入力が可能

### 接続の作成

1. 出力ソケット（右側）をドラッグ開始
2. 互換性のある入力ソケット（左側）にドロップ
3. 型が合わない場合は接続が拒否されます

### ノードの削除

1. ノードを選択（クリック）
2. Deleteキーを押す
3. 複数選択はCtrl+クリック

## 7. 拡張方法

### 新しいノードタイプの追加

1. `src/components/NodeTypes/`に新しいノードクラスを作成
2. 必要なソケットを定義
3. `index.ts`でエクスポート
4. コンポーネントを作成（`*NodeComponent.tsx`）
5. `NodeEditor.tsx`にレンダリング登録
6. `App.tsx`と`Toolbar.tsx`に追加ボタンを実装
7. `jsonHandler.ts`にシリアライズ/デシリアライズ処理を追加

### 新しいソケットタイプの追加

1. `src/components/NodeTypes/sockets.ts`に定義
2. `SocketConfig`型に追加
3. `getSocketByType()`に処理を追加
4. `isSocketCompatible()`に互換性ルールを追加
5. `socketStyles`にビジュアル設定を追加

## 8. ファイル構成

```
src/
├── components/
│   ├── NodeTypes/
│   │   ├── StartNode.ts                  # 開始ノード
│   │   ├── EndNode.ts                    # 終了ノード
│   │   ├── ActionNode.ts                 # アクションノード
│   │   ├── ConditionNode.ts              # 条件ノード
│   │   ├── ContentNode.ts                # コンテンツノード
│   │   ├── ImageNode.ts                  # 画像ノード
│   │   ├── CharacterNode.ts              # 人物ノード (新規)
│   │   ├── EventNode.ts                  # イベントノード (新規)
│   │   ├── TimerNode.ts                  # タイマーノード (新規)
│   │   ├── ExternalResourceNode.ts       # 外部リソースノード (新規)
│   │   ├── *NodeComponent.tsx            # 各ノードのReactコンポーネント
│   │   ├── sockets.ts                    # ソケット定義 (拡張)
│   │   └── index.ts                      # エクスポート
│   ├── NodeEditor.tsx                    # エディタコンポーネント
│   ├── Toolbar.tsx                       # ツールバー (更新)
│   └── EditorPanel.tsx                   # 編集パネル
├── utils/
│   ├── jsonSchema.ts                     # 型定義 (更新)
│   ├── jsonHandler.ts                    # JSON入出力 (更新)
│   ├── validation.ts                     # バリデーション機能 (新規)
│   └── edges.ts                          # エッジシステム (新規)
└── App.tsx                               # メインアプリ (更新)
```

## 9. 今後の拡張候補

### 実装予定機能

- **Subflow Node**: 複数ノードのグループ化と再利用
- **Parallel Node**: 並列処理の表現
- **Annotation Node**: コメント専用ノード
- **変数ノード**: グローバル変数の管理
- **関数ノード**: カスタムロジックの定義

### UI改善案

- ミニマップ表示
- ノード検索機能
- エッジのカスタムスタイル編集UI
- バリデーションエラーの視覚表示
- undo/redo機能
- ノードのコピー&ペースト

## 10. トラブルシューティング

### ノードが接続できない
- ソケットの型互換性を確認
- 出力から入力への方向を確認
- console.logでソケット型を確認

### ビルドエラー
```bash
npm run build
```
型エラーが出る場合は、`tsconfig.json`の設定を確認

### 開発サーバー起動
```bash
npm run dev
```

## まとめ

本システムは、柔軟で拡張可能なノード・ソケット・エッジアーキテクチャを採用しており、シナリオ作成と人物相関図の両方に対応しています。型安全性とビジュアルフィードバックにより、直感的な操作を実現しています。
