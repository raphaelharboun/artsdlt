var chai = require('Chai');
var expect = chai.expect;
var Command = require('../../../api/models/command');
var Customer = require('../../../api/models/customer');

describe('Models',function(){

    describe('Command',function(){

            //clean database before each test
            beforeEach(function(done){
                Command.remove({},function(err){
                    if (err) throw err;
                    done();
                });
            });

            beforeEach(function(done){
                Customer.remove({},function(err){
                    if (err) throw err;
                    done();
                })
            });

            beforeEach(function(done){
                Command.resetCount(function(err,nextCount){
                    if (err) throw err;
                    done();
                })
            });

            //add a command to the databse and products to it
            beforeEach(function(done){
                Customer.create({name:"customer test"},function(err,customer){
                    var command1 = {type:"estimate", customer: customer._id};
                    Command.create(command1,function(err,command){
                        if (err) throw err;
                        var product1 = {name:"product 1",selling_price_excl_tax:100,tax:0.2,quantity:10};
                        var product2 = {name:"product 2",selling_price_excl_tax:200,tax:0.2,quantity:10};
                        var products = [product1,product2];
                        command.add_products(products);
                        command.save(function(err){
                            if(err) throw err;
                            done();
                        });
                    });
                });
            });

        describe('Instance Methods', function(){
            it('should add products to sub documents', function(done){
                Command.findOne(function(err, command){
                    var product = {name:"product 3",selling_price_excl_tax:200,tax:0.2,quantity:10};
                    command.add_products([product]);
                    command.save(function(err, command){
                        if(err) throw err;
                        expect(command.products.length).to.equal(3);
                        done();
                    });         
                });
            });
        });

        describe('Virtual attributes', function(){
            it('should calculate total excl tax, tax and incl tax', function(done){
                Command.findOne(function(err,command){
                    expect(command.total_excl_tax).to.equal(3000);
                    expect(command.total_tax).to.equal(600);
                    expect(command.total_incl_tax).to.equal(3600);
                    done();
                });
            });
        });

        describe('auto increment transaction number',function(){
            it('should create a transaction number when creating a document',function(done){
                Command.findOne(function(err,command){
                    expect(command.transaction_number).to.not.be.undefined;
                    expect(command.transaction_number).to.be.within(1,3);
                    done();
                });
            });
            it('should increment the transaction number when creating a new document',function(done){
                Customer.findOne(function(err,customer){
                    Command.nextCount(function(err, count){
                        if (err) throw err;
                        Command.create({type:"estimate", customer: customer._id},function(err,command){
                            expect(command.transaction_number).to.equal(count);
                            done();
                        });
                    });
                });
            });
        });

    });

});
