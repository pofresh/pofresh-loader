var Loader = require('../');
var should = require('should');

var path = __dirname + '/mock-remote/area/';

var WAIT_TIME = 20;

describe('loader', function() {
	describe('#load', function() {
		it('should load all modules under the path but sub-directory', function() {
			var services = Loader.load(path);
			should.exist(services);
			services.should.have.property('addOneRemote');
			services.addOneRemote.should.be.an.Object();
			services.addOneRemote.should.have.property('doService');
			services.addOneRemote.doService.should.be.an.Function();
			services.addOneRemote.should.have.property('doAddTwo');
			services.addOneRemote.doService.should.be.an.Function();

			services.should.have.property('addThreeRemote');
			services.addThreeRemote.should.be.an.Object();
			services.addThreeRemote.should.have.property('doService');
			services.addThreeRemote.doService.should.be.an.Function();

			// should use the name as module name if the module has a name property
			services.should.have.property('whoAmIRemote');
			services.whoAmIRemote.should.be.an.Object();
			services.whoAmIRemote.should.have.property('doService');
			services.whoAmIRemote.doService.should.be.an.Function();
			services.whoAmIRemote.should.have.property('name');
			services.whoAmIRemote.name.should.be.an.String();
		});
		
		it('should invoke functions of loaded object successfully', function(done) {
			var callbackCount = 0, sid = 'area-server-1';
			var context = {id: sid};
			var services = Loader.load(path, context);
			should.exist(services);

			services.addOneRemote.doService(1, function(err, res) {
				callbackCount++;
				res.should.equal(2);
			});

			services.addOneRemote.doAddTwo(1, function(err, res) {
				callbackCount++;
				res.should.be.equal(3);
			});

			services.addThreeRemote.doService(1, function(err, res) {
				callbackCount++;
				res.should.equal(4);
			});
			
			// context should be pass to factory function for each module
			services.whoAmIRemote.doService(function(err, res) {
				callbackCount++;
				res.should.equal(sid);
			});
			
			setTimeout(function() {
				callbackCount.should.equal(4);
				done();
			}, WAIT_TIME);
		});
		
		it('should throw an error if the path is empty', function() {
			var path = './mock-remote/connector';
			(function() {
				Loader.load(path);
			}).should.throw();
		});
		
		it('should throw exception if the path dose not exist', function() {
			var path = './some/error/path';
			(function() {
				Loader.loadPath(path);
			}).should.throw();
		});
	});
});