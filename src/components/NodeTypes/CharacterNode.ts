import { ClassicPreset } from 'rete';
import { execSocket, entitySocket, metaSocket } from './sockets';
import { ImageControl } from './ImageControl';

export class CharacterNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket; entity: ClassicPreset.Socket; meta: ClassicPreset.Socket },
  { image?: ImageControl }
> {
  width = 240;
  height = 320;
  data: { 
    title: string;
    text: string;
    imageUrl: string;
    characterName?: string;
    role?: string;
    attributes?: Record<string, any>;
    relationships?: Array<{ targetId: string; type: string; description?: string }>;
  } = {
    title: 'Character',
    text: 'Character description',
    imageUrl: 'https://placehold.co/200x150',
    characterName: 'New Character',
    role: 'Protagonist',
    attributes: {},
    relationships: []
  };

  constructor(initialData?: Partial<CharacterNode['data']>) {
    super('Character');
    this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    this.addOutput('exec', new ClassicPreset.Output(execSocket, 'Exec'));
    this.addOutput('entity', new ClassicPreset.Output(entitySocket, 'Character'));
    this.addOutput('meta', new ClassicPreset.Output(metaSocket, 'Data'));
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
    
    // 画像Controlを追加（url と imageUrl の両方をチェック）
    const imageUrl = (this.data as any).url || this.data.imageUrl;
    const displayText = `${this.data.role ? 'Role: ' + this.data.role + '\n' : ''}${this.data.text}`;
    this.addControl('image', new ImageControl(imageUrl, displayText));
  }
  
  updateData(newData: Partial<CharacterNode['data']>) {
    this.data = { ...this.data, ...newData };
    
    // Controlを削除して再作成
    if (this.controls.image) {
      this.removeControl('image');
    }
    
    const imageUrl = (this.data as any).url || this.data.imageUrl;
    const displayText = `${this.data.role ? 'Role: ' + this.data.role + '\n' : ''}${this.data.text}`;
    this.addControl('image', new ImageControl(imageUrl, displayText));
  }
}
