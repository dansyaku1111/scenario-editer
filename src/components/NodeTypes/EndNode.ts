import { ClassicPreset } from 'rete';
import { execSocket } from './sockets';

export class EndNode extends ClassicPreset.Node<{ exec: ClassicPreset.Socket }, {}, {}> {
    width = 180;
    height = 80;
    constructor() {
        super('End');
        this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    }
}
