//mangoose
var mongoose = require('mongoose');


//create customer schema
var customer_schema = new mongoose.Schema({
    name : String,
    email : String,
    address : [{
        address_type : String,
        address_line_1 : String,
        address_line_2 : String,
        city : String,
        zipcode : String,
        country : String
    }],
    contacts : [{
        first_name : String,
        last_name : String,
        occupation : String,
        number : String,
        email: String
    }],
    phone : String,
    fax : String,
    website : String
});

//create the model
var Customer = mongoose.model('Customer',customer_schema);

//export customer model
module.exports = Customer;