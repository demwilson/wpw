process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../../server.js');
var url = require('url');

chai.use(chaiHttp);

var User = require('../../app/models/user.server.model.js');
var user = require('../../app/controllers/users.server.controller.js');


describe('Users', function(){
    describe('Not Logged In', function() {
        it('should return the register HTML on "/register" GET', function (done) {
            chai.request(server)
                .get('/register')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                });
        });
        it('should return the login HTML on "/login" GET', function (done) {
            chai.request(server)
                .get('/login')
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                });
        });
        it('should redirect you to "/" page on "/logout" GET', function (done) {
            chai.request(server)
                .get('/logout')
                .end(function (err, res) {
                    (res.redirects.length).should.equal(1);
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                });
        });
        it('should create, log in, and redirect the user  to "/" page on a successful "/register" POST', function(done) {
            chai.request(server)
                .post('/register')
                .send({
                    username: 'ktesten',
                    name: 'Karl McTesten',
                    email: 'karl.mctesten@gmail.com',
                    password: '123456'
                })
                .end(function(err, res) {
                    var pathName;
                    res.should.have.status(200);
                    res.should.be.html;
                    res.redirects.length.should.equal(1);
                    // Parse the path name out of the full URL
                    pathName = res.redirects[0].split('/')[3];
                    expect(pathName).to.equal('');
                    res.should.have.cookie('connect.sid');
                    done();
                });
        });
        /*
        it('should log in the created user on /login POST', function(done) {
            chai.request(server)
                .post('/login')
                //.auth('ktesten', '123456')
                .send({
                    username: 'ktesten',
                    password: '123456'
                })
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                })
        });*/
    });
/*
    describe('Logged In', function() {
        //var agent = chai.request.agent(server);

        it('should return the root page HTML on /register GET', function (done) {
            chai.request(server)
                .get('/register')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                });
        });
        it('should return the root page HTML on /login GET', function (done) {
            chai.request(server)
                .get('/login')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                });
        });

        it('should log user out and return the root page HTML on /logout GET', function (done) {
            chai.request(server)
                .get('/login')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                });
        });
    });*/
});