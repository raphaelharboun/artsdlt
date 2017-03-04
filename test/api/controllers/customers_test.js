var chai = require('Chai');
var expect = chai.expect;
var request = require('supertest');
var server = require('../../../app');
var Customer = require('../../../api/models/customer');

describe('controllers', function() {

  //clean database before each test
  beforeEach(function(done){
    Customer.remove({},function(err){
      if (err) throw err;
      done()
    });
  });

  //add mock customer in database before each case
  beforeEach(function(done){
    var customer1 = {name:"test1",email:"test1@gmail.com"};
    var customer2 = {name:"test2",email:"test2@gmail.com"};
    var customer3 = {name:"test3", email:"test3@gmail.com"};
    var customers = [customer1,customer2,customer3];
    Customer.create(customers,function(err,customers){
      done();
    })
  });

  describe('customers', function() {

    describe('GET /customers', function() {

      it('should return all customers', function(done) {
        request(server)
          .get('/customers')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.lengthOf(3);
            expect(res.body[0].name).to.exist;
            expect(res.body[0].name).to.be.oneOf(['test1','test2','test3']);
            done();
          });
      });

    });

    describe('GET /customer/{id}', function() {
      it('should return one customer',function(done){
        var promise = Customer.findOne();
        promise.then(function(customer){
          request(server)
          .get('/customer/' + customer._id)
          .set('Accept','application/json')
          .expect('Content-Type',"/json/")
          .expect(200)
          .end(function(err, res){
            expect(res.body).to.not.be.empty;
            expect(res.body.name).to.equal(customer.name);
            done();
          });
        });
      });
    });

    describe('PUT /customer/{id}',function(){
      it('should update one customer',function(done){
        var promise = Customer.findOne();
        promise.then(function(customer){
          request(server)
          .put('/customer/'+customer._id.toString())
          .send({name: "modified customer"})
          .set('Accept','application/json')
          .expect('Content-Type','/json/')
          .expect(200)
          .end(function(err,res){
            expect(res.body).to.not.be.empty;
            expect(res.body.name).to.equal('modified customer');
            expect(res.body._id).to.equal(customer._id.toString());
            var new_customer_promise = Customer.findById(customer._id.toString());
            promise.then(function(new_customer){
              expect(new_customer.name).to.equal('modified customer');
              done();
            });
          });
        })
      });
    });

    describe('POST /customer', function(){
      it('should create a new customer', function(done){
        request(server)
        .post('/customer')
        .set('Accept','application/json')
        .send({name:"test4", email:"test4@gmail.com"})
        .expect('Content-Type','/json/')
        .expect(200)
        .end(function(err,res){
          expect(res.body).to.not.be.empty;
          expect(res.body.name).to.equal("test4");
          expect(res.body.email).to.equal("test4@gmail.com");
          var promise = Customer.find().lean();
          promise.then(function(customers){
            expect(customers).to.be.lengthOf(4);
            done();
          });
        });
      });
    });


  });

});
