var config = require("./config");
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var autoIncrement = require('mongoose-auto-increment');

var database = {

    connect : function() {
        var env = process.env.NODE_ENV || "development";
        var conf = config[env];
        var connection = mongoose.connect(conf.db_url + "/" + conf.db_name);
        autoIncrement.initialize(connection);
        console.log("connecting to " + env + " database on " + conf.db_url);
    }

}

module.exports = database;