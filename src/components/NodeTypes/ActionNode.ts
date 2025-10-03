import { ClassicPreset } from 'rete';
import { execSocket } from './sockets';
import { CustomContentControl } from './controls';

export class ActionNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket },
  { content: CustomContentControl }
> {
  width = 220;
  height = 280;

  constructor(initialData?: {
    title: string;
    text: string;
    imageUrl: string;
  }) {
    super('Action');
    this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    this.addOutput('exec', new ClassicPreset.Output(execSocket, 'Exec'));
    this.addControl(
      'content',
      new CustomContentControl(
        initialData || {
          title: 'Action Node',
          text: 'This is the default action text.',
          imageUrl: 'https://placehold.co/200x150',
        }
      )
    );
  }
}