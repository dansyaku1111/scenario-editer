import { ClassicPreset } from 'rete';
import { anySocket } from './sockets';

export class ActionNode extends ClassicPreset.Node {
    constructor(label: string) {
        super(label);
        this.addInput('input', new ClassicPreset.Input(anySocket, 'Previous'));
        this.addOutput('output', new ClassicPreset.Output(anySocket, 'Next'));
        this.addControl('label', new ClassicPreset.InputControl('text', { initial: label }));
    }
}
