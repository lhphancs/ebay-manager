const FIRST_CLASS_LOW_WEIGHT_PRICE = 2.66;

const DEFAULT_USPS_FIRST_CLASS_OZ_PRICE = [
    {oz: 1, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 2, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 3, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 4, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 5, price:2.79},   {oz: 6, price:2.92},   {oz: 7, price:3.05},   {oz: 8, price:3.18},
    {oz: 9, price:3.34},   {oz: 10, price:3.50},  {oz: 11, price:3.66},  {oz: 12, price:3.82},
    {oz: 13, price:4.10},  {oz: 14, price:4.38},  {oz: 15, price:4.66},  {oz: 16, price:4.94}
]

const noBulgeString = "Package cannot be bulging when shipped."
const lengthAndGirthDescriptionString = `Length = The longest side of the parcel.
Girth = Measurement around the thickest part.`

const DEFAULT_USPS_SHIP_METHOD_LIST = [
    { shipMethodName:"First class"
        , imgUrl: '../../../assets/imgs/others/own_all.jpg'
        , description: `Package: Your own envelope/box.
        Info: Can't use USPS priority box.

        Weight: 16oz or less.

        Size: Maximum combined length and girth is 108 inches.
        
        ${lengthAndGirthDescriptionString}
        `
        , flatRatePrice: null, ozPrice: DEFAULT_USPS_FIRST_CLASS_OZ_PRICE},


    { shipMethodName:"Flat rate envelope"
        , imgUrl: '../../../assets/imgs/USPS/flat_envelope.jpg'
        , description: `Package: "Flat rate envelope."

        Info: Not the same as "legal flat rate envelope" or "padded envelope".`
        , flatRatePrice: 6.35, ozPrice: null },


    { shipMethodName:"Flat rate legal envelope"
        , imgUrl: '../../../assets/imgs/USPS/flat_envelope_legal.jpg'
        , description: `Package: "Flat rate envelope" with "legal flat rate enevelope" written in small prints.
        
        Info: Does not come with padding. Not the same as "flat rate envelope" or "padded envelope".`
        , flatRatePrice: 6.65, ozPrice: null },


    { shipMethodName:"Flat rate padded envelope"
        , imgUrl: '../../../assets/imgs/USPS/flat_envelope_padded.jpg'
        , description: `Package: "Flat rate envelope" with bubble padding applied inside.
        
        Info: Not the same as "flat rate envelope" or "legal flat rate envelope".`
        , flatRatePrice: 6.90, ozPrice: null },


    { shipMethodName:"Flat rate small box"
        , imgUrl: '../../../assets/imgs/USPS/flat_box_small.jpg'
        , description: `Package: "Small flat rate box".
        
        Info: ${noBulgeString}`
        , flatRatePrice: 6.85, ozPrice: null },


    { shipMethodName:"Flat rate medium box"
        , imgUrl: '../../../assets/imgs/USPS/flat_box_medium_all.jpg'
        , description: `Package: "Medium flat rate box".
        
        Info: ${noBulgeString}`
        , flatRatePrice: 12.45, ozPrice: null },


    { shipMethodName:"Flat rate large box"
        , imgUrl: '../../../assets/imgs/USPS/flat_box_large_all.jpg'
        , description: `Package: "Large flat rate box".
        
        Info: ${noBulgeString}`
        , flatRatePrice: 17.10, ozPrice: null }
];

const DEFAULT_FEDEX_SHIP_METHOD_LIST = [
    { shipMethodName:"tempFlatRateMethod"
        , description: "tempDescription"
        , flatRatePrice: 999.99, ozPrice: null }
];

module.exports.getDefaultShipMethods = function getDefaultShipMethods(userId){
    let shipMethods = [];
    for(let obj of DEFAULT_USPS_SHIP_METHOD_LIST){
        method = {userId: userId, shipCompanyName: "USPS", shipMethodName: obj.shipMethodName
        , imgUrl: obj.imgUrl, description: obj.description};
        if(obj.flatRatePrice)
            method.flatRatePrice = obj.flatRatePrice;
        else
            method.ozPrice = obj.ozPrice;
        shipMethods.push(method);
    }
    for(let obj of DEFAULT_FEDEX_SHIP_METHOD_LIST){
        method = {userId: userId, shipCompanyName: "FEDEX", shipMethodName: obj.shipMethodName
        , imgUrl: obj.imgUrl, description: obj.description};
        if(obj.flatRatePrice)
            method.flatRatePrice = obj.flatRatePrice;
        else
            method.ozPrice = obj.ozPrice;
        shipMethods.push(method);
    }
    return shipMethods;
}