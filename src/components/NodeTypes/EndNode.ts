import { ClassicPreset } from 'rete';
import { execSocket } from './sockets';
import { ImageControl } from './ImageControl';

export class EndNode extends ClassicPreset.Node<
    { exec: ClassicPreset.Socket },
    {},
    { image?: ImageControl }
> {
    width = 180;
    height = 180;
    data: { title?: string; imageUrl?: string; url?: string } = { 
        title: 'End',
        imageUrl: 'https://placehold.co/150x100/ef4444/ffffff?text=End'
    };
    
    constructor(initialData?: Partial<EndNode['data']>) {
        super('End');
        this.addInput('exec', new ClassicPreset.Input(execSocket, 'Exec'));
        
        if (initialData) {
            this.data = { ...this.data, ...initialData };
        }
        
        // 画像Controlを追加
        const imageUrl = (this.data as any).url || this.data.imageUrl;
        this.addControl('image', new ImageControl(imageUrl || '', ''));
    }
    
    // データ更新時にControlも更新
    updateData(newData: Partial<EndNode['data']>) {
        this.data = { ...this.data, ...newData };
        
        if (this.controls.image) {
            this.removeControl('image');
        }
        
        const imageUrl = (this.data as any).url || this.data.imageUrl;
        this.addControl('image', new ImageControl(imageUrl || '', ''));
    }
}
