import { EntryASIN } from './entryASIN';

export class Product {
    brand: string;
    name: string;
    UPC: string;
    costPerBox: number;
    quantityPerBox: number;
    purchasedLocation: string;
    stockNo: string;
    oz: number;
    ASINS: EntryASIN[];

    constructor(brand, name, UPC, costPerBox, quantityPerBox, purchasedLocation, stockNo, oz, ASINS){
        this.brand = brand;
        this.name = name;
        this.UPC = UPC;
        this.costPerBox = costPerBox;
        this.quantityPerBox = quantityPerBox;
        this.purchasedLocation = purchasedLocation;
        this.stockNo = stockNo;
        this.oz = oz;
        this.ASINS = ASINS;
    }
}