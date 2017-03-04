var chai = require('Chai');
var expect = chai.expect;
var request = require('supertest');
var server = require('../../../app');
var Customer = require('../../../api/models/customer');
var Product = require('../../../api/models/supplier_product');

describe('controllers', function() {

  //clean database before each test
  beforeEach(function(done){
    Customer.remove({},function(err){
      if (err) throw err;
      done();
    });
  });

  //clean database before each test
  beforeEach(function(done){
    Product.remove({},function(err){
      if (err) throw err;
      done();
    });
  });

  //add mock customer in database before each case
  beforeEach(function(done){
    var product1 = {name:"product 1"};
    var product2 = {name:"product 2"};
    var product3 = {name:"product 3"};
    var products = [product1,product2,product3];
    Product.create(products,function(err,products){
      done();
    })
  });

    //add mock customer in database before each case
  beforeEach(function(done){
    var customer = {name:"customer 1"};
    Customer.create(customer,function(err,customer){
      done();
    })
  });

  describe('product', function() {

    describe('GET /products',function(){
        it('should get all products',function(done){
            request(server)
            .get('/products')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err,res){
                expect(res.body).to.have.lengthOf(3);
                expect(res.body[0].name).to.be.oneOf(["product 1","product 2","product 3"]);
                done();
            });
        });
    });

    describe('GET /product/{id}',function(){
        it('should get a product by id',function(done){
            var promise = Product.findOne();
            promise.then(function(product){
                request(server)
                .get('/product/' + product._id.toString())
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err,res){
                    expect(res.body._id).to.equal(product._id.toString());
                    expect(res.body.name).to.be.equal(product.name);
                    done();
                });
            });
        });
    })

    describe('POST /product', function() {

      it('should create a new product', function(done) {
        request(server)
        .post('/product')
        .set('Accept', 'application/json')
        .send({name: "product testing"})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            expect(res.body.name).to.equal("product testing");
            var promise = Product.find().lean();
            promise.then(function(products){
                expect(products).to.have.lengthOf(4);
                done();
            });
        });
      });

      it('should create a product associated to a customer', function(done){
        var promise = Customer.findOne().lean();
        promise.then(function(customer){
            request(server)
            .post('/product')
            .set('Accept','application/json')
            .send({name:"supplier product", supplier: customer._id.toString()})
            .expect('Content-Type','/json/')
            .expect(200)
            .end(function(err,res){
                expect(res.body.name).to.equal("supplier product");
                expect(res.body.supplier).to.not.be.empty;
                expect(res.body.supplier).to.equal(customer._id.toString());
                done();
            });
        });
      });

    });


  });



});
