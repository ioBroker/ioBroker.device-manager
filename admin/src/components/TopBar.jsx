import * as React from 'react';
import { Grid, TextField } from '@mui/material';
import InstanceList from './InstanceList';
import { InstanceActionButton } from './InstanceActionButton';

/**
 * TopBar component
 * @param {object} params - Parameters
 * @param {object} params.context - Context object
 * @param {string} params.selectedInstance - Selected instance
 * @param {function} params.setSelectedInstance - Set selected instance
 * @param {function} params.setFilter - Set filter
 * @returns {Element}
 * @constructor
 */
export default function TopBar(params) {
	const { context, selectedInstance, setSelectedInstance, setFilter } = params;
	const [adapterInstance, setAdapterInstance] = React.useState(null);
	const [actions, setActions] = React.useState(null);

	let timeoutId = null;

	/**
	 * Handle filter change
	 * @param {object} event - Event object
	 * @param {string} event.target.value - Filter value
	 * @returns {void}
	 */
	const handleFilterChange = (event) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			if (event.target.value === '') {
				setFilter(null);
			} else {
				setFilter(event.target.value);
			}
		}, 250);
	};

	/**
	 * Load instance actions
	 * @returns {void}
	 */
	React.useEffect(() => {
		setActions(adapterInstance?.actions);
	}, [adapterInstance]);

	/** @type {object} */
	const filterLabelText = {
		en: 'Filter by name',
		de: 'Nach Name filtern',
		ru: 'Фильтровать по имени',
		pt: 'Filtrar por nome',
		nl: 'Filteren op naam',
		fr: 'Filtrer par nom',
		it: 'Filtra per nome',
		es: 'Filtrar por nombre',
		pl: 'Filtruj według nazwy',
		'zh-cn': '按名称过滤',
		uk: "Фільтрувати за ім'ям",
	};

	/** @type {object} */
	const gridStyle = {
		position: 'sticky',
		zIndex: 10,
		top: 0,
		marginBottom: '10px',
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 33%)',
		background: '#fff',
	};
	/** @type {object} */
	const divStyle = {
		position: 'relative',
		left: '10px',
		top: '5px',
	};
	/** @type {object} */
	const instanceListStyle = {
		marginLeft: '10px',
		marginRight: '10px',
	};

	// TODO: Refresh instance list with a button

	return (
		<Grid item container alignItems="center" style={gridStyle}>
			<div style={divStyle}>
				{actions &&
					adapterInstance.actions.map((a) => (
						<InstanceActionButton key={a.id} action={a} context={context} />
					))}
			</div>
			<InstanceList
				style={instanceListStyle}
				setSelectedInstance={setSelectedInstance}
				selectedInstance={selectedInstance}
				setAdapterInstance={setAdapterInstance}
				context={context}
			/>
			<TextField
				variant="standard"
				label={context.getTranslation(filterLabelText)}
				onChange={handleFilterChange}
			/>
		</Grid>
	);
}
