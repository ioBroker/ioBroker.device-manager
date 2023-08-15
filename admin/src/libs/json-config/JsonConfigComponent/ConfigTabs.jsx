import React from 'react';
import PropTypes from 'prop-types';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import ConfigGeneric from './ConfigGeneric';
import ConfigPanel from './ConfigPanel';

class ConfigTabs extends ConfigGeneric {
	constructor(props) {
		super(props);

		let tab =
			(window._localStorage || window.localStorage).getItem(
				(this.props.dialogName || 'App') + '.' + this.props.adapterName,
			) || Object.keys(this.props.schema.items)[0];
		if (!Object.keys(this.props.schema.items).includes(tab)) {
			tab = Object.keys(this.props.schema.items)[0];
		}
		this.state = {
			tab,
		};
	}

	render() {
		const items = this.props.schema.items;

		return (
			<div className="">
				<Tabs
					value={this.state.tab}
					onChange={(e, tab) => {
						(window._localStorage || window.localStorage).setItem(
							(this.props.dialogName || 'App') + '.' + this.props.adapterName,
							tab,
						);
						this.setState({ tab });
					}}
				>
					{Object.keys(items).map((name) => {
						let disabled;
						if (this.props.custom) {
							const hidden = this.executeCustom(
								items[name].hidden,
								this.props.data,
								this.props.customObj,
								this.props.instanceObj,
							);
							if (hidden) {
								return null;
							}
							disabled = this.executeCustom(
								items[name].disabled,
								this.props.data,
								this.props.customObj,
								this.props.instanceObj,
							);
						} else {
							const hidden = this.execute(items[name].hidden, false);
							if (hidden) {
								return null;
							}
							disabled = this.execute(items[name].disabled, false);
						}
						return (
							<Tab
								wrapped
								disabled={disabled}
								key={name}
								value={name}
								label={this.getText(items[name].label)}
							/>
						);
					})}
				</Tabs>
				{
					<ConfigPanel
						isParentTab
						key={this.state.tab}
						index={1001}
						arrayIndex={this.props.arrayIndex}
						globalData={this.props.globalData}
						onCommandRunning={this.props.onCommandRunning}
						commandRunning={this.props.commandRunning}
						className=""
						socket={this.props.socket}
						adapterName={this.props.adapterName}
						instance={this.props.instance}
						common={this.props.common}
						customs={this.props.customs}
						alive={this.props.alive}
						themeType={this.props.themeType}
						themeName={this.props.themeName}
						data={this.props.data}
						originalData={this.props.originalData}
						systemConfig={this.props.systemConfig}
						onError={this.props.onError}
						onChange={this.props.onChange}
						multiEdit={this.props.multiEdit}
						dateFormat={this.props.dateFormat}
						isFloatComma={this.props.isFloatComma}
						// disabled={disabled}
						imagePrefix={this.props.imagePrefix}
						changeLanguage={this.props.changeLanguage}
						forceUpdate={this.props.forceUpdate}
						registerOnForceUpdate={this.props.registerOnForceUpdate}
						customObj={this.props.customObj}
						instanceObj={this.props.instanceObj}
						custom={this.props.custom}
						schema={items[this.state.tab]}
					/>
				}
			</div>
		);
	}
}

/**
 * Defines the propTypes for the ConfigTabs component.
 * @typedef {Object} PropTypes
 * @property {Object} socket - The socket object to communicate with the backend.
 * @property {string} [themeType] - The type of the theme to be used.
 * @property {string} [themeName] - The name of the theme to be used.
 * @property {Object} [style] - The style object to be applied to the component.
 * @property {string} [className] - The CSS class to be applied to the component.
 * @property {Object} data - The data object to be displayed in the component.
 * @property {Object} [originalData] - The original data object before it was modified.
 * @property {Object} [schema] - The schema object for the data.
 * @property {function} [onError] - The function to be called when an error occurs.
 * @property {function} [onChange] - The function to be called when the data changes.
 * @property {Object} [customs] - The customs object to be used for custom configuration.
 * @property {string} [adapterName] - The name of the adapter.
 * @property {number} [instance] - The instance number.
 * @property {boolean} [commandRunning] - Flag indicating whether a command is running.
 * @property {function} [onCommandRunning] - The function to be called when a command is running.
 * @property {string} [dateFormat] - The date format to be used.
 * @property {boolean} [isFloatComma] - Flag indicating whether the decimal separator is a comma or a dot.
 * @property {boolean} [multiEdit] - Flag indicating whether multiple data objects can be edited at once.
 * @property {string} [imagePrefix] - The prefix for image URLs.
 * @property {Object} [customObj] - The custom object to be used for custom configuration.
 * @property {Object} [instanceObj] - The instance object to be used for custom configuration.
 * @property {boolean} [custom] - Flag indicating whether custom configuration is being used.
 * @property {function} registerOnForceUpdate - The function to register for force updates.
 * @property {function} forceUpdate - The function to force updates.
 * @property {function} [changeLanguage] - The function to be called when the language changes.
 * @property {Object} [systemConfig] - The system configuration object.
 * @property {boolean} [alive] - Flag indicating whether the component is alive.
 * @property {Object} [common] - The common object for the adapter.
 */
ConfigTabs.propTypes = {
	socket: PropTypes.object.isRequired,
	themeType: PropTypes.string,
	themeName: PropTypes.string,
	style: PropTypes.object,
	className: PropTypes.string,
	data: PropTypes.object.isRequired,
	originalData: PropTypes.object,
	schema: PropTypes.object,
	onError: PropTypes.func,
	onChange: PropTypes.func,
	customs: PropTypes.object,
	adapterName: PropTypes.string,
	instance: PropTypes.number,
	commandRunning: PropTypes.bool,
	onCommandRunning: PropTypes.func,
	dateFormat: PropTypes.string,
	isFloatComma: PropTypes.bool,
	multiEdit: PropTypes.bool,
	imagePrefix: PropTypes.string,

	customObj: PropTypes.object,
	instanceObj: PropTypes.object,
	custom: PropTypes.bool,

	registerOnForceUpdate: PropTypes.func.isRequired,
	forceUpdate: PropTypes.func.isRequired,
	changeLanguage: PropTypes.func,
	systemConfig: PropTypes.object,
	alive: PropTypes.bool,
	common: PropTypes.object,
};

export default ConfigTabs;
