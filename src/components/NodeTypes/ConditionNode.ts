import { ClassicPreset } from 'rete';
import { execSocket } from './sockets';

export class ConditionNode extends ClassicPreset.Node<
    { exec: ClassicPreset.Socket },
    { true: ClassicPreset.Socket; false: ClassicPreset.Socket },
    {} // Controlを削除
> {
    width = 180;
    height = 120; // 高さを調整
    data: { text: string } = { text: '' }; // dataプロパティを定義

    constructor(initial?: string) {
        super('Condition');
        this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
        this.addOutput('true', new ClassicPreset.Output(execSocket, 'True'));
        this.addOutput('false', new ClassicPreset.Output(execSocket, 'False'));
        this.data.text = initial || ''; // dataに初期値を設定
    }
}