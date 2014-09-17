"use strict";

var Lab = require("lab");
var lab = exports.lab = Lab.script();

var runTask = require("grunt-run-task");
var sinon = require("sinon");
var path = require("path");
var grunt = require("grunt");

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Lab.expect;

describe("grunt-lab plugin", function () {
	runTask.loadTasks("tasks");

	describe("properties", function () {
		var task;
		var spawnStub;

		before(function (done) {
			spawnStub = sinon.stub(grunt.util, "spawn").callsArg(1);
			task = runTask.task("lab");
			task.run(done);
		});

		after(function (done) {
			spawnStub.restore();
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
			var spawnStub;

			before(function (done) {
				spawnStub = sinon.stub(grunt.util, "spawn").callsArg(1);
				task = runTask.task("lab");
				task.run(done);
			});

			after(function (done) {
				spawnStub.restore();
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
			describe("all enabled", function () {

			});

			describe("all disabled", function () {

			});

			describe("some enabled", function () {
				var task;
				var spawnStub;

				before(function (done) {
					spawnStub = sinon.stub(grunt.util, "spawn").callsArg(1);
					task = runTask.task("lab", {
						coverage             : true,
						color                : true,
						parallel             : false,
						disableLeakDetection : true,
						reporter             : "console",
						minCoverage          : 100
					});

					task.run(done);
				});

				after(function (done) {
					spawnStub.restore();
					task.clean(done);
				});

				it("executes the correct command", function (done) {
					expect(spawnStub.calledOnce).to.equal(true);

					expect(spawnStub.firstCall.args[0]).to.deep.equal({
						cmd  : path.join(__dirname, "../node_modules", ".bin", "lab"),
						args : [
							"-c", "-C", "-l", "-r",
							"console", "-t", 100, "test/lab.js"
						],
						opts : { stdio : "inherit" }
					});

					done();
				});
			});
		});

		describe("resulting in an error", function () {
			var task;
			var spawnStub;
			var fatalStub;
			var error;

			before(function (done) {
				error = new Error("This is an error");
				fatalStub = sinon.stub(grunt, "fatal");
				spawnStub = sinon.stub(grunt.util, "spawn").callsArgWith(1, error);

				task = runTask.task("lab");
				task.run(done);
			});

			after(function (done) {
				spawnStub.restore();
				fatalStub.restore();
				task.clean(done);
			});

			it("tells grunt to fail fatally", function (done) {
				expect(spawnStub.calledOnce).to.equal(true);
				expect(fatalStub.calledOnce).to.equal(true);
				expect(fatalStub.calledWith(error)).to.equal(true);
				done();
			});
		});
	});
});