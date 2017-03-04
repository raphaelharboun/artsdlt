var chai = require('Chai');
var expect = chai.expect;
var request = require('supertest');
var server = require('../../../app');
var Command = require('../../../api/models/command');
var Customer = require('../../../api/models/customer');

describe('controllers', function() {

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


  //add mock customer in database before each case
  beforeEach(function(done){
    Customer.create({name:"customer test"},function(err,customer){
      var command1 = {type:"estimate", customer: customer._id};
      var command2 = {type:"command", customer: customer._id};
      var command3 = {type:"invoice", customer: customer._id};
      var command4 = {type:"delivery",customer: customer._id};
      var commands = [command1,command2,command3,command4];
      Command.create(commands,function(err,commands){
        if (err) throw err;
        done();
      });
    });
  });

  describe('commands', function() {

    describe('POST /command',function(){
      it('should create a new command',function(done){
        var promise = Customer.findOne();
        var command;
        promise.then(function(customer){
          command = {
            type: 'estimate',
            customer: customer._id
          };
          request(server)
            .post('/command')
            .set('Accept','application/json')
            .send(command)
            .expect('Content-Type','/json/')
            .expect(201)
            .end(function(err, res){
              expect(res.body.type).to.equal('estimate');
              var promise = Command.find().lean();
              promise.then(function(commands){
                expect(commands.length).to.equal(5);
                done();
              });
            });
        });
      });
    });

    describe('GET /commands', function() {

      it('should return all commands type', function(done) {
        request(server)
          .get('/commands')
          .set('Accept', 'application/json')
          .expect('Content-Type', '/json/')
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.lengthOf(4);
            expect(res.body[0].type).to.exist;
            expect(res.body[0].type).to.be.oneOf(['estimate','command','invoice','delivery']);
            done();
          });
      });

      it('should return only estimates', function(done) {
        request(server)
          .get('/commands?type=estimate')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0].type).to.exist;
            expect(res.body[0].type).to.equal('estimate');
            done();
          });
      });

      it('should return only commands', function(done) {
        request(server)
          .get('/commands?type=command')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0].type).to.exist;
            expect(res.body[0].type).to.equal('command');
            done();
          });
      });

      it('should return only invoices', function(done) {
        request(server)
          .get('/commands?type=invoice')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0].type).to.exist;
            expect(res.body[0].type).to.equal('invoice');
            done();
          });
      });

      it('should return only delivery', function(done) {
        request(server)
          .get('/commands?type=delivery')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0].type).to.exist;
            expect(res.body[0].type).to.equal('delivery');
            done();
          });
      });

    });

    describe('GET Command/{id}', function(){

      it('should return a document for its id',function(done){
        var promise = Command.findOne();
        promise.then(function(command){
        request(server)
          .get('/command/' + command._id.toString())
          .set('Accept','application/json')
          .expect('Content-Type',"/json/")
          .expect(200)
          .end(function(err,res){
            expect(res.body._id).to.equal(command._id.toString());
            done();
          });
        });
      });

    });

    describe('POST command/{id}/add_product',function(){

      it('should add a product on an existing command', function(done){
          var product = [{
            reference : "test ref",
            name: "test product",
            description: "test description",
            selling_price_excl_tax : 200.99,
            tax: 0.13,
            quantity: 10
          }];
          var promise = Command.findOne();
          promise.then(function(command){
            request(server)
              .post('/command/'+ command._id.toString() + '/add_products')
              .set('Accept','application/json')
              .send(product)
              .expect('Content-Type','/json/')
              .expect(201)
              .end(function(err,res){
                expect(res.body.products).to.not.be.empty;
                expect(res.body.products[0].name).to.equal("test product");
                done();
              });
          });
      });

    });

  });

});
