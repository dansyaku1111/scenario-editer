import { ClassicPreset } from 'rete';
import { execSocket } from './sockets';

export class ConditionNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket },
  { true: ClassicPreset.Socket; false: ClassicPreset.Socket },
  {}
> {
  width = 220;
  height = 280;
  data: { title: string; text: string; imageUrl: string } = {
    title: 'Condition Node',
    text: 'This is the default condition text.',
    imageUrl: 'https://placehold.co/200x150'
  };

  constructor(initialData?: Partial<ConditionNode['data']>) {
    super('Condition');
    this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    this.addOutput('true', new ClassicPreset.Output(execSocket, 'True'));
    this.addOutput('false', new ClassicPreset.Output(execSocket, 'False'));
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
  }
}