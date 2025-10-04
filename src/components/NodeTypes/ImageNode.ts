import { ClassicPreset } from 'rete';
import { ImageControl } from './ImageControl';
import { imageSocket } from './sockets';

export class ImageNode extends ClassicPreset.Node<
  {},
  { image: ClassicPreset.Socket },  { image?: ImageControl }
> {
  width = 220;
  height = 280;
  data: { title: string; text: string; imageUrl: string } = {
    title: 'Image Node',
    text: 'This is the default image text.',
    imageUrl: 'https://placehold.co/200x150'
  };

  constructor(initialData?: Partial<ImageNode['data']>) {
    super('Image');
    this.addOutput('image', new ClassicPreset.Output(imageSocket, 'Image'));
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
  }
}