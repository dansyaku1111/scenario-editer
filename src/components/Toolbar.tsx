import { useRef } from 'react';

type Props = {
    onAddNode: (type: 'start' | 'action' | 'condition' | 'end' | 'image') => void;
    onImport: (file: File) => void;
    onExport: () => void;
    onClear: () => void;
};

export default function Toolbar(props: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            props.onImport(file);
        }
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="toolbar flex gap-4 items-center flex-wrap">
            <button onClick={() => props.onAddNode('start')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">スタートノード追加</button>
            <button onClick={() => props.onAddNode('action')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">アクションノード追加</button>
            <button onClick={() => props.onAddNode('condition')} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">条件分岐ノード追加</button>
            <button onClick={() => props.onAddNode('end')} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">エンドノード追加</button>
            <button onClick={() => props.onAddNode('image')} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">画像ノード追加</button>
            <div className="flex-1"></div>

            {/* --- ここからがチェックボックスの描画ロジックです --- */}
            <div className="flex items-center gap-2 border-l pl-4">
                <input
                    type="checkbox"
                    id="grid-snap-toggle" // デバッグスクリプトはこのidを探します
                    checked={props.isGridSnapEnabled}
                    onChange={props.onToggleGridSnap}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="grid-snap-toggle" className="text-sm font-medium text-gray-700">
                    グリッド/スナップ
                </label>
            </div>
            {/* --- ここまで --- */}

            <button onClick={props.onExport} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">JSONエクスポート</button>
            <button onClick={handleImportClick} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">JSONインポート</button>
            <button onClick={props.onClear} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">クリア</button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
        </div>
    );
}