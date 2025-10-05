# シナリオエディタ ドキュメント一覧

## 概要

シナリオエディタのドキュメント集です。目的に応じて適切なドキュメントを参照してください。

## 📚 ドキュメント一覧

### 仕様・技術ドキュメント

| ドキュメント | 対象読者 | 説明 |
|------------|---------|------|
| [IMPORT_DATA_SPECIFICATION.md](./IMPORT_DATA_SPECIFICATION.md) | 技術者、開発者 | **完全な技術仕様書**<br>・全ノードタイプの詳細仕様<br>・ソケットタイプと互換性<br>・バリデーションルール<br>・完全なサンプルデータ |
| [DATA_GENERATION_GUIDE.md](./DATA_GENERATION_GUIDE.md) | プログラマー | **プログラマー向け実装ガイド**<br>・Python実装例<br>・TypeScript実装例<br>・C#実装例<br>・実践的なサンプル |
| [MANUAL_JSON_GUIDE.md](./MANUAL_JSON_GUIDE.md) | 初心者、コンテンツ作成者 | **手動作成ガイド**<br>・テンプレート集<br>・よくある間違い<br>・完全な動作例<br>・チェックリスト |

### 変更履歴・修正ドキュメント

| ドキュメント | 説明 |
|------------|------|
| [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) | ノード・エッジスタイル更新とImageControl実装の詳細 |
| [NODE_STYLE_GUIDE.md](./NODE_STYLE_GUIDE.md) | ノードスタイルガイド - Draw.io風デザイン |
| [NODE_LABEL_AND_LAYOUT_IMPROVEMENTS.md](./NODE_LABEL_AND_LAYOUT_IMPROVEMENTS.md) | ノードラベル名機能とレイアウト改善の詳細 |
| [IMPLEMENTATION_SUMMARY_JA.md](./IMPLEMENTATION_SUMMARY_JA.md) | ラベル名機能実装の完全な概要 |
| [VISUAL_GUIDE_LABEL_LAYOUT.md](./VISUAL_GUIDE_LABEL_LAYOUT.md) | ラベル名とレイアウトのビジュアルガイド |
| [IMPORT_EXPORT_FIX.md](./IMPORT_EXPORT_FIX.md) | インポート/エクスポート機能の修正内容 |
| [COORDINATE_EXPORT_FIX.md](./COORDINATE_EXPORT_FIX.md) | 座標情報エクスポート修正の詳細 |

## 🎯 目的別ガイド

### 外部プログラムでデータを生成したい

1. まず [IMPORT_DATA_SPECIFICATION.md](./IMPORT_DATA_SPECIFICATION.md) で仕様を確認
2. 次に [DATA_GENERATION_GUIDE.md](./DATA_GENERATION_GUIDE.md) で実装例を参照
3. 使用する言語の実装例をコピーしてカスタマイズ

**推奨フロー:**
```
仕様確認 → 実装例コピー → カスタマイズ → テスト
```

### 手動でJSONファイルを作成したい

1. [MANUAL_JSON_GUIDE.md](./MANUAL_JSON_GUIDE.md) を開く
2. 最小構成テンプレートをコピー
3. 必要なノードを追加
4. JSONLintで検証
5. エディタでインポートしてテスト

**推奨フロー:**
```
テンプレートコピー → ノード追加 → 検証 → テスト
```

### ノードの詳細仕様を知りたい

[IMPORT_DATA_SPECIFICATION.md](./IMPORT_DATA_SPECIFICATION.md) の「各ノードタイプの詳細仕様」セクションを参照

### エラーが発生した場合

1. ブラウザコンソール（F12）でエラーメッセージを確認
2. [IMPORT_EXPORT_FIX.md](./IMPORT_EXPORT_FIX.md) のトラブルシューティングを確認
3. [MANUAL_JSON_GUIDE.md](./MANUAL_JSON_GUIDE.md) の「よくある間違い」を確認
4. JSONLintで構文エラーをチェック

## 📋 クイックリファレンス

### ノードタイプ一覧

| type値 | ノード名 | 用途 |
|--------|---------|------|
| `start` | Start Node | フローの開始点 |
| `action` | Action Node | 処理、操作、行動 |
| `condition` | Condition Node | 条件分岐 |
| `end` | End Node | フローの終了点 |
| `content` | Content Node | 一般的なコンテンツ |
| `character` | Character Node | キャラクター情報 |
| `event` | Event Node | イベント定義 |
| `timer` | Timer Node | 時間制御、遅延 |
| `image` | Image Node | 画像リソース |
| `external-resource` | External Resource Node | 外部API、ファイル、DB |

### 主要なソケット名

| ソケット名 | 型 | 説明 |
|----------|---|------|
| `exec` | event | 実行フロー |
| `true` / `false` | event | 条件分岐の出力 |
| `content` | content | コンテンツデータ |
| `entity` | entity | エンティティ参照 |
| `meta` | meta | メタデータ |
| `time` | time | タイムスタンプ |

## 💡 ベストプラクティス

### 1. ID命名規則

```
{type}-{number}
例: action-001, character-hero, event-battle
```

### 2. 座標配置

```
水平方向: 250px間隔
垂直方向（分岐）: 100px間隔
最小間隔: 64px以上
```

### 3. データ構造

```json
{
  "nodes": [...],      // 必須: ノードの配列
  "connections": [...], // 必須: 接続の配列
  "metadata": {        // 必須: メタデータ
    "version": "2.0.0",
    "exported_at": "ISO 8601形式"
  }
}
```

## 🔧 開発ツール

### 推奨ツール

- **JSONLint** - https://jsonlint.com/ （JSON構文チェック）
- **VSCode** - JSON編集とシンタックスハイライト
- **Python/Node.js** - プログラム生成用

### バリデーション

```bash
# Python
python -m json.tool your_scenario.json

# Node.js
node -e "JSON.parse(require('fs').readFileSync('your_scenario.json'))"
```

## 📊 サンプルファイル

プロジェクトルートに以下のサンプルファイルがあります：

- `test_scenario.json` - 基本的なテストシナリオ
- （上記ガイドのコードを実行すると、追加のサンプルが生成されます）

## 🆘 サポート

### エラーメッセージ対応表

| エラーメッセージ | ドキュメント参照先 |
|----------------|-----------------|
| `Invalid JSON file` | [MANUAL_JSON_GUIDE.md](./MANUAL_JSON_GUIDE.md) - よくある間違い |
| `nodes must be an array` | [IMPORT_DATA_SPECIFICATION.md](./IMPORT_DATA_SPECIFICATION.md) - バリデーションルール |
| `Unknown node type` | [IMPORT_DATA_SPECIFICATION.md](./IMPORT_DATA_SPECIFICATION.md) - ノードタイプ一覧 |
| 座標が(0,0)になる | [COORDINATE_EXPORT_FIX.md](./COORDINATE_EXPORT_FIX.md) |

### 問い合わせ

問題が解決しない場合は、プロジェクトのIssueトラッカーまでお問い合わせください。

## 📝 変更履歴

| バージョン | 日付 | 変更内容 |
|----------|------|---------|
| 2.1.0 | 2025-01 | ノードラベル名機能追加、レイアウト改善（ソケット・画像・テキスト配置最適化） |
| 2.0.0 | 2024-01 | 座標情報の修正、全ノードへのImageControl追加 |
| 1.0.0 | 2023-12 | 初期リリース |

## 🎓 学習パス

### 初心者向け

1. [MANUAL_JSON_GUIDE.md](./MANUAL_JSON_GUIDE.md) - 最小構成テンプレートから開始
2. テンプレートをカスタマイズして試す
3. [IMPORT_DATA_SPECIFICATION.md](./IMPORT_DATA_SPECIFICATION.md) で詳細を学ぶ

### 開発者向け

1. [IMPORT_DATA_SPECIFICATION.md](./IMPORT_DATA_SPECIFICATION.md) - 仕様を理解
2. [DATA_GENERATION_GUIDE.md](./DATA_GENERATION_GUIDE.md) - 実装例を参照
3. ビルダークラスをカスタマイズ
4. 自動化スクリプトを作成

### 上級者向け

1. 全ドキュメントを熟読
2. カスタムノードタイプの追加を検討
3. バリデーションツールの開発
4. CI/CDパイプラインへの統合

## 🆕 最新の変更点（v2.1.0）

### ノードラベル名機能
全てのノードに「ラベル名」を設定できるようになりました。ラベル名はノードの種類名の上部に表示されます。

**特徴:**
- ノードの識別が容易に
- シナリオの可読性が向上
- 編集パネルで簡単に編集可能
- JSONデータに自動保存

**新しいdataフィールド:**
```json
{
  "data": {
    "name": "ノードのラベル名"
  }
}
```

詳細は [NODE_LABEL_AND_LAYOUT_IMPROVEMENTS.md](./NODE_LABEL_AND_LAYOUT_IMPROVEMENTS.md) を参照してください。

### レイアウト改善
ノード内の要素配置を最適化し、オーバーフロー問題を解決しました。

**改善内容:**
- ソケットサイズの最適化（16px → 14px）
- 画像表示エリアの調整（最大120px）
- テキスト表示エリアの制限（最大80px）
- ノード高さの調整（全体的に+20px）

---

**最終更新:** 2025-01-05  
**バージョン:** 2.1.0
