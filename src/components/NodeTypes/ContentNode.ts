import { ClassicPreset } from 'rete';
import { execSocket } from './sockets';

export class ContentNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket },
  {}
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
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
  }
}
