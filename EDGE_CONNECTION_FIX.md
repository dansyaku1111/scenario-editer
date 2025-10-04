# エッジ作成問題の解決方法

## 🎯 最終的な解決策

**Rete.jsのデフォルトレンダリング + ImageControl**を使用する方法が最適です。

### 理由
1. カスタムNodeComponentを使用すると、ソケットのイベントハンドリングが複雑になる
2. Rete.jsのConnectionPluginは、デフォルトのノードレンダリングと密接に統合されている
3. ImageControlを使えば、デフォルトレンダリングでも画像を表示できる

## 📋 実装手順

### 1. ImageControlの作成 ✅
`src/components/NodeTypes/ImageControl.tsx`を作成済み

### 2. 各ノードにImageControlを追加 ✅
以下のノードを更新済み：
- ActionNode.ts
- CharacterNode.ts
- ContentNode.ts
- ConditionNode.ts
- EventNode.ts
- TimerNode.ts
- ExternalResourceNode.ts
- ImageNode.ts

### 3. NodeEditorでImageControlを登録 ✅
`src/components/NodeEditor.tsx`でImageControlComponentを登録済み

### 4. カスタムNodeComponentの削除 ⚠️ 必要
以下のファイルは不要になったため削除可能：
- ActionNodeComponent.tsx
- ConditionNodeComponent.tsx
- ContentNodeComponent.tsx
- ImageNodeComponent.tsx
- CharacterNodeComponent.tsx
- EventNodeComponent.tsx
- TimerNodeComponent.tsx
- ExternalResourceNodeComponent.tsx

## 🔧 残りの作業

カスタムNodeComponentファイルを削除するか、または完全に削除せずにコメントアウトして保管します。

```powershell
# カスタムNodeComponentファイルを削除
Remove-Item src/components/NodeTypes/*Component.tsx
```

## ✅ 期待される動作

この実装により、以下が実現されます：

1. **ソケットのドラッグ＆ドロップ** ✅
   - 出力ソケット（右）をドラッグ開始
   - 入力ソケット（左）にドロップで接続
   
2. **画像の表示** ✅
   - ノード内にImageControlとして表示
   - データ更新時も反映される

3. **デフォルトのノードスタイル**
   - Rete.jsのクリーンなデザイン
   - ソケットの色表示（型による）

## 🎨 カスタマイズ方法

ノードの見た目をカスタマイズしたい場合は、CSSを使用します：

```css
/* styles/editor.css に追加 */
.node[data-testid="node"] {
  /* ノード全体のスタイル */
}

.node .title {
  /* タイトル部分のスタイル */
}

.node .input-socket {
  /* 入力ソケットのスタイル */
}

.node .output-socket {
  /* 出力ソケットのスタイル */
}
```

## 📝 技術的な詳細

### なぜカスタムNodeComponentでソケットが動作しないのか

Rete.jsのConnectionPluginは以下のように動作します：

1. ノードコンポーネントのDOMツリーを監視
2. ソケット要素の`data-testid="socket"`属性を探す
3. ポインターイベントをキャプチャして接続処理を実行

カスタムコンポーネントでは、この構造を正確に再現する必要があり、非常に複雑です。

### ImageControlの利点

- Rete.jsの公式APIを使用
- ノードのコントロールとして正しく統合
- データ更新時の再レンダリングが自動
- TypeScriptの型安全性

## 🚀 次のステップ

1. カスタムNodeComponentファイルを削除
2. ビルドして動作確認
3. 必要に応じてCSSでスタイルをカスタマイズ

---

**結論**: Rete.jsのエコシステムに従った実装が最も確実で保守しやすい
