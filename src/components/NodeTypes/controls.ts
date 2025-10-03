import { ClassicPreset } from 'rete';

export class CustomContentControl extends ClassicPreset.Control {
  constructor(
    public data: {
      title: string;
      text: string;
      imageUrl: string;
    }
  ) {
    super();
  }
}