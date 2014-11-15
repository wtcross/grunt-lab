"use strict";

var path = require("path");

function localCommand (command) {
	return path.join(__dirname, "node_modules", ".bin", command);
}

module.exports = function (grunt) {
	var _ = grunt.util._;

	var sourceFiles = [ "*.js", "tasks/**/*.js" ];
	var testFiles   = [ "test/**/*_spec.js" ];
	var allFiles    = sourceFiles.concat(testFiles);

	var defaultJsHintOptions = grunt.file.readJSON("./.jshint.json");
	var testJsHintOptions = _.extend(
		grunt.file.readJSON("./test/.jshint.json"),
		defaultJsHintOptions
	);

	grunt.config.init({
		jscs : {
			src     : allFiles,
			options : {
				config : ".jscs.json"
			}
		},

		jshint : {
			src     : sourceFiles,
			options : defaultJsHintOptions,
			test    : {
				options : testJsHintOptions,
				files   : {
					test : testFiles
				}
			}
		},

		watch : {
			scripts : {
				files   : allFiles,
				tasks   : [ "lint", "style" ],
				options : {
					spawn : false,
				},
			},
		}
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-jscs");

	// Register tasks
	grunt.registerTask("test", "Run all tests.", function () {
		var done = this.async();

		var options = {
			args : [ "-c", "-t", 100, "-p" ],
			cmd  : localCommand("lab"),
			opts : {
				stdio : "inherit"
			}
		};

		grunt.util.spawn(options, function (error) {
			if (error) {
				grunt.log.writeln();
				grunt.log.error("Some tests failed.");
				grunt.fail.fatal(error);
			}

			grunt.log.ok("All tests passed.");

			done();
		});
	});

	grunt.registerTask("lint", "Check for common code problems.", [ "jshint" ]);
	grunt.registerTask("style", "Check for style conformity.", [ "jscs" ]);
	grunt.registerTask("default", [ "lint", "style", "test" ]);

};
