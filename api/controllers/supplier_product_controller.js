var Product = require('../models/supplier_product');

module.exports = {create_product,get_products,get_product};

function create_product(req,res){
    Product.create(req.swagger.params.product.value,function(err,product){
        if (err) throw err;
        res.json(product.toJSON());
    });
}

function get_products(req,res){
    var promise = Product.find().lean();
    promise.then(function(products){
        res.json(products);
    });
}

function get_product(req,res){
    var promise = Product.findById(req.swagger.params.id.value);
    promise.then(function(product){
        res.json(product.toJSON());
    });
}