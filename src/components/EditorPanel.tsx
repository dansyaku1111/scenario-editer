import { Schemes } from '../App';

type Props = {
    node: Schemes['Node'] | null;
    onUpdate: (nodeId: string, data: { [key: string]: any }) => void;
};

export default function EditorPanel({ node, onUpdate }: Props) {
    if (!node) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">編集パネル</h3>
                <p className="mt-4 text-gray-500">編集するノードを選択してください。</p>
            </div>
        );
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate(node.id, { text: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target && typeof loadEvent.target.result === 'string') {
                    onUpdate(node.id, { url: loadEvent.target.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const renderEditor = () => {
        const imageEditor = (
            <div>
                <label htmlFor="node-image-upload" className="block text-sm font-medium text-gray-700">画像ファイル</label>
                <input
                    type="file"
                    id="node-image-upload"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {node.data.url && <img src={node.data.url} alt="preview" className="mt-2 rounded-md max-w-full" />}
            </div>
        );

        switch (node.label) {
            case 'Action':
            case 'Condition':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="node-text" className="block text-sm font-medium text-gray-700">内容</label>
                            <textarea
                                id="node-text"
                                value={node.data.text || ''}
                                onChange={handleTextChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                rows={5}
                            />
                        </div>
                        {imageEditor}
                    </div>
                );
            case 'Image':
                 return imageEditor;
            default:
                return <p className="text-gray-500">このノードには編集可能な項目がありません。</p>;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                編集: <span className="text-blue-600">{node.label}</span>
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-500">ノードID</label>
                    <p className="text-sm text-gray-800 break-all">{node.id}</p>
                </div>
                {renderEditor()}
            </div>
        </div>
    );
}
