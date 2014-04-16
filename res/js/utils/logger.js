define([], function () {
	var available = typeof console === 'object';
	var LoggerImpl = function(prefix) {
		this.prefix = prefix;
		return this;
	};
	LoggerImpl.prototype.log = function (msg) {
		if (available) {
			console.log('INFO ' + this.prefix + ' - ' + msg);
		}
	};
	LoggerImpl.prototype.debug = function (msg) {
		if (available) {
			if (typeof console.debug === 'function') {
				console.debug('DEBUG ' + this.prefix + ' - ' + msg);
			} else {
				console.log('DEBUG ' + this.prefix + ' - ' + msg);
			}
		}
	};

	LoggerImpl.prototype.newLogger = function (prefix) {
		return new LoggerImpl(prefix);
	};
	var logger = new LoggerImpl("logger");
	logger.debug("loaded");
	return logger;
});