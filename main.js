'use strict';

/*
 * Created with @iobroker/create-adapter v2.3.0
 */

const utils = require('@iobroker/adapter-core');

class DeviceManager extends utils.Adapter {
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'device-manager',
		});
		this.on('ready', this.onReady.bind(this));
		this.on('message', this.onMessage.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here
	}

	/**
	 * Some message was sent to this instance over the message box. Used by email, pushover, text2speech, ...
	 * Using this method requires "common.messagebox" property to be set to true in io-package.json
	 * @param {ioBroker.Message} obj
	 */
	async onMessage(obj) {
		this.log.info(`onMessage: ${JSON.stringify(obj)}`);
		if (typeof obj === 'object') {
			switch (obj.command) {
			}
		}
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new DeviceManager(options);
} else {
	// otherwise start the instance directly
	new DeviceManager();
}
