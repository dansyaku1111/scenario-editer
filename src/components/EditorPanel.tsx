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

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate(node.id, { url: e.target.value });
    };

    const renderEditor = () => {
        switch (node.label) {
            case 'Action':
            case 'Condition':
                return (
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
                );
            case 'Image':
                 return (
                    <div>
                        <label htmlFor="node-url" className="block text-sm font-medium text-gray-700">画像URL</label>
                        <input
                            type="text"
                            id="node-url"
                            value={node.data.url || ''}
                            onChange={handleUrlChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                         {node.data.url && <img src={node.data.url} alt="preview" className="mt-2 rounded-md max-w-full" />}
                    </div>
                );
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