import { ClassicPreset } from 'rete';
import { ImageControl } from './ImageControl';
import { execSocket, stringSocket, metaSocket } from './sockets';

export class ExternalResourceNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket; url: ClassicPreset.Socket; data: ClassicPreset.Socket },  { image?: ImageControl }
> {
  width = 240;
  height = 280;
  data: { 
    title: string;
    text: string;
    imageUrl: string;
    resourceType?: 'url' | 'api' | 'file' | 'database';
    resourceUrl?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
  } = {
    title: 'External Resource',
    text: 'External resource configuration',
    imageUrl: 'https://placehold.co/200x150',
    resourceType: 'url',
    resourceUrl: '',
    method: 'GET',
    headers: {},
    body: null
  };

  constructor(initialData?: Partial<ExternalResourceNode['data']>) {
    super('External Resource');
    this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
    this.addOutput('exec', new ClassicPreset.Output(execSocket, 'Exec'));
    this.addOutput('url', new ClassicPreset.Output(stringSocket, 'URL'));
    this.addOutput('data', new ClassicPreset.Output(metaSocket, 'Response'));
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
  }
}
