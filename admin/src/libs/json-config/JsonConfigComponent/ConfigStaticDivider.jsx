import React from 'react';
import PropTypes from 'prop-types';

import Utils from './wrapper/Components/Utils';

import ConfigGeneric from './ConfigGeneric';

class ConfigStaticDivider extends ConfigGeneric {
	renderItem() {
		return (
			<hr
				className={Utils.clsx(this.props.schema.color === 'primary', this.props.schema.color === 'secondary')}
				style={{
					height: this.props.schema.color ? this.props.schema.height || 2 : this.props.schema.height || 1,
					backgroundColor:
						this.props.schema.color !== 'primary' &&
						this.props.schema.color !== 'secondary' &&
						this.props.schema.color
							? this.props.schema.color
							: undefined,
				}}
			/>
		);
	}
}

ConfigStaticDivider.propTypes = {
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

export default ConfigStaticDivider;
