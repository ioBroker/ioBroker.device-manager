'use strict';

/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const fs = require("fs");

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
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	 * Using this method requires "common.messagebox" property to be set to true in io-package.json
	 * @param {ioBroker.Message} obj
	 */
	async onMessage(obj) {
		this.log.info('onMessage' + JSON.stringify(obj));
		if (typeof obj === 'object') {
			if (obj.command === 'listInstances') {
				// Send response in callback if required
				if (obj.callback) {
					const res = await this.getObjectViewAsync('system', 'instance', null);
					const dmInstances = {};
					for (const i in res.rows) {
						this.log.info(res.rows[i].id);
						// Remove system.adapter. from id
						const instanceName = res.rows[i].id.substring(15);
						try {
							// Look for instances with apiVersion v1. Timeout after 10 milliseconds to prevent hanging.
							const instanceInfo = await Promise.race([
								this.sendToAsync(instanceName, 'dm:instanceInfo', ''),
								timeout(10),
							]);
							if (instanceInfo.apiVersion === 'v1') {
								const instance = parseInt(instanceName.split('.').pop()); // Get instance number from instance name
								dmInstances[instanceName] = {
									title: '',
									instance: instance,
								};
							}
						} catch (error) {
							this.log.error(error);
						}
					}
					this.sendTo(
						obj.from,
						obj.command,
						dmInstances,
						/*{
							"enocean2mqtt.0": {
								title: "EnOcean2MQTT",
								instance: 0,
							},
						},*/
						obj.callback,
					);
				}
			}
		}
	}
}

/**
 * Timeout function
 * @param {number | undefined} ms
 * @return {Promise<unknown>}
 */
function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
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
