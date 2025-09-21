import { ClassicPreset } from 'rete';
import { execSocket } from './sockets';

export class StartNode extends ClassicPreset.Node<
    {},
    { exec: ClassicPreset.Socket },
    {}
> {
    width = 180;
    height = 80;
    constructor() {
        super('Start');
        this.addOutput('exec', new ClassicPreset.Output(execSocket, 'Exec'));
    }
}
