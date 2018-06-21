process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../../server.js');

chai.use(chaiHttp);

var Feat = require('../../app/models/feat.server.model.js');
var feat = require('../../app/controllers/feats.server.controller.js');

describe('Feats', function() {
    var agent = chai.request.agent(server);
    agent.post('/login')
        .send({
            username: 'ktesten',
            password: '123456'
        })
        .then(function(res) {
            expect(res).to.have.cookie('connect.sid');
        });

    // Remove items created in the database from previous runs
    before('Remove items from Database', function(done) {
        agent.delete('/api/feats/Tester Test Feat')
            .end(function (err, res) {
                done();
            });
    });

    it('should add a feat on /api/feats PUT', function(done) {
        agent.post('/api/feats')
            .send({
                "name": "Tester Test Feat",
                "types": ["general"],
                "flavor_text":"You can test all of the things about feats with this.",
                "benefit": "Choose one of your revelations that has a number of uses per day. You gain 1 additional use per day of that revelation.",
                "normal": "This normally doesn't come with test data for testing purposes.",
                "special": "This is more testing information for testing purposes.",
                "requires_value": "false",
                "source": "Pathfinder Roleplaying Game Ultimate Testing Suite",
                "url": "http://www.d20pfsrd.com/feats/general-feats/abundant-revelations",
                "modifiers": [
                    {
                        "type": "ability testing",
                        "formula": "+2",
                        "conditional": "creature.fluff > 3"
                    }
                ],
                "prerequisites": [
                    {
                        "text": "Mystery class feature",
                        "requirement": "creature.class == oracle",
                        "type": "class"
                    }
                ]
            })
            .end(function (err, res) {
                should.not.exist(err);
                res.should.have.status(200);
                res.should.be.json;
                res.body.benefit.should.equal("Choose one of your revelations that has a number of uses per day. You gain 1 additional use per day of that revelation.");
                done();
            });
    });

    /*
    it('should list ALL feats on /api/feats GET', function(done) {
        this.timeout(3000);
        chai.request(server)
            .get('/api/feats')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                //res.body.length.should.eql(1);
                done();
            });
    });
    it('should list a SINGLE feat on /feat/<id> GET', function(done) {
        chai.request(server)
            .get('/api/feats/')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            });
    });
    it('should add a SINGLE feat on /feats POST');
    it('should update a SINGLE feat on /feat/<id> PUT');
    it('should delete a SINGLE feat on /feat/<id> DELETE');
    */
});