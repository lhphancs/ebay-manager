import { PackInfo } from './PackInfo';

export class Product {
    brand: string;
    name: string;
    UPC: string;
    costPerBox: number;
    quantityPerBox: number;
    wholesaleComp: string;
    stockNo: string;
    packsInfo: PackInfo[];

    constructor(brand, name, UPC, costPerBox, quantityPerBox, wholesaleComp, stockNo, packsInfo){
        this.brand = brand;
        this.name = name;
        this.UPC = UPC;
        this.costPerBox = costPerBox;
        this.quantityPerBox = quantityPerBox;
        this.wholesaleComp = wholesaleComp;
        this.stockNo = stockNo;
        this.packsInfo = packsInfo;
    }
}