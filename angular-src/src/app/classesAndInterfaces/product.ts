import { PackInfo } from './PackInfo';

export class Product {
    name: string;
    UPC: string;
    costPerBox: number;
    quantityPerBox: number;
    wholesaleComp: string;
    stockNo: string;
    packsInfo: PackInfo[];

    constructor(name, UPC, costPerBox, quantityPerBox, wholesaleComp, stockNo, packsInfo){
        this.name = name;
        this.UPC = UPC;
        this.costPerBox = costPerBox;
        this.quantityPerBox = quantityPerBox;
        this.wholesaleComp = wholesaleComp;
        this.stockNo = stockNo;
        this.packsInfo = packsInfo;
    }
}