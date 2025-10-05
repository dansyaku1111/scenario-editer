# 画像表示問題の修正（v2.1.0）

## 問題の概要

v2.1.0のレイアウト改善において、CSSの`overflow: hidden`設定を追加した際に、ノード内の画像が表示されなくなる問題が発生しました。

## 原因

以下の3箇所で`overflow: hidden`が設定されていたため、ImageControlコンポーネントで表示される画像が隠れてしまっていました：

1. **CSS `.control` クラス** (`src/styles/editor.css`)
   ```css
   [data-testid='node'] .control {
       overflow: hidden;  /* ← これが原因 */
   }
   ```

2. **CSS `.image-control` クラス** (`src/styles/editor.css`)
   ```css
   [data-testid='node'] .image-control {
       /* overflow設定なし → 暗黙的にvisible */
   }
   ```

3. **ImageControlComponentのインラインスタイル** (`src/components/NodeTypes/ImageControl.tsx`)
   ```tsx
   style={{ 
       overflow: 'hidden'  /* ← これが原因 */
   }}
   ```

## 修正内容

### 1. `src/styles/editor.css`

#### `.control` クラスの修正
```css
/* 修正前 */
[data-testid='node'] .control {
    width: 100%;
    margin: 6px 0;
    position: relative;
    z-index: 0;
    overflow: hidden;  /* ← 削除 */
}

/* 修正後 */
[data-testid='node'] .control {
    width: 100%;
    margin: 6px 0;
    position: relative;
    z-index: 0;
    /* overflow: hidden; を削除 - 画像を表示するため */
}
```

#### `.image-control` クラスの修正
```css
/* 修正前 */
[data-testid='node'] .image-control {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 6px;
    box-sizing: border-box;
}

/* 修正後 */
[data-testid='node'] .image-control {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 6px;
    box-sizing: border-box;
    overflow: visible; /* 画像を表示するため */
}
```

### 2. `src/components/NodeTypes/ImageControl.tsx`

ImageControlComponentのインラインスタイルから`overflow: 'hidden'`を削除：

```tsx
/* 修正前 */
<div 
  className="image-control" 
  style={{ 
    padding: '6px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden'  /* ← 削除 */
  }}
>

/* 修正後 */
<div 
  className="image-control" 
  style={{ 
    padding: '6px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box'
    // overflow: 'hidden' を削除 - 画像を表示するため
  }}
>
```

## テキストのオーバーフロー制御

テキスト部分は引き続き`overflow: hidden`を保持し、長いテキストが表示領域を超えないようにしています：

```tsx
{data.text && (
  <p style={{
    marginTop: '6px',
    marginBottom: '2px',
    fontSize: '11px',
    color: '#374151',
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: '1.3',
    maxHeight: '80px',
    overflow: 'hidden',  /* ← テキストのみ制限 */
    textOverflow: 'ellipsis'
  }}>
    {data.text}
  </p>
)}
```

## 動作確認

### 修正後の動作
- ✅ 画像が正常に表示される
- ✅ 画像サイズが適切に制限される（最大120px）
- ✅ テキストが80pxを超える場合は切り捨てられる
- ✅ ノードのレイアウトが崩れない
- ✅ ラベル名が上部に表示される

### テスト手順
1. 開発サーバーを起動: `npm run dev`
2. ノードを作成（Start, Action, Image等）
3. 各ノードに画像が表示されることを確認
4. 編集パネルから画像をアップロード
5. 画像が正しく表示されることを確認

## ビルド確認

```bash
npm run build
```

✅ TypeScriptコンパイル成功
✅ Viteビルド成功
✅ エラー・警告なし

## 影響範囲

### 変更したファイル
1. `src/styles/editor.css` - `.control`と`.image-control`クラスのoverflow設定
2. `src/components/NodeTypes/ImageControl.tsx` - インラインスタイルのoverflow削除

### 影響を受けるノードタイプ
全てのノードタイプ（ImageControlを使用する全ノード）：
- StartNode
- EndNode
- ActionNode
- ImageNode
- ContentNode
- ConditionNode
- CharacterNode
- EventNode
- TimerNode
- ExternalResourceNode

## 今後の注意点

ノード内のコンテンツ表示に関するCSS変更を行う際は、以下の点に注意：

1. **画像コンテナには`overflow: visible`を使用**
   - 画像が表示されるようにする

2. **テキストコンテナには`overflow: hidden`を使用**
   - 長いテキストがノードからはみ出さないようにする

3. **ノード本体のoverflowは慎重に設定**
   - ラベル名（ノード上部）が表示できるように`overflow: visible`を推奨

4. **テスト項目に画像表示を含める**
   - レイアウト変更後は必ず画像が表示されることを確認

## 関連ドキュメント

- [NODE_LABEL_AND_LAYOUT_IMPROVEMENTS.md](./NODE_LABEL_AND_LAYOUT_IMPROVEMENTS.md) - レイアウト改善の詳細
- [VISUAL_GUIDE_LABEL_LAYOUT.md](./VISUAL_GUIDE_LABEL_LAYOUT.md) - ビジュアルガイド
- [IMAGE_DISPLAY_FIX.md](./IMAGE_DISPLAY_FIX.md) - 以前の画像表示修正

---

**修正日:** 2025-01-05  
**バージョン:** 2.1.0  
**修正者:** システム
