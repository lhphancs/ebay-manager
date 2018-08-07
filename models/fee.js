const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FIRST_CLASS_LOW_WEIGHT_FEE = 2.66;
const defaultEbayFixedShippingInfo = [
    {
        company:"USPS",
        method:"First class",
        ozPrice:[
            {oz: 1, price:FIRST_CLASS_LOW_WEIGHT_FEE}, {oz: 2, price:FIRST_CLASS_LOW_WEIGHT_FEE},
            {oz: 3, price:FIRST_CLASS_LOW_WEIGHT_FEE}, {oz: 4, price:FIRST_CLASS_LOW_WEIGHT_FEE},
            {oz: 5, price:2.79},   {oz: 6, price:2.92},   {oz: 7, price:3.05},   {oz: 8, price:3.18},
            {oz: 9, price:3.34},   {oz: 10, price:3.50},  {oz: 11, price:3.66},  {oz: 12, price:3.82},
            {oz: 13, price:4.10},  {oz: 14, price:4.38},  {oz: 15, price:4.66},  {oz: 16, price:4.94},
        ]
    },
    {
        company:"USPS",
        method:"Flat rate normal envelope",
        ozPrice:[
            {oz: -1, price: 6.35}
        ]
    },
    {
        company:"USPS",
        method:"Flat rate legal envelope",
        ozPrice:[
            {oz: -1, price:6.65}
        ]
    },
    {
        company:"USPS",
        method:"Flat rate padded envelope",
        ozPrice:[
            {oz: -1, price:6.90}
        ]
    },
    {
        company:"USPS",
        method:"Flat rate small box",
        ozPrice:[
            {oz: -1, price:6.85}
        ]
    },
    {
        company:"USPS",
        method:"Flat rate medium box",
        ozPrice:[
            {oz: -1, price:12.45}
        ]
    },
    {
        company:"USPS",
        method:"Flat rate large box",
        ozPrice:[
            {oz: -1, price:17.10}
        ]
    }
];

const feeSchema = Schema({
    userId: {type: ObjectId, required: true},
    ebayFixedShippingInfo: {
        type:
        [{ company: { type: String, required: true },
            method: {type: String, required: true},
            ozPrice: {type:
                [{
                    oz: { type: Number, min: -1 },
                    price: { type: Number, required: true, min: 0} }
                ]}
        }],
        default:defaultEbayFixedShippingInfo
    },
    ebayPercentageFromSaleFee:{type: Number, min:0, default:9.15},
    paypalPercentageFromSaleFee:{ type: Number, min: 0, default: 2.9},
    paypalInitialFee:{ type: Number, min: 0, default: 0.30},
    miscFee:{type:[], default:[]}
});
feeSchema.index({ userId: 1, "fixedShippingInfo.service": 1 }, { unique: true })

const Fee = module.exports = mongoose.model('Fee', feeSchema);

module.exports.addNewFee = function(userId, callback){
    newFee = new Fee({userId: userId});
    newFee.save(callback);
};
