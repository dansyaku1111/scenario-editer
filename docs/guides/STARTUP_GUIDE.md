# 起動手順書

## 🚀 環境要件

- **Node.js**: v16以上（確認済み: v22.17.0）
- **npm**: v8以上（確認済み: v10.9.2）
- **OS**: Windows, macOS, Linux

## 📦 初回セットアップ

### 1. プロジェクトディレクトリに移動

```bash
cd C:\scenario-editer
```

または、プロジェクトのルートディレクトリに移動してください。

### 2. 依存関係のインストール

```bash
npm install
```

初回のみ、または `package.json` が更新された後に実行してください。
インストールには数分かかる場合があります。

### 3. インストール確認

```bash
# Node.js バージョン確認
node --version

# npm バージョン確認
npm --version

# インストールされたパッケージ確認
npm list --depth=0
```

## 🏃 開発サーバーの起動

### 開発モード（推奨）

```bash
npm run dev
```

**期待される出力:**
```
VITE v4.5.14  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

**アクセス方法:**
ブラウザで `http://localhost:5173/` を開きます。

> **注意**: ポート5173が使用中の場合、自動的に別のポート（例: 5174）が使用されます。
> 表示されたURLを確認してください。

### 開発サーバーの停止

`Ctrl + C` を押してサーバーを停止します。

## 🏗️ プロダクションビルド

### ビルドの実行

```bash
npm run build
```

**期待される出力:**
```
> scenario-editor@0.0.0 build
> tsc && vite build

vite v4.5.14 building for production...
✓ 136 modules transformed.
dist/index.html                   0.41 kB │ gzip:  0.29 kB
dist/assets/index-b867d833.css   18.43 kB │ gzip:  4.00 kB
dist/assets/index-XXXXXXXX.js   276.29 kB │ gzip: 84.03 kB
✓ built in X.XXs
```

### ビルド成果物の確認

```bash
# Windowsの場合
dir dist

# macOS/Linuxの場合
ls -la dist/
```

ビルド成果物は `dist/` フォルダに生成されます。

### プロダクションプレビュー

```bash
npm run preview
```

ビルドされたファイルをローカルサーバーでプレビューできます。

## 🐛 トラブルシューティング

### 問題1: ポートが使用中

**症状:**
```
Port 5173 is in use, trying another one...
```

**対処法:**
- 自動的に別のポート（5174など）が使用されます
- 表示されたURLを確認してアクセスしてください
- または、他のViteプロセスを終了してください

### 問題2: モジュールが見つからない

**症状:**
```
Error: Cannot find module 'xxx'
```

**対処法:**
```bash
# node_modules を削除
rm -rf node_modules

# package-lock.json を削除
rm package-lock.json

# 再インストール
npm install
```

### 問題3: ビルドエラー

**症状:**
```
error TS2xxx: ...
```

**対処法:**
```bash
# TypeScriptコンパイラを確認
npx tsc --version

# node_modulesをクリーンアップ
npm run build -- --force
```

### 問題4: ソケットが表示されない

**症状:**
- Start/Endノード以外でソケット（接続点）が表示されない
- ノード同士を接続できない

**対処法:**
- 最新のビルドを使用していることを確認
- ブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）
- 開発サーバーを再起動

```bash
# サーバーを停止（Ctrl+C）
# 再起動
npm run dev
```

### 問題5: ブラウザが開かない

**症状:**
開発サーバーは起動するが、ブラウザが自動的に開かない

**対処法:**
- コンソールに表示されたURLを手動でコピーしてブラウザに貼り付け
- 例: `http://localhost:5173/`

## 🔍 動作確認

### 正常動作の確認項目

開発サーバー起動後、以下を確認してください：

1. **ページが表示される**
   - 「Rete.js シナリオエディタ」のタイトルが表示される
   - ツールバーが表示される（基本/シナリオの2段）

2. **ノードが追加できる**
   - ツールバーのボタンをクリック
   - キャンバスにノードが配置される

3. **ソケットが表示される**
   - ノードの左側（入力）と右側（出力）に丸いソケットが表示される
   - Start: 右側のみ（黄色）
   - End: 左側のみ（黄色）
   - Action/Condition等: 両側に複数のソケット

4. **接続が作成できる**
   - 出力ソケット（右側）をドラッグ
   - 入力ソケット（左側）にドロップ
   - 線が引かれる

5. **ノードが編集できる**
   - ノードをクリックして選択
   - 右側の編集パネルが表示される
   - テキストを入力して変更が反映される

### デバッグ情報の確認

**ブラウザの開発者ツールを開く:**
- Windows/Linux: `F12` または `Ctrl+Shift+I`
- macOS: `Cmd+Option+I`

**コンソールタブを確認:**
- エラーメッセージがないか確認
- 警告が表示されている場合は内容を確認

## 📚 追加リソース

- **詳細仕様**: [NODES_SOCKETS_EDGES.md](./NODES_SOCKETS_EDGES.md)
- **ビジュアルガイド**: [VISUAL_GUIDE.md](./VISUAL_GUIDE.md)
- **実装サマリ**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **変更履歴**: [CHANGELOG.md](./CHANGELOG.md)

## 💡 開発のヒント

### ホットリロード

開発モードでは、ソースコードを変更すると自動的にブラウザがリロードされます。
ファイルを保存するだけで変更が反映されます。

### ポート変更

デフォルトのポートを変更したい場合:

```bash
# vite.config.ts を編集
# または
npm run dev -- --port 3000
```

### ネットワーク公開

他のデバイスからアクセスしたい場合:

```bash
npm run dev -- --host
```

ネットワークIPアドレスが表示されます。

## 📞 サポート

問題が解決しない場合:
1. Issueを作成
2. エラーメッセージ全体をコピー
3. 実行環境（OS、Node.js、npmバージョン）を記載

---

**最終更新**: 2024年1月  
**対応バージョン**: 2.0.0
