import { ClassicPreset } from 'rete';

const initialImageUrl = 'https://placehold.co/150';

export class ImageNode extends ClassicPreset.Node<
    {},
    {},
    {} // Controlを削除
> {
    width = 180;
    height = 80; // 高さを調整
    data: { url: string } = { url: '' }; // dataプロパティを定義

    constructor(initial?: string) {
        super('Image');
        this.data.url = initial || initialImageUrl; // dataに初期値を設定
    }
}