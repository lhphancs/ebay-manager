const FIRST_CLASS_LOW_WEIGHT_PRICE = 3.09;
const FIRST_CLASS_16_OZ_PRICE = 5.53;

const DEFAULT_USPS_FIRST_CLASS_OZ_PRICE = [
    {oz: 1, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 2, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 3, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 4, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 5, price:3.63},   {oz: 6, price:3.63},   {oz: 7, price:3.63},   {oz: 8, price:3.63},
    {oz: 9, price:4.33},   {oz: 10, price:4.33},  {oz: 11, price:4.33},  {oz: 12, price:4.33},
    {oz: 13, price:5.53},  {oz: 14, price:5.53},  {oz: 15, price:5.53},  {oz: 16, price:FIRST_CLASS_16_OZ_PRICE}
]

const noBulgeString = "Package cannot be bulging when shipped."
const lengthAndGirthDescriptionString = `Length = The longest side of the parcel.
Girth = Measurement around the thickest part.`
const firstClassComparisonWithPriorityString = `Price comparison with 'priority mail':
'Priority mail' cost depends on location. If package exceeds certain size criteria, there is added cost. If it is shipping to worst location and there are no added costs due to size of package, the following comparisons can be made:
2x 16oz 'First class' packages are cheaper than the max cost of '2Lb priority mail'.
3x 16oz 'First class' packages are cheaper than the max cost of '3Lb priority mail'.

However, priority may be cheaper if it is a good location.
`

function getPriorityShippingObj(weightLb, maxCost){
    return { shipMethodName:`${weightLb}Lb Priority mail with size/volume restrictions`
        , imgUrl: '../../../assets/imgs/others/own_all_and_priority_box.jpg'
        , description: `Package: Your own envelope/box or any "Priority Mail" box.
        
        Info: Cost varies by location. A flat rate is assumed by choosing the MAX shipping cost. It also assumes destination is USA only. "Added cost" is applied if package exceeds size conditions. To avoid "added cost", meet the conditions listed below.
        It may be cheaper to create ${weightLb} 'First class packages' instead. This is used for packages that are large and cannot fit in the flat rate envelope/box.
        
        Weight: Below or exactly ${weightLb}Lb, and above ${weightLb-1}Lb
        Size: Length + girth < 84 inches
        Volume: Less than or equal to 1ft*1ft*1ft (1 cubic ft)
        ${lengthAndGirthDescriptionString}
        `
        , isFlatRate: true
        , flatRatePrice: maxCost, ozPrice: null
    }
}

function getMultipleFirstClass(multiple){
    let obj = { shipMethodName:`${multiple}x 'First Class'`
        , imgUrl: '../../../assets/imgs/others/own_all.jpg'
        , description: `Package: Your own envelope/box. Can't use USPS priority box.
        Info: This is for ${multiple} packages that are both 16oz or less. This is intended for packages that are 3Lb, which cannot fit in flat rate padded envelope.

        Weight: Both packages must be 16oz or less.

        Size: Maximum combined length and girth is 108 inches.

        ${lengthAndGirthDescriptionString}

        ${firstClassComparisonWithPriorityString}`
        , isFlatRate: false
        , flatRatePrice: null, ozPrice: JSON.parse(JSON.stringify(DEFAULT_USPS_FIRST_CLASS_OZ_PRICE))};

    for(let i in obj.ozPrice){
        let newPrice = multiple*obj.ozPrice[i].price;
        let roundedUpPrice = Math.round(newPrice * 100) / 100;
        obj.ozPrice[i].price = roundedUpPrice;
    }
        
    return obj;
}

const DEFAULT_USPS_SHIP_METHOD_LIST = [
    { shipMethodName:"First class"
        , imgUrl: '../../../assets/imgs/others/own_all.jpg'
        , description: `Package: Your own envelope/box.
        Info: Can't use USPS priority box.

        Weight: 16oz or less.

        Size: Maximum combined length and girth is 108 inches.

        ${lengthAndGirthDescriptionString}

        ${firstClassComparisonWithPriorityString}
        `
        , isFlatRate: false
        , flatRatePrice: null, ozPrice: DEFAULT_USPS_FIRST_CLASS_OZ_PRICE},


    { shipMethodName:"Flat rate envelope"
        , imgUrl: '../../../assets/imgs/USPS/flat_envelope.jpg'
        , description: `Package: "Flat rate envelope."

        Info: Not the same as "legal flat rate envelope" or "padded envelope".`
        , isFlatRate: true
        , flatRatePrice: 6.95, ozPrice: null },


    { shipMethodName:"Flat rate legal envelope"
        , imgUrl: '../../../assets/imgs/USPS/flat_envelope_legal.jpg'
        , description: `Package: "Flat rate envelope" with "legal flat rate enevelope" written in small prints.
        
        Info: Does not come with padding. Not the same as "flat rate envelope" or "padded envelope".`
        , isFlatRate: true
        , flatRatePrice: 7.25, ozPrice: null },


    { shipMethodName:"Flat rate padded envelope"
        , imgUrl: '../../../assets/imgs/USPS/flat_envelope_padded.jpg'
        , description: `Package: "Flat rate envelope" with bubble padding applied inside.
        
        Info: Not the same as "flat rate envelope" or "legal flat rate envelope".`
        , isFlatRate: true
        , flatRatePrice: 7.55, ozPrice: null },


    { shipMethodName:"Flat rate small box"
        , imgUrl: '../../../assets/imgs/USPS/flat_box_small.jpg'
        , description: `Package: "Small flat rate box".
        
        Info: ${noBulgeString}`
        , isFlatRate: true
        , flatRatePrice: 7.50, ozPrice: null },


    { shipMethodName:"Flat rate medium box"
        , imgUrl: '../../../assets/imgs/USPS/flat_box_medium_all.jpg'
        , description: `Package: "Medium flat rate box".
        
        Info: ${noBulgeString}`
        , isFlatRate: true
        , flatRatePrice: 12.80, ozPrice: null },


    { shipMethodName:"Flat rate large box"
        , imgUrl: '../../../assets/imgs/USPS/flat_box_large_all.jpg'
        , description: `Package: "Large flat rate box".
        
        Info: ${noBulgeString}`
        , isFlatRate: true
        , flatRatePrice: 17.60, ozPrice: null },

        getPriorityShippingObj(2, 10.86),
        getPriorityShippingObj(3, 15.28),
        getMultipleFirstClass(2),
        getMultipleFirstClass(3)
];

module.exports.getDefaultShipMethods = function getDefaultShipMethods(userId){
    let shipMethods = [];
    for(let obj of DEFAULT_USPS_SHIP_METHOD_LIST){
        let method = {userId: userId, shipCompanyName: "USPS", shipMethodName: obj.shipMethodName
        , imgUrl: obj.imgUrl, description: obj.description
        , isFlatRate: obj.isFlatRate
        , flatRatePrice: obj.flatRatePrice, ozPrice: obj.ozPrice}

        shipMethods.push(method);
    }
    return shipMethods;
}