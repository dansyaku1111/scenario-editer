import { ClassicPreset } from 'rete';
import { anySocket } from './sockets';

export class ImageNode extends ClassicPreset.Node {
    constructor() {
        super('Image');
        this.addInput('input', new ClassicPreset.Input(anySocket, 'Previous'));
        this.addOutput('output', new ClassicPreset.Output(anySocket, 'Next'));
        this.addControl('image', new ClassicPreset.InputControl('text', { initial: 'https://via.placeholder.com/150' }));
    }
}
