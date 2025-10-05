# ソケット位置の修正 - 完全版

## 問題の原因

`socketPositionWatcher`を作成しても、**`attach(area)`メソッドを呼んでいなかった**ため、ソケット位置のカスタマイズが適用されていませんでした。

## 修正内容

### NodeEditor.tsx の修正

```typescript
// ソケット位置計算を作成
const socketPositionWatcher = getDOMSocketPosition({
  offset({ x, y }, nodeId, side, key) {
    if (side === 'input') {
      return { x: x - 14, y }; // 左側に14px移動
    } else {
      return { x: x + 14, y }; // 右側に14px移動
    }
  }
});

// 重要: areaに接続する
socketPositionWatcher.attach(area);
```

### 必要な手順

1. **`getDOMSocketPosition`でwatcherを作成**
2. **`socketPositionWatcher.attach(area)`を呼ぶ** ← これが重要！
3. **`render.addPreset`の`socketPositionWatcher`オプションに渡す**

## 公式ドキュメントの参照

`rete-render-utils`のREADMEより：

```ts
import { getDOMSocketPosition } from 'rete-render-utils';

const socketPositionWatcher = getDOMSocketPosition<Schemes, AreaExtra>(area)

// attachを呼ぶ必要がある
socketPositionWatcher.attach(area)

const unwatch = socketPositionWatcher.listen(nodeId, portSide, portKey, (position) => {
  // called when the socket position changes
})
```

## 確認方法

### ブラウザで確認

1. http://localhost:5174 を開く
2. F12 で開発者ツールを開く
3. Console タブを選択
4. ノードを追加（例: Action ノード）
5. Console に以下が表示されるか確認：
   ```
   [NodeEditor] getDOMSocketPosition: function
   [NodeEditor] socketPositionWatcher created: DOMSocketPosition {...}
   [NodeEditor] socketPositionWatcher attached to area
   [Socket Offset] nodeId:..., side:input, key:exec, offset:-14
   [Socket Offset] nodeId:..., side:output, key:exec, offset:14
   ```

### 視覚的な確認

- **入力ソケット（●）**: ノードの左側に表示される
- **出力ソケット（●）**: ノードの右側に表示される
- **接続線**: ソケットから自然に伸びる

## トラブルシューティング

### Console に何も表示されない

- ブラウザを強制リロード（Ctrl + Shift + R）
- TypeScriptのコンパイルエラーがないか確認
- 開発サーバーのログを確認

### ソケット位置が変わらない

- `socketPositionWatcher.attach(area)`が呼ばれているか確認
- Console に `[Socket Offset]` メッセージが表示されているか確認
- オフセット値（-14, +14）を調整してみる

### 接続線がおかしい

- オフセット値を変更してみる
- 現在: `-14` と `+14`
- 試してみる: `-20` と `+20`（もっと外側に）
- 試してみる: `-10` と `+10`（少し内側に）

## 次のステップ

ソケット位置が正しく動作したら、デバッグ用のconsole.logを削除できます。

```typescript
// デバッグログを削除
// console.log('[NodeEditor] getDOMSocketPosition:', typeof getDOMSocketPosition);
// console.log('[Socket Offset] ...');
```

## 参考資料

- [rete-render-utils GitHub](https://github.com/retejs/render-utils)
- [Rete.js公式ドキュメント](https://retejs.org/docs)
