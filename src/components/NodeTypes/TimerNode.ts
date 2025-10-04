import { ClassicPreset } from 'rete';
import { ImageControl } from './ImageControl';
import { execSocket, timeSocket, numberSocket } from './sockets';

export class TimerNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket; delay?: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket; time: ClassicPreset.Socket },  { image?: ImageControl }
> {
  width = 220;
  height = 250;
  data: { 
    title: string;
    text: string;
    imageUrl: string;
    timerType?: 'delay' | 'schedule' | 'deadline';
    delaySeconds?: number;
    scheduledTime?: string;
    repeat?: boolean;
    repeatInterval?: number;
  } = {
    title: 'Timer',
    text: 'Timer configuration',
    imageUrl: 'https://placehold.co/200x150',
    timerType: 'delay',
    delaySeconds: 5,
    scheduledTime: '',
    repeat: false,
    repeatInterval: 0
  };

  constructor(initialData?: Partial<TimerNode['data']>) {
    super('Timer');
    this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    this.addInput('delay', new ClassicPreset.Input(numberSocket, 'Delay (s)'));
    this.addOutput('exec', new ClassicPreset.Output(execSocket, 'Exec'));
    this.addOutput('time', new ClassicPreset.Output(timeSocket, 'Time'));
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
  }
}
