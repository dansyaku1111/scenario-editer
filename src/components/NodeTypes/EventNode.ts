import { ClassicPreset } from 'rete';
import { ImageControl } from './ImageControl';
import { execSocket, timeSocket, contentSocket, listSocket } from './sockets';

export class EventNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket; participants?: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket; time: ClassicPreset.Socket; content: ClassicPreset.Socket },  { image?: ImageControl }
> {
  width = 240;
  height = 320;
  data: { 
    title: string;
    text: string;
    imageUrl: string;
    url?: string;
    eventName?: string;
    timestamp?: string;
    duration?: number;
    location?: string;
    participants?: string[];
    labelName?: string;
  } = {
    title: 'Event',
    text: 'Event description',
    imageUrl: 'https://placehold.co/200x150',
    eventName: 'New Event',
    timestamp: new Date().toISOString(),
    duration: 0,
    location: '',
    participants: [],
    labelName: 'Event'
  };

  constructor(initialData?: Partial<EventNode['data']>) {
    super('Event');
    this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    this.addInput('participants', new ClassicPreset.Input(listSocket, 'Participants', true)); // Multi-input
    this.addOutput('exec', new ClassicPreset.Output(execSocket, 'Exec'));
    this.addOutput('time', new ClassicPreset.Output(timeSocket, 'Time'));
    this.addOutput('content', new ClassicPreset.Output(contentSocket, 'Description'));
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
    
    // 画像Controlを追加（url と imageUrl の両方をチェック）
    const imageUrl = (this.data as any).url || this.data.imageUrl;
    const displayText = `${this.data.eventName ? this.data.eventName + '\n' : ''}${this.data.text}`;
    this.addControl('image', new ImageControl(imageUrl, displayText));
  }
  
  // データ更新時にControlも更新
  updateData(newData: Partial<EventNode['data']>) {
    this.data = { ...this.data, ...newData };
    
    // Controlを削除して再作成
    if (this.controls.image) {
      this.removeControl('image');
    }
    
    const imageUrl = (this.data as any).url || this.data.imageUrl;
    const displayText = `${this.data.eventName ? this.data.eventName + '\n' : ''}${this.data.text}`;
    this.addControl('image', new ImageControl(imageUrl, displayText));
  }
}
