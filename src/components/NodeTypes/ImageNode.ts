import { ClassicPreset } from 'rete';
import { ImageControl } from './ImageControl';
import { imageSocket } from './sockets';

export class ImageNode extends ClassicPreset.Node<
  {},
  { image: ClassicPreset.Socket },  { image?: ImageControl }
> {
  width = 220;
  height = 280;
  data: { title: string; text: string; imageUrl: string; url?: string; labelName?: string } = {
    title: 'Image Node',
    text: 'This is the default image text.',
    imageUrl: 'https://placehold.co/200x150',
    labelName: 'Image'
  };

  constructor(initialData?: Partial<ImageNode['data']>) {
    super('Image');
    this.addOutput('image', new ClassicPreset.Output(imageSocket, 'Image'));
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
    
    // 画像Controlを追加（url と imageUrl の両方をチェック）
    const imageUrl = (this.data as any).url || this.data.imageUrl;
    this.addControl('image', new ImageControl(imageUrl, this.data.text));
  }
  
  // データ更新時にControlも更新
  updateData(newData: Partial<ImageNode['data']>) {
    this.data = { ...this.data, ...newData };
    
    // Controlを削除して再作成
    if (this.controls.image) {
      this.removeControl('image');
    }
    
    const imageUrl = (this.data as any).url || this.data.imageUrl;
    this.addControl('image', new ImageControl(imageUrl, this.data.text));
  }
}