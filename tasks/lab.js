/*
* grunt-lab
* https://github.com/wtcross/grunt-lab
*
* Copyright (c) 2014 Tyler Cross <tcross@bandwidth.com>
* Licensed under the MIT license.
*/

"use strict";

var path = require("path");

module.exports = function (grunt) {
	var _ = grunt.util._;

	grunt.registerTask("lab", "Use the Spumko Lab test utility in Grunt.", function () {
		var done = this.async();

		var defaultConfig = {
			files : [ "test/**/*.js" ]
		};

		var labOptions = [
			{ name : "coverage",             flag : "-c", switch : true },
			{ name : "color",                flag : "-C", switch : true },
			{ name : "dryRun",               flag : "-d", switch : true },
			{ name : "nodeEnv",              flag : "-e", switch : false },
			{ name : "pattern",              flag : "-g", switch : false },
			{ name : "global",               flag : "-G", switch : true },
			{ name : "identifier",           flag : "-i", switch : false },
			{ name : "ignoreGlobals",        flag : "-I", switch : false },
			{ name : "disableLeakDetection", flag : "-l", switch : true },
			{ name : "timeout",              flag : "-m", switch : false },
			{ name : "reportFile",           flag : "-o", switch : false },
			{ name : "parallel",             flag : "-p", switch : true },
			{ name : "reporter",             flag : "-r", switch : false },
			{ name : "silence",              flag : "-s", switch : true },
			{ name : "minCoverage",          flag : "-t", switch : false },
			{ name : "verbose",              flag : "-v", switch : true }
		];

		var config = _.extend(defaultConfig, grunt.config.get("lab"));

		var args = [];

		_.forIn(config, function (configValue, configName) {
			var option = _.first(_.where(labOptions, { name : configName }));

			if (option && (configValue || _.isNumber(configValue))) {
				args.push(option.flag);

				if (!option.switch) {
					args.push(configValue);
				}
			}
		});

		args.push(grunt.file.expand(config.files));

		var binName = [
			"lab",
			/^win/.test(process.platform) ? ".cmd" : ""
		].join("");

		var binPath = path.join(
			path.resolve(require.resolve("lab")),
			"..", "..", "bin", binName
		);

		grunt.util.spawn({
			cmd  : binPath,
			args : _.flatten(args),
			opts : {
				stdio : "inherit"
			}
		}, function (error) {
			if (error) {
				grunt.log.writeln();
				grunt.log.error("Some tests failed.");
				grunt.fail.fatal(error);
			} else {
				grunt.log.ok("All tests passed.");
			}

			done();
		});
	});
};
