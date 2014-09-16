/*
* grunt-lab
* https://github.com/wtcross/grunt-lab
*
* Copyright (c) 2014 Tyler Cross <tcross@bandwidth.com>
* Licensed under the MIT license.
*/

/*jshint bitwise: false*/

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
			{ name : "coverage",      flag : "-c", is : { switch : true } },
			{ name : "color",         flag : "-C", is : { switch : true } },
			{ name : "dryRun",        flag : "-d", is : { switch : true } },
			{ name : "nodeEnv",       flag : "-e", is : { switch : false } },
			{ name : "pattern",       flag : "-g", is : { switch : false } },
			{ name : "global",        flag : "-G", is : { switch : true } },
			{ name : "identifier",    flag : "-i", is : { switch : false } },
			{ name : "ignoreGlobals", flag : "-I", is : { switch : false } },
			{ name : "leakDetection", flag : "-l", is : { switch : true, inverse : true } },
			{ name : "timeout",       flag : "-m", is : { switch : false } },
			{ name : "reportFile",    flag : "-o", is : { switch : false } },
			{ name : "parallel",      flag : "-p", is : { switch : true } },
			{ name : "reporter",      flag : "-r", is : { switch : false } },
			{ name : "silence",       flag : "-s", is : { switch : true } },
			{ name : "minCoverage",   flag : "-t", is : { switch : false } },
			{ name : "verbose",       flag : "-v", is : { switch : true } }
		];

		var config = _.extend(defaultConfig, grunt.config.get("lab"));

		var args = [];

		_.forIn(config, function (configValue, configName) {
			var option = _.first(_.where(labOptions, { name : configName }));

			if (option) {
				if (!option.is.switch) {
					args.push(option.flag);
					args.push(configValue);
				} else if (!configValue ^ !option.is.inverse) {
					args.push(option.flag);
				}
			}
		});

		args.push(grunt.file.expand(config.files));

		grunt.util.spawn({
			args : _.flatten(args),
			cmd  : path.join(path.resolve(require.resolve("lab")), "../../.bin/lab"),
			opts : {
				stdio : "inherit"
			}
		}, function (error) {
			if (error) {
				grunt.log.error("Some tests failed.");
				grunt.fatal(error);
			} else {
				grunt.log.ok("All tests passed.");
			}

			done();
		});
	});
};
