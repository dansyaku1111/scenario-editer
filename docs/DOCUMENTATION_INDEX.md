# ドキュメント完全索引

シナリオエディタのすべてのドキュメントへのリンクと説明です。

## 📖 目次

- [メインドキュメント](#メインドキュメント)
- [ユーザーガイド](#ユーザーガイド)
- [技術仕様書](#技術仕様書)
- [開発者向けドキュメント](#開発者向けドキュメント)
- [修正履歴](#修正履歴)
- [アーカイブ](#アーカイブ)

---

## メインドキュメント

プロジェクトのルートにある主要なドキュメントです。

| ファイル | 説明 | 対象 |
|---------|------|------|
| [README.md](../README.md) | プロジェクトの概要と使い方 | 全ユーザー |
| [CHANGELOG.md](../CHANGELOG.md) | バージョン別の変更履歴 | 全ユーザー |

---

## ユーザーガイド

初めて使う方から上級者まで、使い方を学ぶためのガイドです。

### 📂 [docs/guides/](./guides/)

| ファイル | 説明 | 難易度 | 文字数 |
|---------|------|--------|--------|
| [STARTUP_GUIDE.md](./guides/STARTUP_GUIDE.md) | 初めて使う方向けのクイックスタート | ⭐ 初級 | 6.5K |
| [MANUAL_JSON_GUIDE.md](./guides/MANUAL_JSON_GUIDE.md) | 手動でJSONファイルを作成する方法 | ⭐⭐ 中級 | 13K |
| [DATA_GENERATION_GUIDE.md](./guides/DATA_GENERATION_GUIDE.md) | テストデータの生成とデバッグ方法 | ⭐⭐ 中級 | 31K |
| [NODE_STYLE_GUIDE.md](./guides/NODE_STYLE_GUIDE.md) | ノードのデザイン・色の仕様 | ⭐⭐ 中級 | 6.5K |
| [VISUAL_GUIDE.md](./guides/VISUAL_GUIDE.md) | UIの使い方の視覚的ガイド | ⭐ 初級 | 11K |
| [VISUAL_GUIDE_LABEL_LAYOUT.md](./guides/VISUAL_GUIDE_LABEL_LAYOUT.md) | ラベルレイアウトの視覚的ガイド | ⭐⭐ 中級 | 8K |

### 推奨学習パス

```
1. STARTUP_GUIDE.md          ← まずはここから
2. VISUAL_GUIDE.md            ← UIの使い方を理解
3. MANUAL_JSON_GUIDE.md       ← JSONの作成方法を学習
4. NODE_STYLE_GUIDE.md        ← デザインカスタマイズ
5. DATA_GENERATION_GUIDE.md   ← 高度な使い方
```

---

## 技術仕様書

システムの詳細な仕様とAPIリファレンスです。

### 📂 [docs/specifications/](./specifications/)

| ファイル | 説明 | 対象 | 文字数 |
|---------|------|------|--------|
| [JSON_SPECIFICATION_GUIDE.md](./specifications/JSON_SPECIFICATION_GUIDE.md) | JSONフォーマットの完全なリファレンス | 全ユーザー | 33K |
| [NODES_SOCKETS_EDGES.md](./specifications/NODES_SOCKETS_EDGES.md) | ノード・ソケット・エッジシステムの詳細 | 開発者 | 13K |
| [IMPORT_DATA_SPECIFICATION.md](./specifications/IMPORT_DATA_SPECIFICATION.md) | データインポートの仕様 | 開発者 | 27K |
| [StyleCustmizeGuide.md](./specifications/StyleCustmizeGuide.md) | Rete.js v2カスタマイズの完全ガイド | 開発者 | 50K |

### 主要仕様書の使い分け

- **JSON作成時**: `JSON_SPECIFICATION_GUIDE.md`
- **新機能開発時**: `NODES_SOCKETS_EDGES.md`
- **カスタマイズ時**: `StyleCustmizeGuide.md`
- **データ連携時**: `IMPORT_DATA_SPECIFICATION.md`

---

## 開発者向けドキュメント

実装の詳細と設計思想を説明するドキュメントです。

### 📂 [docs/development/](./development/)

| ファイル | 説明 | 用途 | 文字数 |
|---------|------|------|--------|
| [IMPLEMENTATION_SUMMARY.md](./development/IMPLEMENTATION_SUMMARY.md) | 実装の概要と変更履歴 | 全体把握 | 8K |
| [IMPLEMENTATION_SUMMARY_JA.md](./development/IMPLEMENTATION_SUMMARY_JA.md) | 実装サマリ（日本語版） | 全体把握 | 6K |
| [CHANGES_SUMMARY.md](./development/CHANGES_SUMMARY.md) | 主要な変更のサマリ | 変更追跡 | 7K |
| [NODE_LAYOUT_REDESIGN_APPROACH.md](./development/NODE_LAYOUT_REDESIGN_APPROACH.md) | カスタムレイアウトの設計アプローチ | レイアウト設計 | 18K |
| [NODE_LAYOUT_TECHNICAL_DETAILS.md](./development/NODE_LAYOUT_TECHNICAL_DETAILS.md) | ノードレイアウトの技術詳細 | 実装詳細 | 14K |
| [NODE_LAYOUT_SUMMARY.md](./development/NODE_LAYOUT_SUMMARY.md) | ノードレイアウト変更のサマリ | 概要把握 | 7K |
| [NODE_LAYOUT_QUICK_REFERENCE.md](./development/NODE_LAYOUT_QUICK_REFERENCE.md) | ノードレイアウトのクイックリファレンス | 素早い参照 | 8K |
| [NODE_LAYOUT_IMPLEMENTATION_COMPLETE.md](./development/NODE_LAYOUT_IMPLEMENTATION_COMPLETE.md) | ノードレイアウト実装完了レポート | 実装記録 | 8K |
| [NODE_LAYOUT_REFINEMENT_COMPLETE.md](./development/NODE_LAYOUT_REFINEMENT_COMPLETE.md) | ノードレイアウト微調整完了レポート | 実装記録 | 12K |
| [DOCUMENTATION_INDEX.md](./development/DOCUMENTATION_INDEX.md) | このファイル（ドキュメント索引） | ナビゲーション | - |

### ノードレイアウト関連ドキュメントの読む順序

カスタムノードレイアウトの実装を理解したい場合：

```
1. NODE_LAYOUT_SUMMARY.md                  ← 概要を把握
2. NODE_LAYOUT_REDESIGN_APPROACH.md       ← 設計思想を理解
3. NODE_LAYOUT_TECHNICAL_DETAILS.md       ← 技術詳細を学習
4. NODE_LAYOUT_QUICK_REFERENCE.md         ← 実装時の参照用
5. NODE_LAYOUT_IMPLEMENTATION_COMPLETE.md ← 実装完了時の状態確認
6. NODE_LAYOUT_REFINEMENT_COMPLETE.md     ← 最終調整の詳細
```

---

## 修正履歴

バグ修正や問題解決の記録です。

### 📂 [docs/fixes/](./fixes/)

| ファイル | 説明 | 解決した問題 | 文字数 |
|---------|------|-------------|--------|
| [COORDINATE_EXPORT_FIX.md](./fixes/COORDINATE_EXPORT_FIX.md) | 座標エクスポートの修正 | ノード位置の保存問題 | 7.5K |
| [EDGE_CONNECTION_FIX.md](./fixes/EDGE_CONNECTION_FIX.md) | エッジ接続の修正 | 接続線の問題 | 3.6K |
| [EDGE_CONNECTION_SOLUTION.md](./fixes/EDGE_CONNECTION_SOLUTION.md) | エッジ接続の解決方法 | 接続システムの改善 | 7.6K |
| [IMAGE_DISPLAY_FIX.md](./fixes/IMAGE_DISPLAY_FIX.md) | 画像表示の修正 | 画像が表示されない問題 | 8.4K |
| [IMAGE_DISPLAY_FIX_v2.md](./fixes/IMAGE_DISPLAY_FIX_v2.md) | 画像表示の修正v2 | 画像表示の改善版 | 5.5K |
| [IMPORT_EXPORT_FIX.md](./fixes/IMPORT_EXPORT_FIX.md) | インポート・エクスポートの修正 | データ保存・読込の問題 | 6.8K |
| [SOCKET_IMAGE_FIX.md](./fixes/SOCKET_IMAGE_FIX.md) | ソケットと画像の修正 | レイアウトの問題 | 7K |
| [SOCKET_POSITION_FIX.md](./fixes/SOCKET_POSITION_FIX.md) | ソケット位置の修正 | ソケット配置の問題 | 3.4K |

### トラブルシューティングガイド

問題が発生した場合、関連する修正履歴を参照してください：

| 問題 | 参照ドキュメント |
|-----|----------------|
| ノード位置がずれる | COORDINATE_EXPORT_FIX.md |
| 接続線が表示されない | EDGE_CONNECTION_FIX.md, EDGE_CONNECTION_SOLUTION.md |
| 画像が表示されない | IMAGE_DISPLAY_FIX.md, IMAGE_DISPLAY_FIX_v2.md |
| JSONの保存/読込ができない | IMPORT_EXPORT_FIX.md |
| ソケットの位置がおかしい | SOCKET_POSITION_FIX.md, SOCKET_IMAGE_FIX.md |

---

## アーカイブ

古いバージョンのドキュメントや、現在使用されていない設計案です。

### 📂 [docs/archive/](./archive/)

| ファイル | 説明 | アーカイブ理由 | 文字数 |
|---------|------|----------------|--------|
| [FINAL_NODE_LAYOUT_SOLUTION.md](./archive/FINAL_NODE_LAYOUT_SOLUTION.md) | 最終ノードレイアウト解決案 | 新バージョンで置き換え | 3.5K |
| [NODE_LABEL_AND_LAYOUT_IMPROVEMENTS.md](./archive/NODE_LABEL_AND_LAYOUT_IMPROVEMENTS.md) | ラベルとレイアウトの改善案 | 実装完了 | 4.8K |
| [NODE_LAYOUT_IMPROVEMENTS_FIXED.md](./archive/NODE_LAYOUT_IMPROVEMENTS_FIXED.md) | ノードレイアウト改善（修正版） | より新しいバージョンあり | 5.9K |
| [TWO_BOX_APPROACH.md](./archive/TWO_BOX_APPROACH.md) | 2ボックスアプローチの設計案 | 別のアプローチを採用 | 5.3K |

---

## 📊 ドキュメント統計

### カテゴリ別ファイル数

- メインドキュメント: 2ファイル
- ユーザーガイド: 6ファイル
- 技術仕様書: 4ファイル
- 開発者向け: 10ファイル
- 修正履歴: 8ファイル
- アーカイブ: 4ファイル

**合計**: 34ファイル

### カテゴリ別総文字数

- ユーザーガイド: 約76,000文字
- 技術仕様書: 約123,000文字
- 開発者向け: 約88,000文字
- 修正履歴: 約49,000文字
- アーカイブ: 約20,000文字

**合計**: 約356,000文字

---

## 🔍 ドキュメント検索ガイド

### よくある質問と該当ドキュメント

#### 「使い方を知りたい」
→ [STARTUP_GUIDE.md](./guides/STARTUP_GUIDE.md)

#### 「JSONファイルの作り方は？」
→ [JSON_SPECIFICATION_GUIDE.md](./specifications/JSON_SPECIFICATION_GUIDE.md)  
→ [MANUAL_JSON_GUIDE.md](./guides/MANUAL_JSON_GUIDE.md)（簡易版）

#### 「ノードの色を変えたい」
→ [NODE_STYLE_GUIDE.md](./guides/NODE_STYLE_GUIDE.md)

#### 「カスタムノードを作りたい」
→ [NODES_SOCKETS_EDGES.md](./specifications/NODES_SOCKETS_EDGES.md)  
→ [StyleCustmizeGuide.md](./specifications/StyleCustmizeGuide.md)

#### 「画像が表示されない」
→ [IMAGE_DISPLAY_FIX.md](./fixes/IMAGE_DISPLAY_FIX.md)

#### 「実装の詳細を知りたい」
→ [IMPLEMENTATION_SUMMARY.md](./development/IMPLEMENTATION_SUMMARY.md)  
→ [NODE_LAYOUT_TECHNICAL_DETAILS.md](./development/NODE_LAYOUT_TECHNICAL_DETAILS.md)

#### 「テストデータを作りたい」
→ [DATA_GENERATION_GUIDE.md](./guides/DATA_GENERATION_GUIDE.md)

---

## 📝 ドキュメント作成ガイドライン

新しいドキュメントを作成する際の指針：

### 配置場所

- **ユーザー向けガイド** → `docs/guides/`
- **技術仕様・API** → `docs/specifications/`
- **実装詳細・設計** → `docs/development/`
- **バグ修正記録** → `docs/fixes/`
- **古い/不要** → `docs/archive/`

### ファイル名規則

- 大文字のアンダースコア区切り（例: `MY_DOCUMENT.md`）
- 内容がわかる明確な名前
- バージョン番号は末尾に（例: `FIX_v2.md`）

### 推奨構成

```markdown
# タイトル

## 概要
- 目的と対象読者

## 本文
- 構造化された内容

## まとめ
- 要点の再確認

## 関連ドキュメント
- リンク集
```

---

## 🔄 更新履歴

| 日付 | バージョン | 変更内容 |
|-----|-----------|---------|
| 2025-10-05 | 2.0 | ドキュメント構造を再編成、カテゴリ別に整理 |
| 2025-01-15 | 1.0 | 初版作成 |

---

**最終更新**: 2025年10月5日  
**管理者**: シナリオエディタ開発チーム
