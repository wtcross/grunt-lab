"use strict";

var Lab = require("lab");
var runTask = require("grunt-run-task");
var sinon = require("sinon");
var path = require("path");
var grunt = require("grunt");

var describe = Lab.experiment;
var before = Lab.before;
var beforeEach = Lab.beforeEach;
var afterEach = Lab.afterEach;
var it = Lab.test;
var expect = Lab.expect;

describe("grunt-lab plugin", function () {
	runTask.loadTasks("tasks");

	var spawnStub;

	beforeEach(function (done) {
		spawnStub = sinon.stub(grunt.util, "spawn").callsArg(1);
		done();
	});

	afterEach(function (done) {
		spawnStub.restore();
		done();
	});

	describe("properties", function () {
		var task;

		before(function (done) {
			task = runTask.task("lab");
			done();
		});

		beforeEach(function (done) {
			task.run(function () {
				done();
			});
		});

		afterEach(function (done) {
			task.clean(done);
		});

		it("is not a multitask", function (done) {
			expect(task.multi).to.equal(false);
			done();
		});

		it("is named `lab`", function (done) {
			expect(task.name).to.equal("lab");
			done();
		});
	});

	describe("lab cli execution", function () {
		describe("with no configuration", function () {
			var task;

			before(function (done) {
				task = runTask.task("lab");
				done();
			});

			beforeEach(function (done) {
				task.run(done);
			});

			afterEach(function (done) {
				task.clean(done);
			});

			it("executes the correct command", function (done) {
				expect(spawnStub.calledOnce).to.equal(true);

				expect(spawnStub.firstCall.args[0]).to.deep.equal({
					cmd  : path.join(__dirname, "../node_modules", ".bin", "lab"),
					args : [ "test/lab.js" ],
					opts : { stdio : "inherit" }
				});

				done();
			});
		});

		describe("with configuration", function () {
			var task;

			before(function (done) {
				task = runTask.task("lab", {
					coverage    : true,
					color       : true,
					parallel    : true,
					reporter    : "console",
					minCoverage : 100
				});
				done();
			});

			beforeEach(function (done) {
				task.run(done);
			});

			afterEach(function (done) {
				task.clean(done);
			});

			it("executes the correct command", function (done) {
				expect(spawnStub.calledOnce).to.equal(true);

				expect(spawnStub.firstCall.args[0]).to.deep.equal({
					cmd  : path.join(__dirname, "../node_modules", ".bin", "lab"),
					args : [
						"-c", "-C", "-p", "-r",
						"console", "-t", 100, "test/lab.js"
					],
					opts : { stdio : "inherit" }
				});

				done();
			});
		});
	});
});