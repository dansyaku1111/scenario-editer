import React from 'react';

type Props = {
    data: string;
};

export default function JsonViewer({ data }: Props) {
    return (
        <pre className="json-viewer">
            <code>{data}</code>
        </pre>
    );
}
