var _ = require('underscore')._;

//mangoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

//create product schema
var product_schema = new mongoose.Schema({
    reference: String,
    name : {type: String, required: true},
    description: String,
    buying_price_excl_tax : Number,
    selling_price_excl_tax: {type: Number, required:true},
    tax: {type: Number, required:true},
    discount: {type: Number, default:0},
    discount_absolute: {type: Boolean, default:true},
    quantity: {type: Number, required: true},
    supplier: {type: Schema.Types.ObjectId, ref: 'Customer'}
});

//create customer schema
var command_schema = new mongoose.Schema({
    type : {type: String, required:true, enum:['estimate','command','invoice','delivery']},
    //estimate(pending,accepted),command(pending,sent),bill(pending,waiting payment,paid partially,paid in full),delivery(pending,in transit,accepted)
    state : {type: String, default:'pending'},
    //transaction_number: {type: Number},
    customer: {type: Schema.Types.ObjectId, ref: 'Customer', required:true},
    deposit: Number,
    date_created: {type:Date,default:Date.now},
    date_updated: {type:Date,default:Date.now},
    products : [product_schema]//implements products
});

/**
 * Instance Methods
 */
command_schema.methods.add_products = function(products){
    var command = this;
    var new_products = _.map(
        products,
        Command.whitelist_product
    );
    _.each(new_products,function(product){
        command.products.push(product);
    });
};

/**
 * Static Methods
 */
command_schema.statics.whitelist_command = function(command){
    return _.pick(command,['type','state','customer',
                'deposit','tax','products']);
};

command_schema.statics.whitelist_product = function(product){
    return _.pick(product,['reference','name','description','buying_price_excl_tax',
                'selling_price_excl_tax','tax','discount','discount_absolute',
                'quantity','supplier']);
};

command_schema.statics.get_next_transaction_number = function(){

};

/**
 * Virtual Attributes
 */

command_schema.virtual('total_excl_tax').get(function(){
    var total_excl_tax = 0
    _.each(this.products, function(product){
        total_excl_tax += product.selling_price_excl_tax * product.quantity;
    });
    return total_excl_tax;
});

command_schema.virtual('total_tax').get(function(){
    var total_tax = 0
    _.each(this.products, function(product){
        total_tax += product.selling_price_excl_tax * product.tax * product.quantity;
    });
    return total_tax
});

command_schema.virtual('total_incl_tax').get(function(){
    var total_incl_tax = 0
    _.each(this.products, function(product){
        total_incl_tax += product.selling_price_excl_tax * product.quantity * (1+product.tax);
    });
    return total_incl_tax;
});

//auto increment transaction transaction_number
command_schema.plugin(autoIncrement.plugin,{model:'Command',field:'transaction_number',startAt:1});

//create the model
var Command = mongoose.model('Command',command_schema);

//export customer model
module.exports = Command;