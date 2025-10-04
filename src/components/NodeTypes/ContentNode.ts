import { ClassicPreset } from 'rete';
import { ImageControl } from './ImageControl';
import { execSocket, contentSocket } from './sockets';

export class ContentNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket; content: ClassicPreset.Socket },  { image?: ImageControl }
> {
  width = 220;
  height = 280;
  data: { title: string; text: string; imageUrl: string } = {
    title: 'Node Title',
    text: 'This is the default text content for the node.',
    imageUrl: 'https://placehold.co/200x150'
  };

  constructor(initialData?: Partial<ContentNode['data']>) {
    super('Content');
    this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    this.addOutput('exec', new ClassicPreset.Output(execSocket, 'Exec'));
    this.addOutput('content', new ClassicPreset.Output(contentSocket, 'Content'));
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
  }
}
