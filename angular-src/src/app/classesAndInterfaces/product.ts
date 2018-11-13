import { PackInfo } from './PackInfo';

export class Product {
    name: string;
    UPC: string;
    costPerBox: number;
    quantityPerBox: number;
    wholesaleComp: string;
    stockNo: string;
    shelfLocation:string;
    packsInfo: PackInfo[];

    constructor(name, UPC, costPerBox, quantityPerBox, wholesaleComp, stockNo
        , shelfLocation, packsInfo){
        this.name = name;
        this.UPC = UPC;
        this.costPerBox = costPerBox;
        this.quantityPerBox = quantityPerBox;
        this.wholesaleComp = wholesaleComp;
        this.stockNo = stockNo;
        this.shelfLocation = shelfLocation;
        this.packsInfo = packsInfo;
    }
}