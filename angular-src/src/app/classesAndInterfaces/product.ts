import { EntryASIN } from './entryASIN';

export class Product {
    brand: String;
    name: String;
    costPerBox: Number;
    quantityPerBox: Number;
    purchasedLocation: String;
    stockNo: String;
    UPC: String;
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