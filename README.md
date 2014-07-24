grunt-lab [![Build Status](https://travis-ci.org/wtcross/grunt-lab.svg)](https://travis-ci.org/wtcross/grunt-lab)
=========

Use the Spumko [Lab](https://github.com/spumko/lab) test utility in Grunt.

### Configuration
All configuration is optional. See the Lab [documentation](https://github.com/spumko/lab) for more information about each parameter.

| grunt-lab option | Type    | Default            | Lab flag |
| ---------------- | ------- | ------------------ | -------- |
| files            | [glob]  | [ "test/**/*.js" ] |          |
| coverage         | boolean | false              | -c       |
| color            | boolean | false              | -C       |
| dryRun           | boolean | false              | -d       |
| nodeEnv          | string  | test               | -e       |
| pattern          | string  |                    | -g       |
| global           | boolean | false              | -G       |
| identifier       | string  |                    | -i       |
| ignoreGlobals    | string  |                    | -I       |
| leakDetection    | boolean | false              | -l       |
| timeout          | integer | 2000               | -m       |
| reportFile       | string  |                    | -o       |
| parallel         | boolean | false              | -p       |
| reporter         | string  | console            | -r       |
| silence          | boolean | false              | -s       |
| minCoverage      | integer |                    | -t       |
| verbose          | boolean | false              | -v       |

An example Gruntfile using grunt-lab may look like this:
```
"use strict";

module.exports = function (grunt) {

	grunt.initConfig({
		lab : {
			color       : true,
			coverage    : true,
			minCoverage : 100
		}
	});

	// Load plugins
	grunt.loadNpmTasks("grunt-lab");

	// Register tasks
	grunt.registerTask("default", [ "lab" ]);

};
```

It is not required to specify any configuration at all if you don't want to.


### Contributing
There are only a few things to keep in mind when submitting a PR:
1) all tests pass
2) 100% test coverage
3) linting and style guidelines are followed

Otherwise, the build will fail. :)
