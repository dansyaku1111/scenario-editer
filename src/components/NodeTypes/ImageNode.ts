import { ClassicPreset } from 'rete';

export class ImageNode extends ClassicPreset.Node<
  {},
  {},
  {}
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
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
  }
}