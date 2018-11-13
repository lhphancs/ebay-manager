import { Variation } from './Variation';

export class Listing {
    imgUrl: string;
    listTitle: string;
    UPC: string;
    costPerSingle: number;
    quantityPerBox: number;
    wholesaleComp: string;
    stockNo: string;
    shelfLocation: string;
    variations: Variation[];

    constructor(imgUrl, listTitle, UPC){
        this.imgUrl = imgUrl;
        this.listTitle = listTitle;
        this.UPC = UPC;
    }
}