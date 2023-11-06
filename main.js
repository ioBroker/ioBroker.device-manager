'use strict';

/*
 * Created with @iobroker/create-adapter v2.3.0
 */

const utils = require('@iobroker/adapter-core');

const fs = require('fs');
const path = require('path');

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
			switch (obj.command) {
				case 'listInstances': {
					// Send response in callback if required
					if (obj.callback) {
						const res = await this.getObjectViewAsync('system', 'instance', null);
						const dmInstances = {};
						for (const i in res.rows) {
							//this.log.info(JSON.stringify(res.rows[i]));
							if (!res?.rows[i]?.value?.common.messagebox) {
								continue;
							}
							if (!res?.rows[i]?.value?.common.supportedMessages?.deviceManager) {
								continue;
							}

							// Remove system.adapter. from id
							const instanceName = res.rows[i].id.substring(15);
							try {
								// Check if the instance is alive by getting the state alive
								const alive = await this.getForeignStateAsync(`system.adapter.${instanceName}.alive`);
								if (!alive || !alive.val) {
									continue;
								}

								const instance = instanceName.split('.').pop(); // Get instance number from instance name
								const instanceNumber = instance !== undefined ? parseInt(instance) : 0;
								dmInstances[instanceName] = {
									title: '',
									instance: instanceNumber,
								};
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
					break;
				}
				case 'saveImage': {
					this.log.info('saveImage' + JSON.stringify(obj));
					// Save image to iobroker file system
					const fileName = obj.message.fileName;
					const fileData = obj.message.fileData;
					// convert base64 to binary string
					const base64Data = fileData.replace(/^data:image\/webp;base64,/, '');
					const imageBuffer = Buffer.from(base64Data, 'base64');
					const response = await this.writeFileAsync(this.namespace, fileName, imageBuffer);
					this.log.info('saveImage response: ' + JSON.stringify(response));
					this.sendTo(obj.from, obj.command, response, obj.callback);
					break;
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
