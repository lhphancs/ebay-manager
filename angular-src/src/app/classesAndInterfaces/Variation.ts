export class Variation {
    ebayQuantityLeft: number;
    ebaySalePrice: number;
    ASIN: string;
    packAmt: number;
    shipMethodId: string;
    weight: number;
    preparation: string;

    constructor(ebayQuantityLeft, ebaySalePrice, ASIN, packAmt, shipMethodId, weight, preparation){
        this.ebayQuantityLeft = ebayQuantityLeft;
        this.ebaySalePrice = ebaySalePrice;
        this.ASIN = ASIN;
        this.packAmt = packAmt;
        this.shipMethodId = shipMethodId;
        this.weight = weight;
        this.preparation = preparation;
    }
}