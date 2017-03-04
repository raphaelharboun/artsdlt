var Command = require('../models/command.js');
var _ = require('underscore')._;

function get_commands(req,res){
    var promise;
    if (req.swagger.params.type.value){
        promise = Command.find({type: req.swagger.params.type.value}).lean().exec();
    }else{
        promise = Command.find().lean().exec();
    }
    promise.then(function(commands){
        res.json(commands);
    });
}

function create_command(req,res){
    var new_command = Command.whitelist_command(req.swagger.params.command.value);
    Command.create(new_command, function(err, command){
       if (err) {
        res.status(400);
        res.json(err);
       }
       else{
        res.status(201);
        res.json(command.toJSON());
       }
    });
}

function get_command(req,res){
    var promise = Command.findById(req.swagger.params.id.value);
    promise.then(function(command){
        res.json(command.toJSON());
    }, function(err){
        res.status(404);
        res.json(err);
    });
}

function add_products(req,res){
    var promise = Command.findById(req.swagger.params.id.value);
    promise.then(function(command){
        command.add_products(req.swagger.params.products.value);
        command.save(function(err){
            if (err) {
                res.status(400);
                res.json(err);
            }
            else {
                res.json(command);
            }
        });
    }, function(err){
        res.status(404);
        res.json(err);
    });
}

module.exports = {get_commands,create_command,get_command,add_products};