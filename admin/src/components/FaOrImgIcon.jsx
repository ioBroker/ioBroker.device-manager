import * as React from 'react';

export function FaOrImageIcon(props) {
	const { icon } = props;

	if (icon.includes('/')) {
		return <img src={icon} alt="" />;
	} else {
		let faIcon;
		if (icon.match(/^fa. fa-/)) {
			faIcon = icon;
		} else if (icon.startsWith('fa-')) {
			faIcon = `fas ${icon}`;
		} else {
			faIcon = `fas fa-${icon}`;
		}
		return <i className={faIcon}></i>;
	}
}
