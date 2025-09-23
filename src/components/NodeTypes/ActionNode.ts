import { ClassicPreset } from 'rete';
import { execSocket } from './sockets';

export class ActionNode extends ClassicPreset.Node<
    { exec: ClassicPreset.Socket },
    { exec: ClassicPreset.Socket },
    {} // Controlを削除
> {
    width = 180;
    height = 100; // 高さを調整
    data: { text: string; url?: string } = { text: '' }; // dataプロパティを定義

    constructor(initial?: string) {
        super('Action');
        this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
        this.addOutput('exec', new ClassicPreset.Output(execSocket, 'Exec'));
        this.data.text = initial || ''; // dataに初期値を設定
    }
}