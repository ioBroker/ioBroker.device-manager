import React from 'react';
import PropTypes from 'prop-types';

import ConfigGeneric from './ConfigGeneric';

class ConfigStaticHeader extends ConfigGeneric {
	renderItem() {
		switch ((this.props.schema.size || 5).toString()) {
			case '1':
				return <h1 className="">{this.getText(this.props.schema.text, this.props.schema.noTranslation)}</h1>;

			case '2':
				return <h2 className="">{this.getText(this.props.schema.text, this.props.schema.noTranslation)}</h2>;

			case '3':
				return <h3 className="">{this.getText(this.props.schema.text, this.props.schema.noTranslation)}</h3>;

			case '4':
				return <h4 className="">{this.getText(this.props.schema.text, this.props.schema.noTranslation)}</h4>;

			case '5':
			default:
				return <h5 className="">{this.getText(this.props.schema.text, this.props.schema.noTranslation)}</h5>;
		}
	}
}

ConfigStaticHeader.propTypes = {
	socket: PropTypes.object.isRequired,
	themeType: PropTypes.string,
	themeName: PropTypes.string,
	style: PropTypes.object,
	className: PropTypes.string,
	data: PropTypes.object.isRequired,
	schema: PropTypes.object,
	onError: PropTypes.func,
	onChange: PropTypes.func,
};

export default ConfigStaticHeader;
