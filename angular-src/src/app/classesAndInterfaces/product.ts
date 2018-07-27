import { EntryASIN } from './entryASIN';

export class Product {
    brand: string;
    name: string;
    costPerBox: Number;
    quantityPerBox: Number;
    purchasedLocation: string;
    stockNo: string;
    UPC: string;
    ASINS: EntryASIN[];

    constructor(brand, name, costPerBox, quantityPerBox, purchasedLocation, stockNo, UPC, ASINS){
        this.brand = brand;
        this.name = name;
        this.costPerBox = costPerBox;
        this.quantityPerBox = quantityPerBox;
        this.purchasedLocation = purchasedLocation;
        this.stockNo = stockNo;
        this.UPC = UPC;
        this.ASINS = ASINS;
    }
}