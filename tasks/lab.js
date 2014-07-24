/*
* grunt-lab
* https://github.com/wtcross/grunt-lab
*
* Copyright (c) 2014 Tyler Cross <tcross@bandwidth.com>
* Licensed under the MIT license.
*/

"use strict";

var path = require("path");
var q = require("q");

module.exports = function (grunt) {
	var _ = grunt.util._;

	grunt.registerTask("lab", "Use the Spumko Lab test utility in Grunt.", function () {
		var done = this.async();

		var defaultConfig = {
			files : [ "test/**/*.js" ]
		};

		var labOptions = [
			{ name : "coverage",      flag : "-c", switch : true },
			{ name : "color",         flag : "-C", switch : true },
			{ name : "dryRun",        flag : "-d", switch : true },
			{ name : "nodeEnv",       flag : "-e", switch : false },
			{ name : "pattern",       flag : "-g", switch : false },
			{ name : "global",        flag : "-G", switch : true },
			{ name : "identifier",    flag : "-i", switch : false },
			{ name : "ignoreGlobals", flag : "-I", switch : false },
			{ name : "leakDetection", flag : "-l", switch : true },
			{ name : "timeout",       flag : "-m", switch : false },
			{ name : "reportFile",    flag : "-o", switch : false },
			{ name : "parallel",      flag : "-p", switch : true },
			{ name : "reporter",      flag : "-r", switch : false },
			{ name : "silence",       flag : "-s", switch : true },
			{ name : "minCoverage",   flag : "-t", switch : false },
			{ name : "verbose",       flag : "-v", switch : true }
		];

		var config = _.extend(defaultConfig, grunt.config.get("lab"));

		var args = [];

		_.forIn(config, function (configValue, configName) {
			var option = _.first(_.where(labOptions, { name : configName }));

			if (option) {
				args.push(option.flag);

				if (!option.switch) {
					args.push(configValue);
				}
			}
		});

		args.push(grunt.file.expand(config.files));

		q.ninvoke(grunt.util, "spawn", {
			args : _.flatten(args),
			cmd  : path.join(path.resolve(require.resolve("lab")), "../../.bin/lab"),
			opts : {
				stdio : "inherit"
			}
		})
		.then(
			function () {
				grunt.log.ok("All tests passed.");
			},
			function (error) {
				grunt.log.error("Some tests failed.");
				grunt.fatal(error);
			}
		)
		.nodeify(done);
	});
};
