"use strict";

module.exports = function (bin) {
	if (/^win/.test(process.platform)) {
		bin += ".cmd";
	}
	return bin;
};