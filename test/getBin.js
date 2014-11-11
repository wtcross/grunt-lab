"use strict";

var Lab = require("lab");
var lab = exports.lab = Lab.script();

var getBin = require("../tasks/getBin");

var describe = lab.describe;
var it = lab.it;
var expect = Lab.expect;

describe("getBin utility", function () {


	it("it should return .cmd on windows platform", function (done) {
		var platform = process.platform;
		process.platform='win32';
		expect(getBin('foo')).to.equal('foo.cmd');
		process.platform = platform;
		done();
	});

	it("it should not return .cmd on platform without 'win' in them", function (done) {
		var platform = process.platform;
		process.platform='linux';
		expect(getBin('foo')).to.equal('foo');
		process.platform = platform;
		done();
	});

});
