import { PackInfo } from './PackInfo';

export class Product {
    brand: string;
    name: string;
    UPC: string;
    costPerBox: number;
    quantityPerBox: number;
    purchasedLocation: string;
    stockNo: string;
    packsInfo: PackInfo[];

    constructor(brand, name, UPC, costPerBox, quantityPerBox, purchasedLocation, stockNo, packsInfo){
        this.brand = brand;
        this.name = name;
        this.UPC = UPC;
        this.costPerBox = costPerBox;
        this.quantityPerBox = quantityPerBox;
        this.purchasedLocation = purchasedLocation;
        this.stockNo = stockNo;
        this.packsInfo = packsInfo;
    }
}