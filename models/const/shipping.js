const FIRST_CLASS_LOW_WEIGHT_PRICE = 2.66;

const DEFAULT_USPS_FIRST_CLASS_OZ_PRICE = [
    {oz: 1, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 2, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 3, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 4, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 5, price:2.79},   {oz: 6, price:2.92},   {oz: 7, price:3.05},   {oz: 8, price:3.18},
    {oz: 9, price:3.34},   {oz: 10, price:3.50},  {oz: 11, price:3.66},  {oz: 12, price:3.82},
    {oz: 13, price:4.10},  {oz: 14, price:4.38},  {oz: 15, price:4.66},  {oz: 16, price:4.94}
]

const noBulgeString = "Package cannot be bulging when shipped."
const DEFAULT_USPS_SHIP_METHOD_LIST = [
    { shipMethodName:"First class"
        , description: 'Ship with own envelope/box. Must be 16oz or less. Maximum combined length and girth is 108 inches.'
        , ozPrice: DEFAULT_USPS_FIRST_CLASS_OZ_PRICE},
    { shipMethodName:"Flat rate envelope"
        , description: 'Labled "Flat rate envelope". Not the same as "legal flat rate envelope" or "padded envelope".'
        , ozPrice:[ {oz: -1, price: 6.35}] },
    { shipMethodName:"Flat rate legal envelope"
        , description: 'Labled "Flat rate envelope" with "legal flat rate enevelope" written in small prints. Does not come with padding. Not the same as "flat rate envelope" or "padded envelope".'
        , ozPrice:[ {oz: -1, price: 6.65}] },
    { shipMethodName:"Flat rate padded envelope"
        , description: 'Labeled "Flat rate envelope" and envelope comes with bubble padding inside. Not the same as "flat rate envelope" or "legal flat rate envelope".'
        , ozPrice:[ {oz: -1, price: 6.90}] },
    { shipMethodName:"Flat rate small box"
        , description: 'Labeled "Small flat rate box". ' + noBulgeString
        , ozPrice:[ {oz: -1, price: 6.85}] },
    { shipMethodName:"Flat rate medium box"
        , description: 'Labled "Medium flat rate box". ' + noBulgeString
        , ozPrice:[ {oz: -1, price: 12.45}] },
    { shipMethodName:"Flat rate large box"
        , description: 'Labled "Large flat rate box". ' + noBulgeString
        , ozPrice:[ {oz: -1, price: 17.10}] }
];

const DEFAULT_FEDEX_SHIP_METHOD_LIST = [
    { shipMethodName:"tempFlatRateMethod"
        , description: "tempDescription"
        , ozPrice:[ {oz: -1, price: 999.99}] }
];

module.exports.getDefaultShipMethods = function getDefaultShipMethods(userId){
    let shipMethods = [];
    for(let obj of DEFAULT_USPS_SHIP_METHOD_LIST){
        shipMethods.push(
            { userId: userId, shipCompanyName: "USPS", shipMethodName: obj.shipMethodName
            , description: obj.description, ozPrice: obj.ozPrice }
        );
    }
    for(let obj of DEFAULT_FEDEX_SHIP_METHOD_LIST){
        shipMethods.push(
            { userId: userId, shipCompanyName: "FEDEX", shipMethodName: obj.shipMethodName
            , description: obj.description, ozPrice: obj.ozPrice }
        );
    }
    return shipMethods;
}