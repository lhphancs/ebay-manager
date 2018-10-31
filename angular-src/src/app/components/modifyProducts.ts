export function addAsinsToProducts(products){
    for(let product of products){
        let strASINS = "";
        for(let packInfo of product.packsInfo){
            if(packInfo.ASIN != null)
                strASINS += packInfo.ASIN + ' || ';
        }   
        product.ASINS = strASINS;
    }
}