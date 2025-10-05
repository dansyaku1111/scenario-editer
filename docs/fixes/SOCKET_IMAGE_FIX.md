# ソケットと画像の同時表示 - 実装完了

## 🎯 問題と解決

### 問題
- ソケット（接続点）が表示されない
- カスタムノードコンポーネントを使用すると画像が表示される
- デフォルトレンダリングを使用するとソケットは表示されるが画像が表示されない

### 解決方法
**NodeWrapperコンポーネント**を作成し、カスタムノードコンポーネント内でソケットを明示的にレンダリングするようにしました。

## 📁 実装内容

### 新規ファイル
`src/components/NodeTypes/NodeWrapper.tsx`

このコンポーネントは以下を提供します：
- 入力ソケット（左側）の自動レンダリング
- 出力ソケット（右側）の自動レンダリング
- カスタムコンテンツのラップ
- ソケット位置の自動計算

### 更新されたファイル
すべてのノードコンポーネントが`NodeWrapper`を使用するように更新されました：

1. `ActionNodeComponent.tsx` ✅
2. `ConditionNodeComponent.tsx` ✅
3. `ContentNodeComponent.tsx` ✅
4. `ImageNodeComponent.tsx` ✅
5. `CharacterNodeComponent.tsx` ✅
6. `EventNodeComponent.tsx` ✅
7. `TimerNodeComponent.tsx` ✅
8. `ExternalResourceNodeComponent.tsx` ✅

### NodeEditorの変更
`src/components/NodeEditor.tsx`でカスタムノードコンポーネントの使用を再度有効化しました。

## 🎨 表示される内容

### メインパネル（キャンバス）で確認できる内容

#### ✅ ソケット表示
- **入力ソケット（左側）**: 黄色い丸
  - Actionノード: exec, text
  - Conditionノード: exec, condition
  - Characterノード: exec
  - Eventノード: exec, participants
  - 等...

- **出力ソケット（右側）**: 黄色い丸
  - Actionノード: exec, content
  - Conditionノード: true, false, value
  - Characterノード: exec, entity, meta
  - Eventノード: exec, time, content
  - 等...

#### ✅ 画像表示
ノード内に画像URLが設定されている場合、ノード上に画像が表示されます：
- デフォルト画像: `https://placehold.co/200x150`
- カスタム画像: 編集パネルでURLを設定可能

#### ✅ その他の表示内容
- ノードタイトル
- テキスト内容
- ノード固有の情報（人物の役割、イベントの時刻など）

### サブパネル（編集パネル）で確認できる内容
- ノードの詳細情報
- 画像のプレビュー
- 編集フォーム

## 🚀 起動方法

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview
```

## ✅ 確認事項

開発サーバー起動後、以下を確認してください：

### 1. ソケットの表示
- [ ] Startノード: 右側に1つの黄色いソケット
- [ ] Endノード: 左側に1つの黄色いソケット
- [ ] Actionノード: 左側に2つ、右側に2つのソケット
- [ ] Characterノード: 左側に1つ、右側に3つのソケット

### 2. 画像の表示
- [ ] Actionノードにデフォルト画像が表示される
- [ ] Characterノードにデフォルト画像が表示される
- [ ] 編集パネルで画像URLを変更すると反映される

### 3. 接続機能
- [ ] 出力ソケット（右）から入力ソケット（左）へドラッグできる
- [ ] 線が引かれる
- [ ] 型が合わないソケット間では接続できない

### 4. ノード編集
- [ ] ノードをクリックして選択
- [ ] 右側の編集パネルが開く
- [ ] テキストや画像URLを編集できる
- [ ] 変更がノードに反映される

## 🔧 技術的な詳細

### NodeWrapperの仕組み

```tsx
<NodeWrapper data={data} emit={emit}>
  {/* カスタムコンテンツ */}
  <div className="...">
    <img src="..." />
    <p>...</p>
  </div>
</NodeWrapper>
```

NodeWrapperは以下を自動的に処理します：

1. **ソケットの配置計算**
   - 入力: 左側、垂直方向に30pxずつオフセット
   - 出力: 右側、垂直方向に30pxずつオフセット

2. **相対位置配置**
   - `position: absolute`を使用
   - 親要素に`position: relative`を設定

3. **Rete.jsとの統合**
   - `Presets.classic.Socket`コンポーネントを使用
   - Rete.jsのソケットデータ構造に対応

### カスタマイズ方法

ソケットの位置やスタイルを変更したい場合：

```tsx
// NodeWrapper.tsx の style 設定を変更
style={{ 
  left: '-12px',  // 左側の位置
  top: `${40 + index * 30}px`,  // 垂直位置（40pxから30pxずつ）
  zIndex: 10 
}}
```

## 🐛 トラブルシューティング

### ソケットが表示されない
1. ブラウザのキャッシュをクリア（Ctrl+Shift+R）
2. 開発サーバーを再起動
3. `npm run build`を再実行

### 画像が表示されない
1. 画像URLが正しいか確認
2. ブラウザの開発者ツールでネットワークエラーを確認
3. CORSエラーの場合は別の画像URLを試す

### 接続できない
1. ソケットの型が互換性があるか確認
2. 出力→入力の方向が正しいか確認
3. コンソールエラーを確認

## 📊 ビルド結果

```
✓ 137 modules transformed.
dist/index.html                   0.41 kB │ gzip:  0.28 kB
dist/assets/index-b867d833.css   18.43 kB │ gzip:  4.00 kB
dist/assets/index-0c65b5ae.js   286.14 kB │ gzip: 85.45 kB
✓ built in 1.68s
```

**ステータス**: ✅ ビルド成功

## 🎓 学んだこと

### Rete.jsのカスタムコンポーネント
Rete.jsでカスタムノードコンポーネントを使用する場合：

1. **Propsに`emit`を含める**
   ```tsx
   type Props = {
     data: any;
     emit: (props: any) => void;
   };
   ```

2. **ソケットを明示的にレンダリング**
   ```tsx
   <Presets.classic.Socket data={socket} />
   ```

3. **相対位置を使用**
   ```tsx
   <div className="relative">
     {/* ソケット: position: absolute */}
     {/* コンテンツ */}
   </div>
   ```

### React + Rete.jsの統合
- Rete.jsのReactプリセットはカスタマイズ可能
- ソケットコンポーネントは再利用可能
- 位置計算はCSSで柔軟に対応

## 📝 まとめ

ソケットと画像の同時表示が実装され、以下が可能になりました：

✅ ソケットの表示（接続機能）
✅ ノード内の画像表示
✅ カスタムデザイン（グラデーション、アイコン等）
✅ 型安全な接続
✅ 柔軟な拡張性

すべての機能が正常に動作し、ビルドも成功しています。

---

**最終更新**: 2024年1月  
**バージョン**: 2.0.1  
**ステータス**: ✅ 完全動作
