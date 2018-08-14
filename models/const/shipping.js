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
    { name:"First class"
        , description: 'Ship with own envelope/box. Must be 16oz or less. Maximum combined length and girth is 108 inches.'
        , ozPrice: DEFAULT_USPS_FIRST_CLASS_OZ_PRICE},
    { name:"Flat rate envelope"
        , description: '2 sizes, (10in x 7in) or (6in x 10in). Labled "Flat rate envelope". Not the same as "legal flat rate envelope" or "padded envelope".'
        , ozPrice:[ {oz: -1, price: 6.35}] },
    { name:"Flat rate legal envelope"
        , description: '1 size, (9.5in x 15in). Labled "Flat rate envelope" with "legal flat rate enevelope" written in small prints. Does not come with padding. Not the same as "flat rate envelope" or "padded envelope".'
        , ozPrice:[ {oz: -1, price: 6.65}] },
    { name:"Flat rate padded envelope"
        , description: '1 size, (9.5in x 12.5in). Labeled "Flat rate envelope" and envelope comes with bubble padding inside. Not the same as "flat rate envelope" or "legal flat rate envelope".'
        , ozPrice:[ {oz: -1, price: 6.90}] },
    { name:"Flat rate small box"
        , description: '1 size, (5.375in x 8.625in x 1.625in). Labeled "Small flat rate box". ' + noBulgeString + '.'
        , ozPrice:[ {oz: -1, price: 6.85}] },
    { name:"Flat rate medium box"
        , description: '2 sizes, (11in x 8.5in x 5.5in) or (11.875in x 3.375in x 13.625). Labled "Medium flat rate box"' + noBulgeString + '.'
        , ozPrice:[ {oz: -1, price: 12.45}] },
    { name:"Flat rate large box"
        , description: '2 sizes, (12in x 12in x 5.5in) or (23.6875in x 11.75in x 3in). Labled "Large flat rate box"' + noBulgeString + '.'
        , ozPrice:[ {oz: -1, price: 17.10}] }
];

const DEFAULT_FEDEX_SHIP_METHOD_LIST = [
    { name:"SOME FLAT RATE METHOD", ozPrice:[ {oz: -1, price: 17.10}] }
];

const DEFAULT_COMPANIES = [
    { name: "USPS", shipMethods: DEFAULT_USPS_SHIP_METHOD_LIST},
    { name: "FEDEX", shipMethods: DEFAULT_FEDEX_SHIP_METHOD_LIST}
];

module.exports = DEFAULT_COMPANIES;