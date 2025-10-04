import { ClassicPreset } from 'rete';
import { execSocket, contentSocket, stringSocket } from './sockets';
import { ImageControl } from './ImageControl';

export class ActionNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket; text?: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket; content: ClassicPreset.Socket },
  { image?: ImageControl }
> {
  width = 220;
  height = 280;
  data: { title: string; text: string; imageUrl: string; url?: string } = {
    title: 'Action Node',
    text: 'This is the default action text.',
    imageUrl: 'https://placehold.co/200x150'
  };

  constructor(initialData?: Partial<ActionNode['data']>) {
    super('Action');
    this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    this.addInput('text', new ClassicPreset.Input(stringSocket, 'Text', true)); // Multi input
    this.addOutput('exec', new ClassicPreset.Output(execSocket, 'Exec'));
    this.addOutput('content', new ClassicPreset.Output(contentSocket, 'Content'));
    
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
    
    // 画像Controlを追加（url と imageUrl の両方をチェック）
    const imageUrl = this.data.url || this.data.imageUrl;
    this.addControl('image', new ImageControl(imageUrl, this.data.text));
  }
  
  // データ更新時にControlも更新
  updateData(newData: Partial<ActionNode['data']>) {
    this.data = { ...this.data, ...newData };
    
    // Controlを削除して再作成（Reactの再レンダリングをトリガー）
    if (this.controls.image) {
      this.removeControl('image');
    }
    
    const imageUrl = this.data.url || this.data.imageUrl;
    this.addControl('image', new ImageControl(imageUrl, this.data.text));
  }
}