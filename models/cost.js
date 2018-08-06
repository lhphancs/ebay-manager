const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Schema = mongoose.Schema;

const FIRST_CLASS_LOW_WEIGHT_COST = 2.66;
const defaultFixedShippingInfo = [
    {
        service:"USPS first class",
        ozPrice:[
            {oz: 1, price:FIRST_CLASS_LOW_WEIGHT_COST}, {oz: 2, price:FIRST_CLASS_LOW_WEIGHT_COST},
            {oz: 3, price:FIRST_CLASS_LOW_WEIGHT_COST}, {oz: 4, price:FIRST_CLASS_LOW_WEIGHT_COST},
            {oz: 5, price:2.79},   {oz: 6, price:2.92},   {oz: 7, price:3.05},   {oz: 8, price:3.18},
            {oz: 9, price:3.34},   {oz: 10, price:3.50},  {oz: 11, price:3.66},  {oz: 12, price:3.82},
            {oz: 13, price:4.10},  {oz: 14, price:4.38},  {oz: 15, price:4.66},  {oz: 16, price:4.94},
        ]
    },
    {
        service:"USPS flat rate normal envelope",
        ozPrice:[
            {oz: -1, price: 6.35}
        ]
    },
    {
        service:"USPS flat rate legal envelope",
        ozPrice:[
            {oz: -1, price:6.65}
        ]
    },
    {
        service:"USPS flat rate padded envelope",
        ozPrice:[
            {oz: -1, price:6.90}
        ]
    },
    {
        service:"USPS flat rate small box",
        ozPrice:[
            {oz: -1, price:6.85}
        ]
    },
    {
        service:"USPS flat rate medium box",
        ozPrice:[
            {oz: -1, price:12.45}
        ]
    },
    {
        service:"USPS flat rate large box",
        ozPrice:[
            {oz: -1, price:17.10}
        ]
    }
];

const costSchema = Schema({
    userId: {type: ObjectId, required: true},
    fixedShippingInfo: {
        type:
        [{ service: { type: String, required: true },
            ozPrice: {type:
                [{
                    oz: { type: Number, min: -1, },
                    price: { type: Number, required: true, min: 0} }
                ]}
        }],
        default:defaultFixedShippingInfo
    }
});
costSchema.index({ userId: 1, "fixedShippingInfo.service": 1 }, { unique: true })

const Cost = module.exports = mongoose.model('Cost', costSchema);

module.exports.addNewCost = function(userId, callback){
    newCost = new Cost(userId);
    newCost.save(callback);
};
