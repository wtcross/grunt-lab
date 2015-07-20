"use strict";
var Code = require("code");
var Lab  = require("lab");
var lab  = exports.lab = Lab.script();

var runTask    = require("grunt-run-task");
var sinon      = require("sinon");
var path       = require("path");
var Properties = require("apparition").Properties;

var describe = lab.describe;
var it       = lab.it;
var before   = lab.before;
var after    = lab.after;
var expect   = Code.expect;

describe("grunt-lab plugin", function () {
	runTask.loadTasks("tasks");

	describe("properties", function () {
		var task;
		var spawn;

		before(function (done) {
			task = runTask.task("lab");
			spawn = sinon.stub(task.grunt.util, "spawn").callsArg(1);
			task.run(done);
		});

		after(function (done) {
			spawn.restore();
			task.clean(done);
		});

		it("is not a multitask", function (done) {
			expect(task.multi).to.be.false();
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
			var spawn;

			before(function (done) {
				task = runTask.task("lab");
				spawn = sinon.stub(task.grunt.util, "spawn").callsArg(1);
				task.run(done);
			});

			after(function (done) {
				spawn.restore();
				task.clean(done);
			});

			it("executes the correct command", function (done) {
				expect(spawn.calledOnce).to.be.true();

				expect(spawn.firstCall.args[0]).to.deep.equal({
					cmd  : path.join(__dirname, "..", "node_modules", "lab", "bin", "lab"),
					args : [ "test/lab_spec.js" ],
					opts : { stdio : "inherit" }
				});

				done();
			});
		});

		describe("with configuration", function () {
			var task;
			var spawn;

			before(function (done) {
				task = runTask.task("lab", {
					coverage             : true,
					color                : true,
					parallel             : false,
					disableLeakDetection : true,
					reporter             : "console",
					minCoverage          : 100,
					timeout              : 0
				});
				spawn = sinon.stub(task.grunt.util, "spawn").callsArg(1);

				done();
			});

			after(function (done) {
				spawn.restore();
				task.clean(done);
			});

			describe("on windows", function () {
				var proc;

				before(function (done) {
					proc = new Properties(process);
					proc.set("platform", "win32");
					task.run(done);
				});

				after(function (done) {
					spawn.reset();
					proc.restore();
					done();
				});

				it("executes the correct command", function (done) {
					expect(spawn.calledOnce).to.be.true();

					expect(spawn.firstCall.args[0]).to.deep.equal({
						cmd  : path.join(__dirname, "..", "node_modules", "lab", "bin", "lab.cmd"),
						args : [
							"-c", "-C", "-l", "-r",
							"console", "-t", 100, "-m", 0, "test/lab_spec.js"
						],
						opts : { stdio : "inherit" }
					});

					done();
				});
			});

			describe("on linux", function () {
				var proc;

				before(function (done) {
					proc = new Properties(process);
					proc.set("platform", "linux");
					task.run(done);
				});

				after(function (done) {
					spawn.reset();
					proc.restore();
					done();
				});

				it("executes the correct command", function (done) {
					expect(spawn.calledOnce).to.be.true();

					expect(spawn.firstCall.args[0]).to.deep.equal({
						cmd  : path.join(__dirname, "..", "node_modules", "lab", "bin", "lab"),
						args : [
							"-c", "-C", "-l", "-r",
							"console", "-t", 100, "-m", 0, "test/lab_spec.js"
						],
						opts : { stdio : "inherit" }
					});

					done();
				});
			});
		});

		describe("resulting in an error", function () {
			var task;
			var spawn;
			var fatalStub;
			var error;
			var failed = false;

			before(function (done) {
				error = { message : "This is an error." };

				task = runTask.task("lab");
				fatalStub = sinon.stub(task.grunt.fail, "fatal");
				spawn = sinon.stub(task.grunt.util, "spawn").callsArgWith(1, error);
				task.fail(function () {
					failed = true;
					done();
				});
			});

			after(function (done) {
				spawn.restore();
				fatalStub.restore();
				task.clean(done);
			});

			it("spawns lab", function (done) {
				expect(spawn.calledOnce).to.be.true();
				done();
			});

			it("tells grunt to fail fatally", function (done) {
				expect(failed).to.be.true();
				done();
			});
		});
	});
});
