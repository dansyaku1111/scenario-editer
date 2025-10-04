import { ClassicPreset } from 'rete';
import { ImageControl } from './ImageControl';
import { execSocket, boolSocket, stringSocket } from './sockets';

export class ConditionNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket; condition?: ClassicPreset.Socket },
  { true: ClassicPreset.Socket; false: ClassicPreset.Socket; value: ClassicPreset.Socket },  { image?: ImageControl }
> {
  width = 220;
  height = 280;
  data: { title: string; text: string; imageUrl: string; url?: string; conditionExpression?: string } = {
    title: 'Condition Node',
    text: 'This is the default condition text.',
    imageUrl: 'https://placehold.co/200x150',
    conditionExpression: ''
  };

  constructor(initialData?: Partial<ConditionNode['data']>) {
    super('Condition');
    this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    this.addInput('condition', new ClassicPreset.Input(boolSocket, 'Condition'));
    this.addOutput('true', new ClassicPreset.Output(execSocket, 'True'));
    this.addOutput('false', new ClassicPreset.Output(execSocket, 'False'));
    this.addOutput('value', new ClassicPreset.Output(boolSocket, 'Value'));
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
    
    // 画像Controlを追加（url と imageUrl の両方をチェック）
    const imageUrl = (this.data as any).url || this.data.imageUrl;
    this.addControl('image', new ImageControl(imageUrl, this.data.text));
  }
  
  // データ更新時にControlも更新
  updateData(newData: Partial<ConditionNode['data']>) {
    this.data = { ...this.data, ...newData };
    
    // Controlを削除して再作成
    if (this.controls.image) {
      this.removeControl('image');
    }
    
    const imageUrl = (this.data as any).url || this.data.imageUrl;
    this.addControl('image', new ImageControl(imageUrl, this.data.text));
  }
}