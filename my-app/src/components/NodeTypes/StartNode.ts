import { ClassicPreset } from 'rete';
import { anySocket } from './sockets';

export class StartNode extends ClassicPreset.Node {
    constructor() {
        super('Start');
        this.addOutput('output', new ClassicPreset.Output(anySocket, 'Next'));
    }
}
