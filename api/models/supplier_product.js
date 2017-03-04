//mangoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//create customer schema
var supplierProduct_schema = new mongoose.Schema({
    reference: String,
    name : String,
    description: String,
    buying_price_excl_tax : Number,
    selling_price_incl_tax: Number,
    tax: Number,
    supplier: {type: Schema.Types.ObjectId, ref: 'Customer'}
});

//create the model
var SupplierProduct = mongoose.model('SupplierProduct',supplierProduct_schema);

//export customer model
module.exports = SupplierProduct;