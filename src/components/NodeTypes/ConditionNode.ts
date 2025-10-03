import { ClassicPreset } from 'rete';
import { execSocket } from './sockets';
import { CustomContentControl } from './controls';

export class ConditionNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket },
  { true: ClassicPreset.Socket; false: ClassicPreset.Socket },
  { content: CustomContentControl }
> {
  width = 220;
  height = 280;

  constructor(initialData?: {
    title: string;
    text: string;
    imageUrl: string;
  }) {
    super('Condition');
    this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    this.addOutput('true', new ClassicPreset.Output(execSocket, 'True'));
    this.addOutput('false', new ClassicPreset.Output(execSocket, 'False'));
    this.addControl(
      'content',
      new CustomContentControl(
        initialData || {
          title: 'Condition Node',
          text: 'This is the default condition text.',
          imageUrl: 'https://placehold.co/200x150',
        }
      )
    );
  }
}