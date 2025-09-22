import React, { useState, useEffect } from 'react';
import { Schemes } from '../App';

type Props = {
    node: Schemes['Node'] | null;
    onUpdate: (nodeId: string, data: { [key: string]: any }) => void;
};

export default function EditorPanel({ node, onUpdate }: Props) {
    const [formData, setFormData] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        if (node) {
            setFormData(node.data || {});
        }
    }, [node]);

    if (!node) {
        return <div className="p-4 bg-white rounded-lg shadow">ノードを選択してください</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onUpdate(node.id, formData);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">ノード編集: {node.label}</h3>
            <div className="space-y-4">
                {Object.keys(node.data).map((key) => (
                    <div key={key}>
                        <label className="block text-sm font-medium text-gray-700">{key}</label>
                        <input
                            type="text"
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={handleSave}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                保存
            </button>
        </div>
    );
}
