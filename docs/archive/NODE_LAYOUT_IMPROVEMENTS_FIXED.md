# ノードレイアウト改善実装ドキュメント（修正版）

## 実装日
2025年1月

## 概要
手描きの理想デザイン（Node_Ideal.jpg）に基づいて、ノードのレイアウトとソケットの位置を改善しました。

重要: **CSSでの絶対配置ではなく、Rete.jsの公式API `socketPositionWatcher` を使用してソケット位置を制御します。**

## 実装した変更

### 1. Node Type ラベルの追加
**位置**: ノードの外側下部
**実装ファイル**: `src/components/NodeEditor.tsx`

```
                     Node Name           
                  ┌─────────────────────┐
                  │  ┌───────────────┐  │
● Input Socket    │  │    Image      │  │    ● Output Socket
  (境界線上)       │  │   (160px)     │  │      (境界線上)
                  │  └───────────────┘  │
                  │  Description text   │ 
                  └─────────────────────┘
                     [Node Type]         ← 新規追加
```

### 2. ソケット位置の制御（socketPositionWatcher）

**重要な実装ポイント**: CSSでの`position: absolute`配置を削除し、Rete.jsの`getDOMSocketPosition`を使用します。

**実装ファイル**: `src/components/NodeEditor.tsx`

```typescript
import { getDOMSocketPosition } from 'rete-render-utils';

const socketPositionWatcher = getDOMSocketPosition({
  offset({ x, y }, nodeId, side, key) {
    // 入力ソケットは左に、出力ソケットは右にオフセット
    if (side === 'input') {
      return { x: x - 14, y }; // 左側に14px移動（境界線上へ）
    } else {
      return { x: x + 14, y }; // 右側に14px移動（境界線上へ）
    }
  }
});

render.addPreset(ReactPresets.classic.setup({
  socketPositionWatcher, // 適用
  // ...
}));
```

**なぜsocketPositionWatcherを使うのか**:
- CSSでの絶対配置だと接続線の計算がずれる
- Rete.jsの内部ロジックと整合性が保たれる
- ノードのドラッグ時も正しく動作する

### 3. 必要なパッケージの追加

**package.json**に`rete-render-utils`を追加：

```json
{
  "dependencies": {
    "rete-render-utils": "^2.0.3"
  }
}
```

インストール:
```bash
npm install
```

### 4. 画像サイズの拡大
**実装ファイル**: `src/components/NodeTypes/ImageControl.tsx`
- `maxHeight: 120px` → `160px`

### 5. テキストスタイルの改善
**実装ファイル**: `src/components/NodeTypes/ImageControl.tsx`
- フォントサイズ: 11px → 12px
- 行間: 1.3 → 1.5

## セットアップ手順

### 手順1: 依存関係のインストール

新しいPowerShellウィンドウを開いて：

```powershell
cd C:\scenario-editer
npm install
```

**注意**: `rete-render-utils`が正しくインストールされることを確認してください。

### 手順2: 開発サーバーの起動

```powershell
npm run dev
```

### 手順3: ブラウザで確認

`http://localhost:5173` を開いて以下を確認：
- [ ] Node Typeラベルがノード下部に表示されている
- [ ] ソケットが境界線上に配置されている
- [ ] 入力ソケットがノードの左側境界にある
- [ ] 出力ソケットがノードの右側境界にある
- [ ] 接続線が自然にソケットから伸びている
- [ ] 画像が大きく表示されている（160px）

## トラブルシューティング

### 問題: ソケットの位置がずれている

**原因**: CSSで`position: absolute`が残っている可能性

**解決策**:
1. `src/styles/editor.css`を確認
2. 以下のようなCSS規則がないことを確認：
   ```css
   [data-testid='node'] .input-socket [data-testid='socket'] {
       position: absolute;  /* これがあったら削除 */
       left: -7px;
   }
   ```

### 問題: npm installがうまくいかない

**解決策**:
```powershell
# キャッシュをクリア
npm cache clean --force

# node_modulesを削除
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 再インストール
npm install
```

### 問題: rete-render-utilsが見つからない

**解決策**:
```powershell
npm install rete-render-utils --save
```

## 修正されたファイル一覧

1. **src/components/NodeEditor.tsx**
   - `getDOMSocketPosition`のimport追加  
   - `socketPositionWatcher`の実装
   - Node Type ラベルの追加

2. **src/components/NodeTypes/ImageControl.tsx**
   - 画像サイズ: 120px → 160px
   - テキストスタイル改善

3. **src/styles/editor.css**
   - CSS絶対配置を削除（重要！）
   - Node Type ラベルのスタイル追加

4. **package.json**
   - `rete-render-utils`を依存関係に追加

## 技術的な詳細

### socketPositionWatcherの仕組み

`getDOMSocketPosition`は、ソケットのDOM要素の位置を取得し、オフセットを適用します：

1. Rete.jsがソケットの基本位置を計算
2. `offset`関数がオフセット値を返す
3. 接続線の開始/終了点が正しく計算される

### オフセット値の調整

現在のオフセット値：
- 入力: `x - 14` (左に14px)
- 出力: `x + 14` (右に14px)

ソケットサイズ（14px）に合わせて、ちょうどノードの境界線上に配置されます。

## 参考資料

- [Rete.js Socket Position公式ドキュメント](https://retejs.org/docs/guides/socket-position)
- 手描き理想デザイン: `Node_Ideal.jpg`
- スタイルガイド: `NODE_STYLE_GUIDE.md`
