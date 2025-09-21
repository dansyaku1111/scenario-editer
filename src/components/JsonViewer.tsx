type Props = {
    data: string;
};

export default function JsonViewer({ data }: Props) {
    return (
        <div className="json-viewer">
            <pre><code>{data}</code></pre>
        </div>
    );
}
