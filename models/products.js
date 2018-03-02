const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    product_type: {
        type: String,
        required: true
    }
});