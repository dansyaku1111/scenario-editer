import { ClassicPreset } from 'rete';
import { anySocket } from './sockets';

export class EndNode extends ClassicPreset.Node {
    constructor() {
        super('End');
        this.addInput('input', new ClassicPreset.Input(anySocket, 'Previous'));
    }
}
