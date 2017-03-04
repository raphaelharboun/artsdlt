var Customer = require('../models/customer.js');

function get_customers(req,res){
    Customer.find().lean().exec(function(err,customers){
        if (err) throw err;
        res.json(customers);
    });
}

function get_customer(req,res){
    var promise = Customer.findById(req.swagger.params.id.value);
    promise.then(function(customer){
        res.json(customer);
    });
}

function create_customer(req,res) {
    Customer.create(req.swagger.params.customer.value, function(err, customer){
        if (err) throw err;
        res.json(customer.toJSON());
    });
}

function update_customer(req,res){
    var promise = Customer.findByIdAndUpdate(
        req.swagger.params.id.value,
        req.swagger.params.customer.value,
        {new: true}
    ).exec();
    promise.then(function(customer){
        res.json(customer.toJSON());
    })
}

module.exports = {get_customers,get_customer,create_customer,update_customer};