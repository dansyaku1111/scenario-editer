import { useRef } from 'react';

type Props = {
    onAddNode: (type: 'start' | 'action' | 'condition' | 'end' | 'image') => void;
    onImport: (file: File) => void;
    onExport: () => void;
    onClear: () => void;
    gridEnabled: boolean;
    onGridEnabledChange: (enabled: boolean) => void;
    snapEnabled: boolean;
    onSnapEnabledChange: (enabled: boolean) => void;
    gridSize: number;
    onGridSizeChange: (size: number) => void;
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

    const gridSizes = [8, 16, 32, 64];

    return (
        <div className="toolbar bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex gap-4 items-center flex-wrap">
                <span className="font-bold">ノード追加:</span>
                <button onClick={() => props.onAddNode('start')} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">スタート</button>
                <button onClick={() => props.onAddNode('action')} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">アクション</button>
                <button onClick={() => props.onAddNode('condition')} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">条件分岐</button>
                <button onClick={() => props.onAddNode('end')} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">エンド</button>
                <button onClick={() => props.onAddNode('image')} className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm">画像</button>
                <div className="flex-1"></div>
                 <span className="font-bold">ファイル:</span>
                <button onClick={props.onExport} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm">エクスポート</button>
                <button onClick={handleImportClick} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm">インポート</button>
                <button onClick={props.onClear} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">クリア</button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
            </div>
            <div className="border-t my-4"></div>
            <div className="flex gap-6 items-center flex-wrap">
                <span className="font-bold">エディタ設定:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={props.gridEnabled} onChange={(e) => props.onGridEnabledChange(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600" />
                    グリッド表示
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={props.snapEnabled} onChange={(e) => props.onSnapEnabledChange(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600" />
                    スナップ有効
                </label>
                <div className="flex items-center gap-2">
                    <label htmlFor="grid-size-select">グリッドサイズ:</label>
                    <select
                        id="grid-size-select"
                        value={props.gridSize}
                        onChange={(e) => props.onGridSizeChange(Number(e.target.value))}
                        className="form-select border-gray-300 rounded-md shadow-sm"
                    >
                        {gridSizes.map(size => <option key={size} value={size}>{size}px</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
}
