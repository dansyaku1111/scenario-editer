# ノードレイアウト改善 - 最終実装

## 実装したこと

### 1. Node Type ラベルの追加
ノードの下部外側にノードタイプ名を表示

### 2. 画像サイズの拡大
- 120px → 160px に拡大
- テキストスタイル改善（12px, 行間1.5）

### 3. ソケット位置の調整（CSSベース）
**socketPositionWatcher は使用せず、シンプルなCSSで実装**

```css
[data-testid='node'] .input-socket {
    margin-left: -10px;  /* 左に移動 */
}

[data-testid='node'] .output-socket {
    margin-right: -10px;  /* 右に移動 */
}
```

## なぜsocketPositionWatcherを使わないのか

### 問題点
1. `attach(area)`を呼ぶとエラーが発生
   ```
   Error: actual parent is not instance of type
   ```
2. Rete.jsのバージョンや設定によって動作が不安定
3. 実装が複雑

### CSSソリューションの利点
1. **シンプル**: CSS 2行で実現
2. **確実**: エラーが発生しない
3. **調整が簡単**: margin値を変更するだけ
4. **即座に反映**: ブラウザで すぐに確認できる

## ソケット位置の調整方法

### より外側に移動したい場合
```css
margin-left: -15px;   /* -10px → -15px */
margin-right: -15px;
```

### 境界線ぴったりに配置したい場合
```css
margin-left: -7px;    /* ソケット半径分 */
margin-right: -7px;
```

### 元の位置に戻したい場合
```css
margin-left: 0;
margin-right: 0;
```

## 確認手順

1. ブラウザで http://localhost:5174/ を開く
2. Ctrl + Shift + R で強制リロード
3. ノードを追加（例: Action ノード）
4. 確認項目:
   - [ ] Node Name がノード上部に表示
   - [ ] Node Type がノード下部に表示
   - [ ] 入力ソケットがノードの左側に配置
   - [ ] 出力ソケットがノードの右側に配置
   - [ ] 画像が大きく表示（160px）
   - [ ] テキストが読みやすい

## 修正したファイル

1. **src/components/NodeEditor.tsx**
   - Node Type ラベルを追加
   - socketPositionWatcherの実装を削除（不要）

2. **src/components/NodeTypes/ImageControl.tsx**
   - 画像: 120px → 160px
   - テキスト: 11px → 12px, 行間1.5

3. **src/styles/editor.css**
   - Node Type ラベルのスタイル追加
   - ソケット位置調整（margin-left/right）

## トラブルシューティング

### ソケットが見えない
- `overflow: hidden` がノードに設定されていないか確認
- ソケットの`z-index`を確認

### 接続線がずれる
- marginの値を調整
- Rete.jsは自動的に接続線を再計算します

### スタイルが反映されない
- Ctrl + Shift + R で強制リロード
- 開発サーバーを再起動

## 今後の改善案

現在のCSSベースの実装で十分に機能しますが、より高度な制御が必要な場合は：

1. **カスタムSocketコンポーネント**
   - Reactコンポーネントでソケットをカスタマイズ
   - `customize.socket()`を使用

2. **接続線のカスタマイズ**
   - `classicConnectionPath`をカスタマイズ
   - カーブの調整

3. **アニメーション効果**
   - ソケットのホバーエフェクト
   - 接続時のアニメーション

## 参考

- Rete.js公式: https://retejs.org/
- CSS Flexbox: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
