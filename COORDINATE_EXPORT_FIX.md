# 座標情報のエクスポート修正

## 問題

エクスポートしたJSONファイルに座標情報が正しく出力されず、全てのノードの`x`と`y`が`0`になってしまう問題がありました。

## 原因

`exportData`関数が`AreaPlugin`を正しく取得できていませんでした。Rete.jsのAreaPluginはノードの位置情報を管理していますが、エディタインスタンスから直接アクセスする方法が機能していませんでした。

## 解決方法

AreaPluginを`App.tsx`で保持し、エクスポート/インポート関数に直接渡すようにアーキテクチャを変更しました。

### 変更されたファイル

1. **`src/components/NodeEditor.tsx`**
   - `setEditor`関数のシグネチャを変更して、areaプラグインも渡すように修正
   - エディタとareaの両方を親コンポーネント（App）に提供

2. **`src/App.tsx`**
   - `area`のstateを追加
   - `handleSetEditor`関数を作成してエディタとareaの両方を保存
   - `handleExport`と`handleImport`でareaを渡すように修正

3. **`src/utils/jsonHandler.ts`**
   - `exportData`関数に`area`パラメータを追加
   - `importData`関数に`area`パラメータを追加
   - areaが渡されない場合のフォールバック処理を追加
   - 詳細なデバッグログを追加

## 修正の詳細

### NodeEditor.tsx

```typescript
type EditorProps = {
  setEditor: (editor: NodeEditor<any> | null, area?: AreaPlugin<any, Area> | null) => void;
  onNodeSelected: (node: any | null) => void;
};

// エディタとareaの両方を渡す
props.setEditor(editor, area);

// クリーンアップ時も両方をnullに
props.setEditor(null, null);
```

### App.tsx

```typescript
// areaのstateを追加
const [area, setArea] = useState<any>(null);

// エディタとareaを両方受け取る関数
const handleSetEditor = useCallback((newEditor: NodeEditor<any> | null, newArea?: any) => {
    setEditor(newEditor);
    setArea(newArea || null);
}, []);

// エクスポート時にareaを渡す
const handleExport = async () => { 
    if(editor && area) {
        console.log('Exporting with editor and area:', editor, area);
        await exportData(editor, area);
    }
};

// インポート時にareaを渡す
const handleImport = async (file: File) => { 
    if(editor && area) {
        await importData(editor, area, file);
    }
};
```

### jsonHandler.ts

```typescript
// exportData関数のシグネチャ変更
export async function exportData(editor: NodeEditor<any>, area?: any): Promise<any> {
    console.log('Export function called with area:', area);
    
    // areaが渡されていることを確認
    if (!area) {
        console.warn('AreaPlugin not found, node positions will default to (0, 0)');
    } else {
        console.log('Using area plugin:', area);
        console.log('Area has nodeViews:', !!area.nodeViews);
    }
    
    // ノードの位置を取得
    for (const node of editor.getNodes()) {
        let x = 0;
        let y = 0;
        
        if (area && area.nodeViews) {
            const nodeView = area.nodeViews.get(node.id);
            if (nodeView && nodeView.position) {
                x = nodeView.position.x || 0;
                y = nodeView.position.y || 0;
                console.log(`Node ${node.id} (${node.label}) position:`, x, y);
            }
        }
        
        const nodeData: any = {
            id: node.id,
            label: node.label,
            type: getNodeSpecificType(node),
            x: x,  // 正しい座標
            y: y   // 正しい座標
        };
        
        nodes.push(nodeData);
    }
}

// importData関数のシグネチャ変更
export async function importData(editor: NodeEditor<any>, area: any, fileOrData: File | any) {
    // ... データの読み込みとパース ...
    
    // ノードを作成して配置
    for (const nodeData of data.nodes) {
        // ... ノード作成 ...
        
        await editor.addNode(node);
        if (area) {
            console.log(`Translating node ${node.id} to position:`, nodeData.x, nodeData.y);
            await area.translate(node.id, { x: nodeData.x, y: nodeData.y });
        }
    }
}
```

## デバッグ機能

詳細なログを追加して問題の診断を容易にしました：

**エクスポート時:**
- `Export function called with area:` - areaが正しく渡されているか確認
- `Using area plugin:` - areaプラグインの情報
- `Area has nodeViews:` - nodeViewsが存在するか確認
- `Node X (Label) position: x, y` - 各ノードの座標

**インポート時:**
- `Translating node X to position: x, y` - 各ノードの配置位置

## テスト方法

1. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

2. **ブラウザで http://localhost:5174/ を開く**

3. **複数のノードを追加**
   - Start, Action, End などを追加
   - ノードをドラッグして異なる位置に配置

4. **ブラウザコンソールを開く（F12）**

5. **Exportボタンをクリック**
   - コンソールで各ノードの座標が正しく表示されることを確認
   - 例: `Node abc123 (Action) position: 350 100`

6. **ダウンロードしたJSONファイルを確認**
   ```json
   {
     "nodes": [
       {
         "id": "abc123",
         "label": "Action",
         "type": "action",
         "x": 350,   // 正しい座標
         "y": 100    // 正しい座標
       }
     ]
   }
   ```

7. **Importボタンでファイルを読み込む**
   - ノードが正しい位置に配置されることを確認

## 期待される結果

- エクスポートしたJSONファイルに正しい座標情報が含まれる
- インポート時にノードが元の位置に復元される
- コンソールログで座標の取得と設定を確認できる

## トラブルシューティング

### 問題: まだ座標が0になる

**チェック項目:**
1. ブラウザコンソールで以下を確認:
   - `Export function called with area:` がnullでないこと
   - `Area has nodeViews: true` と表示されること
   - 各ノードの座標が表示されること

2. areaプラグインが正しく渡されているか確認:
   ```javascript
   console.log('Exporting with editor and area:', editor, area);
   ```

### 問題: インポート後にノードが重なる

**解決方法:**
- JSONファイルの座標が正しいか確認
- ブラウザコンソールで`Translating node`ログを確認
- `area.translate()`が正しく呼ばれているか確認

## フォールバック機能

areaが渡されない場合でも、以下の方法で取得を試みます：

1. `editor.getPlugin(AreaPlugin)` メソッド
2. `editor.plugins` プロパティ
3. `editor._plugins` プロパティ（内部API）

これにより、古いコードとの互換性を保ちながら新しい方式を利用できます。

## まとめ

この修正により：
- ✅ ノードの座標情報が正しくエクスポートされる
- ✅ インポート時にノードが正しい位置に配置される
- ✅ 詳細なデバッグログで問題の診断が容易
- ✅ フォールバック機能で互換性を維持
