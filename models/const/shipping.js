const FIRST_CLASS_LOW_WEIGHT_PRICE = 2.66;

const DEFAULT_USPS_FIRST_CLASS_OZ_PRICE = [
    {oz: 1, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 2, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 3, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 4, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 5, price:2.79},   {oz: 6, price:2.92},   {oz: 7, price:3.05},   {oz: 8, price:3.18},
    {oz: 9, price:3.34},   {oz: 10, price:3.50},  {oz: 11, price:3.66},  {oz: 12, price:3.82},
    {oz: 13, price:4.10},  {oz: 14, price:4.38},  {oz: 15, price:4.66},  {oz: 16, price:4.94}
]

const DEFAULT_USPS_SHIP_METHOD_LIST = [
    { name:"First class",                 ozPrice: DEFAULT_USPS_FIRST_CLASS_OZ_PRICE},
    { name:"Flat rate normal envelope",   ozPrice:[ {oz: -1, price: 6.35}] },
    { name:"Flat rate legal envelope",    ozPrice:[ {oz: -1, price: 6.65}] },
    { name:"Flat rate padded envelope",   ozPrice:[ {oz: -1, price: 6.90}] },
    { name:"Flat rate small box",         ozPrice:[ {oz: -1, price: 6.85}] },
    { name:"Flat rate medium box",        ozPrice:[ {oz: -1, price: 12.45}] },
    { name:"Flat rate large box",         ozPrice:[ {oz: -1, price: 17.10}] }
];

const DEFAULT_FEDEX_SHIP_METHOD_LIST = [
    { name:"SOME FLAT RATE METHOD",       ozPrice:[ {oz: -1, price: 17.10}] }
];

const DEFAULT_COMPANIES = [
    { name: "USPS", shipMethods: DEFAULT_USPS_SHIP_METHOD_LIST},
    { name: "FEDEX", shipMethods: DEFAULT_FEDEX_SHIP_METHOD_LIST}
];

module.exports = DEFAULT_COMPANIES;