import { ClassicPreset } from 'rete';
import { ImageControl } from './ImageControl';
import { execSocket, timeSocket, numberSocket } from './sockets';

export class TimerNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket; delay?: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket; time: ClassicPreset.Socket },  { image?: ImageControl }
> {
  width = 220;
  height = 280;
  data: { 
    title: string;
    text: string;
    imageUrl: string;
    url?: string;
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
    
    // 画像Controlを追加（url と imageUrl の両方をチェック）
    const imageUrl = (this.data as any).url || this.data.imageUrl;
    this.addControl('image', new ImageControl(imageUrl, this.data.text));
  }
  
  // データ更新時にControlも更新
  updateData(newData: Partial<TimerNode['data']>) {
    this.data = { ...this.data, ...newData };
    
    // Controlを削除して再作成
    if (this.controls.image) {
      this.removeControl('image');
    }
    
    const imageUrl = (this.data as any).url || this.data.imageUrl;
    this.addControl('image', new ImageControl(imageUrl, this.data.text));
  }
}
