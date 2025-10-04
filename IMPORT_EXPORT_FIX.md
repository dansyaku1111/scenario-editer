# インポート/エクスポート機能の修正

## 問題

エクスポートしたJSONファイルをインポートすると、以下のエラーが発生していました：

```
TypeError: data.nodes is not iterable
```

パネル上の全ての要素がクリアされてしまう問題がありました。

## 原因

`importData`関数が`File`オブジェクトを直接処理しようとしていましたが、ファイルの内容を読み込んでJSONとしてパースする処理が不足していました。

## 修正内容

### 1. `jsonHandler.ts` - `importData`関数の修正

以下の機能を追加しました：

#### ファイル読み込みとパース
```typescript
// Fileオブジェクトの場合は読み込んでパース
if (fileOrData instanceof File) {
    const text = await fileOrData.text();
    data = JSON.parse(text);
}
```

#### データ構造の検証
```typescript
// データ構造の検証
if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format: expected an object');
}

if (!Array.isArray(data.nodes)) {
    throw new Error('Invalid data format: nodes must be an array');
}

if (!Array.isArray(data.connections)) {
    throw new Error('Invalid data format: connections must be an array');
}
```

#### 詳細なエラーハンドリング
- JSONパースエラーの処理
- 不明なノードタイプのスキップ
- 無効な接続のスキップ
- 各段階でのコンソールログ出力

#### 接続の検証強化
```typescript
const sourceOutput = (source.outputs as any)[connData.sourceOutput];
const targetInput = (target.inputs as any)[connData.targetInput];

if (sourceOutput && targetInput) {
    // 接続を作成
} else {
    console.warn('Invalid connection: source output or target input not found');
}
```

### 2. デバッグ機能の追加

エクスポート時とインポート時に詳細なログを出力するようにしました：

**エクスポート時:**
```typescript
console.log('Exporting data:', data);
console.log('Number of nodes:', data.nodes.length);
console.log('Number of connections:', data.connections.length);
```

**インポート時:**
```typescript
console.log('Import started, received:', fileOrData);
console.log('Reading file:', fileOrData.name);
console.log('Parsed JSON successfully:', data);
console.log('Importing X nodes and Y connections');
console.log('Creating node:', nodeData.type, nodeData.id);
console.log('Import completed successfully');
```

## テスト方法

### 1. 基本的なエクスポート/インポートテスト

1. ブラウザで http://localhost:5174/ を開く
2. いくつかのノードを追加（Start, Action, Endなど）
3. ノード間を接続
4. **Export**ボタンをクリック
5. JSONファイルがダウンロードされることを確認
6. **Import**ボタンをクリック
7. ダウンロードしたJSONファイルを選択
8. ノードと接続が正しく復元されることを確認

### 2. サンプルファイルを使用したテスト

プロジェクトルートに`test_scenario.json`というサンプルファイルを作成しました。

このファイルをインポートしてテストできます：
- Start ノード（座標: 100, 100）
- Action ノード（座標: 350, 100）
- End ノード（座標: 600, 100）
- 3つのノードが順番に接続されている

### 3. デバッグ方法

問題が発生した場合：

1. **ブラウザのコンソールを開く**（F12キー）
2. エクスポート/インポート操作を実行
3. コンソールに出力されるログを確認：
   - `Exporting data:` - エクスポートされたデータ構造
   - `Import started, received:` - インポート開始時の入力
   - `Parsed JSON successfully:` - パース後のデータ
   - `Creating node:` - 各ノードの作成状況
   - エラーメッセージがある場合は詳細を確認

## エクスポートされるJSON形式

```json
{
  "nodes": [
    {
      "id": "unique-node-id",
      "label": "Node Label",
      "type": "start|action|condition|end|image|content|character|event|timer|external-resource",
      "x": 100,
      "y": 100,
      "data": {
        "title": "Node Title",
        "text": "Node Text",
        "imageUrl": "https://example.com/image.png",
        "url": "data:image/png;base64,...",
        // その他のノード固有のデータ
      }
    }
  ],
  "connections": [
    {
      "id": "unique-connection-id",
      "source": "source-node-id",
      "sourceOutput": "exec",
      "target": "target-node-id",
      "targetInput": "exec"
    }
  ],
  "metadata": {
    "version": "2.0.0",
    "exported_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## エラーハンドリング

以下のエラーケースに対応しています：

1. **無効なJSON**: `Invalid JSON file`エラーを表示
2. **不正なデータ構造**: 明確なエラーメッセージを表示
3. **未知のノードタイプ**: 警告を出力してスキップ
4. **無効な接続**: 警告を出力してスキップ
5. **存在しないノードへの接続**: 警告を出力してスキップ

## 互換性

- 既存のエクスポートファイルと互換性あり
- バージョン2.0.0形式をサポート
- 古い形式のファイルも読み込み可能（データ構造が正しければ）

## トラブルシューティング

### 問題: インポート後にノードが表示されない
**解決方法**: 
- ブラウザコンソールでエラーを確認
- JSONファイルの構造が正しいか確認
- `nodes`と`connections`が配列であることを確認

### 問題: 接続が復元されない
**解決方法**:
- ブラウザコンソールで警告メッセージを確認
- ソケット名（`sourceOutput`、`targetInput`）が正しいか確認
- ノードIDが一致しているか確認

### 問題: 画像が表示されない
**解決方法**:
- `imageUrl`または`url`フィールドが存在するか確認
- 画像URLが有効であるか確認
- Base64エンコードされた画像の場合、データが破損していないか確認

## 今後の改善案

1. **バージョン管理**: 異なるバージョン間の互換性処理
2. **バリデーション強化**: JSONスキーマによる厳密な検証
3. **エラーUIの改善**: ユーザーフレンドリーなエラーメッセージ表示
4. **進捗表示**: 大きなファイルのインポート時の進捗バー
5. **差分インポート**: 既存のデータに追加でノードをインポート
