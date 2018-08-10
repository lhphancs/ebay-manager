const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const shippingSchema = Schema({
    userId: {type: ObjectId, required: true},
    company: { type: String, required: true },
    shipMethod: {type: String, required: true},
    ozPrice: {type:[{
        oz: { type: Number, min: -1 },
        price: { type: Number, required: true, min: 0} }]
    }
});

const FIRST_CLASS_LOW_WEIGHT_PRICE = 2.66;

const DEFAULT_USPS_FIRST_CLASS_OZ_PRICE = [
    {oz: 1, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 2, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 3, price:FIRST_CLASS_LOW_WEIGHT_PRICE}, {oz: 4, price:FIRST_CLASS_LOW_WEIGHT_PRICE},
    {oz: 5, price:2.79},   {oz: 6, price:2.92},   {oz: 7, price:3.05},   {oz: 8, price:3.18},
    {oz: 9, price:3.34},   {oz: 10, price:3.50},  {oz: 11, price:3.66},  {oz: 12, price:3.82},
    {oz: 13, price:4.10},  {oz: 14, price:4.38},  {oz: 15, price:4.66},  {oz: 16, price:4.94}
]

const DEFAULT_USPS_SHIP_METHOD_LIST = [
    { method:"First class",                 ozPrice: DEFAULT_USPS_FIRST_CLASS_OZ_PRICE},
    { method:"Flat rate normal envelope",   ozPrice:[ {oz: -1, price: 6.35}] },
    { method:"Flat rate legal envelope",    ozPrice:[ {oz: -1, price: 6.65}] },
    { method:"Flat rate padded envelope",   ozPrice:[ {oz: -1, price: 6.90}] },
    { method:"Flat rate small box",         ozPrice:[ {oz: -1, price: 6.85}] },
    { method:"Flat rate medium box",        ozPrice:[ {oz: -1, price: 12.45}] },
    { method:"Flat rate large box",         ozPrice:[ {oz: -1, price: 17.10}] }
];

const DEFAULT_FEDEX_SHIP_METHOD_LIST = [
    { method:"SOME FLAT RATE METHOD",       ozPrice:[ {oz: -1, price: 17.10}] }
];

const Shipping = module.exports = mongoose.model('Shipping', shippingSchema);

function pushShipEntriesToArray(userId, arr, items, company){
    items.forEach(item =>{
        arr.push({
            userId:userId,
            company: company,
            shipMethod: item.method,
            ozPrice: item.ozPrice
        })
    });
}

module.exports.addDefaultForNewUser = function(userId, callback){
    entriesToBeInserted = [];
    pushShipEntriesToArray(userId, entriesToBeInserted, DEFAULT_USPS_SHIP_METHOD_LIST, "USPS");
    pushShipEntriesToArray(userId, entriesToBeInserted, DEFAULT_FEDEX_SHIP_METHOD_LIST, "FEDEX");

    Shipping.insertMany(entriesToBeInserted, callback);
};

module.exports.getShippingsById = function(userId, callback){
    Shipping.find({userId: userId}, null, { sort:{company:'desc'}
        , select:'-userId -_id -__v'}, (err, shippings) =>{
        let shippingCompanies = {};
        for(let i=0; i<shippings.length; ++i){
            let entry = shippings[i];
            let companyName = entry.company;
            if(shippingCompanies[companyName] == undefined)
                shippingCompanies[companyName] = [];
            shippingCompanies[companyName].push({
                shipMethod:entry.shipMethod,
                ozPrice:entry.ozPrice
            });
        }
        callback(err, shippingCompanies);
    });
};