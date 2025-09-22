import { ClassicPreset } from 'rete';
import { anySocket } from './sockets';

export class ConditionNode extends ClassicPreset.Node {
    constructor(label: string) {
        super(label);
        this.addInput('input', new ClassicPreset.Input(anySocket, 'Previous'));
        this.addOutput('true', new ClassicPreset.Output(anySocket, 'True'));
        this.addOutput('false', new ClassicPreset.Output(anySocket, 'False'));
        this.addControl('label', new ClassicPreset.InputControl('text', { initial: label }));
    }
}
