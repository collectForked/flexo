import React, { createContext, useState } from 'react';
const { Consumer, Provider } = createContext();

const ContextProvider = (props) => {
	const [appState, setAppState] = useState({
		showMainAxis: true,
		showCrossAxis: true,
		addPadding: true,
		showSidebar: false,
		selectedElement: {
			type: '',
			id: undefined,
		},
		containerStyles: {
			display: 'flex',
			children: 1,
			flexDirection: 'row',
			flexWrap: 'nowrap',
			justifyContent: 'flex-start',
			alignItems: 'stretch',
			alignContent: 'stretch',
		},
		children: [
			{
				id: 1,
				childStyles: {
					order: '0',
					flexBasis: 'auto',
					flexGrow: '0',
					flexShrink: '1',
					alignSelf: 'auto',
				},
			},
		],
	});

	const handleMainAxisToggle = () =>
		setAppState((preState) => ({
			...preState,
			showMainAxis: !preState.showMainAxis,
		}));

	const handleCrossAxisToggle = () =>
		setAppState((preState) => ({
			...preState,
			showCrossAxis: !preState.showCrossAxis,
		}));

	const handlePaddingToggle = () =>
		setAppState((preState) => ({
			...preState,
			addPadding: !preState.addPadding,
		}));

	const openSidebar = () =>
		setAppState((preState) => ({
			...preState,
			showSidebar: true,
		}));

	const closeSidebar = () =>
		setAppState(
			(preState) => ({
				...preState,
				showSidebar: false,
			}),
			handleSelectedElement('', undefined)
		);

	const handleSelectedElement = (elementType, id) =>
		setAppState((preState) => ({
			...preState,
			selectedElement: { type: elementType, id },
		}));

	const processPropertyValue = (styleObj, propertyName, propertyValue) => {
		if (
			propertyValue.split('')[0] === '+' ||
			propertyValue.split('')[0] === '-'
		) {
			return (
				parseInt(styleObj[propertyName], 10) +
				parseInt(propertyValue, 10)
			).toString();
		}
		return propertyValue;
	};

	const createOrDestroyChildren = (numberOfChildren) => {
		const defaultChildStyles = {
			order: '0',
			flexBasis: 'auto',
			flexGrow: '0',
			flexShrink: '1',
			alignSelf: 'auto',
		};
		const remainingChildren = [...appState.children];
		const childrenNumberDifference =
			numberOfChildren - remainingChildren.length;

		if (childrenNumberDifference > 0) {
			for (let i = 0; i < childrenNumberDifference; i++) {
				remainingChildren.push({
					id: remainingChildren.length + 1,
					childStyles: { ...defaultChildStyles },
				});
			}
		} else if (childrenNumberDifference < 0) {
			const splicingIndex =
				remainingChildren.length - Math.abs(childrenNumberDifference);
			console.log(splicingIndex, Math.abs(childrenNumberDifference));
			remainingChildren.splice(
				splicingIndex,
				Math.abs(childrenNumberDifference)
			);
		}

		return setAppState((preState) => ({
			...preState,
			children: [...remainingChildren],
		}));
	};

	const handleCssPropertyChange = (childId, propertyName, propertyValue) => {
		if (childId) {
			const childrenAfterStyleUpdate = [...appState.children];

			childrenAfterStyleUpdate[childId - 1].childStyles[
				propertyName
			] = processPropertyValue(
				childrenAfterStyleUpdate[childId - 1].childStyles,
				propertyName,
				propertyValue
			);

			return setAppState((preState) => ({
				...preState,
				children: childrenAfterStyleUpdate,
			}));
		} else {
			const containerAfterStyleUpdate = {
				...appState.containerStyles,
			};

			containerAfterStyleUpdate[propertyName] = processPropertyValue(
				containerAfterStyleUpdate,
				propertyName,
				propertyValue
			);

			if (propertyName === 'children') {
				createOrDestroyChildren(
					containerAfterStyleUpdate[propertyName]
				);
			}

			return setAppState((preState) => ({
				...preState,
				containerStyles: containerAfterStyleUpdate,
			}));
		}
	};

	return (
		<Provider
			value={{
				appState,
				handleMainAxisToggle,
				handleCrossAxisToggle,
				handlePaddingToggle,
				openSidebar,
				closeSidebar,
				handleSelectedElement,
				handleCssPropertyChange,
			}}
		>
			{props.children}
		</Provider>
	);
};

export { ContextProvider };
export default Consumer;
