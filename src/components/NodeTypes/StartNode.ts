import { ClassicPreset } from 'rete';
import { execSocket } from './sockets';
import { ImageControl } from './ImageControl';

export class StartNode extends ClassicPreset.Node<
    {},
    { exec: ClassicPreset.Socket },
    { image?: ImageControl }
> {
    width = 180;
    height = 180;
    data: { title?: string; imageUrl?: string; url?: string } = { 
        title: 'Start',
        imageUrl: 'https://placehold.co/150x100/4ade80/ffffff?text=Start'
    };
    
    constructor(initialData?: Partial<StartNode['data']>) {
        super('Start');
        this.addOutput('exec', new ClassicPreset.Output(execSocket, 'Exec'));
        
        if (initialData) {
            this.data = { ...this.data, ...initialData };
        }
        
        // 画像Controlを追加
        const imageUrl = (this.data as any).url || this.data.imageUrl;
        this.addControl('image', new ImageControl(imageUrl || '', ''));
    }
    
    // データ更新時にControlも更新
    updateData(newData: Partial<StartNode['data']>) {
        this.data = { ...this.data, ...newData };
        
        if (this.controls.image) {
            this.removeControl('image');
        }
        
        const imageUrl = (this.data as any).url || this.data.imageUrl;
        this.addControl('image', new ImageControl(imageUrl || '', ''));
    }
}
