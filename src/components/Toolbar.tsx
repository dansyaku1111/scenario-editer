import { useRef } from 'react';

type Props = {
    onAddNode: (type: 'start' | 'action' | 'condition' | 'end' | 'image' | 'content' | 'character' | 'event' | 'timer' | 'external-resource') => void;
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
        <div className="toolbar space-y-3">
            <div className="flex gap-2 items-center flex-wrap">
                <div className="text-sm font-semibold text-gray-700">基本:</div>
                <button onClick={() => props.onAddNode('start')} className="px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600">▶ Start</button>
                <button onClick={() => props.onAddNode('action')} className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">⚡ Action</button>
                <button onClick={() => props.onAddNode('condition')} className="px-3 py-1.5 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">🔀 Condition</button>
                <button onClick={() => props.onAddNode('content')} className="px-3 py-1.5 bg-teal-500 text-white rounded text-sm hover:bg-teal-600">📝 Content</button>
                <button onClick={() => props.onAddNode('end')} className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600">⏹ End</button>
                <button onClick={() => props.onAddNode('image')} className="px-3 py-1.5 bg-purple-500 text-white rounded text-sm hover:bg-purple-600">🖼️ Image</button>
            </div>
            
            <div className="flex gap-2 items-center flex-wrap">
                <div className="text-sm font-semibold text-gray-700">シナリオ:</div>
                <button onClick={() => props.onAddNode('character')} className="px-3 py-1.5 bg-pink-500 text-white rounded text-sm hover:bg-pink-600">🔗 Character</button>
                <button onClick={() => props.onAddNode('event')} className="px-3 py-1.5 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600">📅 Event</button>
                <button onClick={() => props.onAddNode('timer')} className="px-3 py-1.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600">⏰ Timer</button>
                <button onClick={() => props.onAddNode('external-resource')} className="px-3 py-1.5 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600">🌐 Resource</button>
                
                <div className="flex-1"></div>
                
                <button onClick={props.onExport} className="px-4 py-1.5 bg-gray-700 text-white rounded text-sm hover:bg-gray-800">💾 Export</button>
                <button onClick={handleImportClick} className="px-4 py-1.5 bg-gray-700 text-white rounded text-sm hover:bg-gray-800">📂 Import</button>
                <button onClick={props.onClear} className="px-4 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">🗑️ Clear</button>
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
        </div>
    );
}