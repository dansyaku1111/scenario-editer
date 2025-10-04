# シナリオ・人物相関図エディタ

ビジュアルノードベースのシナリオ作成・人物相関図作成ツールです。

## 🎯 主な機能

- **10種類のノードタイプ**: 開始、終了、アクション、条件分岐、コンテンツ、画像、人物、イベント、タイマー、外部リソース
- **10種類のソケット型**: 制御フロー、真偽値、数値、文字列、リッチテキスト、画像、エンティティ、リスト、JSON、時刻
- **5種類のエッジタイプ**: 制御フロー、データ、関係性、参照、注釈
- **自動バリデーション**: グラフの整合性チェック、循環参照検出
- **型安全な接続**: ソケット型の自動互換性チェック
- **JSON入出力**: シナリオの保存と読み込み

## 🚀 クイックスタート

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:5173/ (または表示されたURL) を開きます。

### プロダクションビルド

```bash
npm run build
```

ビルド成果物は `dist/` フォルダに生成されます。

## 📚 ドキュメント

- **[NODES_SOCKETS_EDGES.md](./NODES_SOCKETS_EDGES.md)** - ノード・ソケット・エッジシステムの詳細仕様
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - 実装の概要と変更履歴

## 🎨 ノードタイプ

### 基本ノード
- **Start** - フローの開始点（⭕ 1つ推奨）
- **End** - フローの終了点（複数可）
- **Action** - アクション・処理の実行
- **Condition** - 条件分岐（True/False）
- **Content** - テキストコンテンツの表示
- **Image** - 画像の表示

### シナリオノード
- **Character** 🔗 - 人物情報と関係性
- **Event** 📅 - イベント・出来事の定義
- **Timer** ⏰ - 時間制御（遅延・スケジュール）
- **External Resource** 🌐 - 外部リソースの参照

## 🔌 ソケット型

| 型 | アイコン | 用途 |
|----|---------|------|
| event | ⚡ | 実行フロー制御 |
| bool | 🔀 | 真偽値 |
| number | 🔢 | 数値 |
| string | ✏️ | 文字列 |
| content | 📝 | リッチテキスト |
| image | 🖼️ | 画像 |
| entity | 🔗 | エンティティ参照 |
| list | 📋 | リスト |
| meta | ⚙️ | JSON構造体 |
| time | ⏰ | 時刻/期間 |

## 🛠️ 技術スタック

- **React 18** - UIフレームワーク
- **Rete.js 2** - ノードエディタエンジン
- **TypeScript** - 型安全性
- **Vite** - ビルドツール
- **Tailwind CSS** - スタイリング

## 📖 使い方

### ノードの追加
1. ツールバーから追加したいノードのボタンをクリック
2. キャンバス上にノードが配置されます

### 接続の作成
1. 出力ソケット（ノード右側の丸）をドラッグ
2. 入力ソケット（ノード左側の丸）にドロップ
3. 型が互換性がある場合のみ接続されます

### ノードの編集
1. ノードをクリックして選択
2. 右側の編集パネルで内容を編集
3. テキスト、画像URL、その他のプロパティを変更できます

### ノードの削除
- ノードを選択して `Delete` キーを押す
- 複数選択は `Ctrl` + クリック

### 保存と読み込み
- **Export**: JSONファイルとしてシナリオを保存
- **Import**: 保存したJSONファイルを読み込み

## 🔍 バリデーション

エディタは自動的に以下をチェックします：

- ✅ Startノードの存在（必須）
- ⚠️ Endノードの存在（推奨）
- ⚠️ 孤立したノード
- ⚠️ 必須接続の欠落
- ⚠️ 循環参照（無限ループ）

バリデーション機能の使用:
```typescript
import { validateGraph } from './utils/validation';

const errors = validateGraph(editor);
```

## 🎯 エッジタイプ

- **Control** (実線・太) - 実行フローの制御
- **Data** (実線・細) - データの伝搬
- **Relation** (破線) - 人物間の関係性
- **Reference** (点線・細) - 参照のみ
- **Annotation** (点線・薄) - コメント・注釈

## 📁 プロジェクト構成

```
scenario-editer/
├── src/
│   ├── components/
│   │   ├── NodeTypes/          # ノード定義
│   │   │   ├── *Node.ts        # ノードクラス
│   │   │   ├── *NodeComponent.tsx  # Reactコンポーネント
│   │   │   └── sockets.ts      # ソケット定義
│   │   ├── NodeEditor.tsx      # メインエディタ
│   │   ├── Toolbar.tsx         # ツールバー
│   │   └── EditorPanel.tsx     # 編集パネル
│   ├── utils/
│   │   ├── jsonSchema.ts       # 型定義
│   │   ├── jsonHandler.ts      # JSON入出力
│   │   ├── validation.ts       # バリデーション
│   │   └── edges.ts            # エッジシステム
│   └── App.tsx                 # メインアプリ
├── NODES_SOCKETS_EDGES.md      # 詳細仕様
├── IMPLEMENTATION_SUMMARY.md   # 実装サマリ
└── package.json
```

## 🔧 カスタマイズ

### 新しいノードタイプの追加

1. `src/components/NodeTypes/` に新しいノードファイルを作成
2. ソケットを定義
3. Reactコンポーネントを作成
4. `NodeEditor.tsx`、`Toolbar.tsx`、`jsonHandler.ts` を更新

詳細は [NODES_SOCKETS_EDGES.md](./NODES_SOCKETS_EDGES.md) を参照してください。

## 🐛 トラブルシューティング

### ノードが接続できない
- ソケットの型互換性を確認してください
- 出力→入力の方向を確認してください

### ビルドエラー
```bash
npm run build
```
エラーメッセージを確認し、型定義を確認してください。

## 📝 ライセンス

MIT License

## 🤝 貢献

Issue や Pull Request を歓迎します。

## 📞 サポート

質問や提案がある場合は、Issue を作成してください。

---

**Version**: 2.0.0  
**Last Updated**: 2024-01
