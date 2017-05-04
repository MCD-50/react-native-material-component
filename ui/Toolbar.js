

import React, { PureComponent, PropTypes } from 'react';
import {
	Animated,
	BackAndroid,
	findNodeHandle,
	NativeModules,
	StyleSheet,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
/* eslint-enable import/no-unresolved, import/extensions */
import IconToggle from './IconToggle.js';
import isFunction from './utils/IsFunction.js';

const UIManager = NativeModules.UIManager;


const propTypes = {
	isSearchActive: PropTypes.bool,
	searchable: PropTypes.shape({
		onChangeText: PropTypes.func,
		onSearchClosed: PropTypes.func,
		onSearchPressed: PropTypes.func,
		onSubmitEditing: PropTypes.func,
		placeholder: PropTypes.string,
		autoFocus: PropTypes.bool,
		autoCapitalize: PropTypes.string,
		autoCorrect: PropTypes.bool,
	}),
	style: PropTypes.shape({
		container: View.propTypes.style,
		leftElementContainer: View.propTypes.style,
		leftElement: View.propTypes.style,
		centerElementContainer: View.propTypes.style,
		titleText: Text.propTypes.style,
		rightElementContainer: View.propTypes.style,
		rightElement: IconToggle.propTypes.style,
	}),
	size: PropTypes.number,
	translucent: PropTypes.bool,
	onPress: PropTypes.func,
	leftElement: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
	]),
	onLeftElementPress: PropTypes.func,
	centerElement: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
		PropTypes.shape({
			upperText: PropTypes.string,
			lowerText: PropTypes.string,
		}),
	]),
	rightElement: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.shape({
			actions: PropTypes.arrayOf(
				PropTypes.oneOfType([
					PropTypes.element,
					PropTypes.string,
				]),
			),
			menu: PropTypes.shape({
				icon: PropTypes.string,
				labels: PropTypes.arrayOf(PropTypes.string),
			}),
		}),
	]),
	onRightElementPress: PropTypes.func,
};
const defaultProps = {
	elevation: 4, // TODO: probably useless, elevation is defined in getTheme function
	style: {},
};
const contextTypes = {
	uiTheme: PropTypes.object.isRequired,
};

function getStyles(props, context, state) {
	const { toolbar, toolbarSearchActive } = context.uiTheme;

	const local = {};
	const isSearchActive = props.searchable && state.isSearchActive;

	if (props.translucent) {
		local.container = {
			elevation: 0
		};
	}

	return {
		container: [
			toolbar.container,
			local.container,
			isSearchActive && toolbarSearchActive.container,
			props.style.container,
		],
		leftElementContainer: [
			toolbar.leftElementContainer,
			isSearchActive && toolbarSearchActive.leftElementContainer,
			props.style.leftElementContainer,
		],
		leftElement: [
			toolbar.leftElement,
			isSearchActive && toolbarSearchActive.leftElement,
			props.style.leftElement,
		],
		centerElementContainer: [
			toolbar.centerElementContainer,
			isSearchActive && toolbarSearchActive.centerElementContainer,
			props.style.centerElementContainer,
		],
		titleText: [
			toolbar.titleText,
			isSearchActive && toolbarSearchActive.titleText,
			props.style.titleText,
		],
		rightElementContainer: [
			toolbar.rightElementContainer,
			isSearchActive && toolbarSearchActive.rightElementContainer,
			props.style.rightElementContainer,
		],
		rightElement: [
			toolbar.rightElement,
			isSearchActive && toolbarSearchActive.rightElement,
			props.style.rightElement,
		],
	};
}
const addBackButtonListener = callback => BackAndroid.addEventListener('closeRequested', callback);

class Toolbar extends PureComponent {
	constructor(props) {
		super(props);

		// if search is active by default we need to listen back button
		if (props.isSearchActive) {
			this.backButtonListener = addBackButtonListener(this.onSearchCloseRequested);
		} else {
			this.backButtonListener = { remove: () => { } };
		}

		this.state = {
			isSearchActive: props.isSearchActive,
			searchValue: '',
		};
	}
	componentWillReceiveProps(nextProps) {
		// if user remove searchable feature we need to remove back button listener
		if (!nextProps.searchable) {
			this.backButtonListener.remove();
		}
		// searchable is set and isSearchActive is true, then we need to listen back button
		if (nextProps.searchable && this.state.isSearchActive) {
			this.backButtonListener = addBackButtonListener(this.onSearchCloseRequested);
		}
	}
	onMenuPressed = (labels) => {
		const { onRightElementPress } = this.props;

		UIManager.showPopupMenu(
			findNodeHandle(this.menu),
			labels,
			() => { },
			(result, index) => {
				if (onRightElementPress) {
					onRightElementPress({ action: 'menu', result, index });
				}
			},
		);
	};
	onSearchCloseRequested = () => {
		this.onSearchClosePressed();
		return true; // because we need to stop propagation
	}
	onSearchTextChanged = (value) => {
		const { searchable } = this.props;

		if (searchable && isFunction(searchable.onChangeText)) {
			searchable.onChangeText(value);
		}

		this.setState({ searchValue: value });
	};
	onSearchPressed = () => {
		const { searchable } = this.props;

		// on android it's typical that back button closes search input on toolbar
		this.backButtonListener = addBackButtonListener(this.onSearchCloseRequested);

		if (searchable && isFunction(searchable.onSearchPressed)) {
			searchable.onSearchPressed();
		}


		this.setState({
			isSearchActive: true,
			searchValue: '',
		});
	};
	onSearchClosePressed = () => {
		const { searchable } = this.props;

		this.backButtonListener.remove();

		if (searchable && isFunction(searchable.onSearchClosed)) {
			searchable.onSearchClosed();
		}


		this.setState({
			isSearchActive: false,
			searchValue: '',
		});
	};
	focusSearchField() {
		this.searchFieldRef.focus();
	}
	renderLeftElement = (style) => {
		const { searchable, leftElement, onLeftElementPress, size } = this.props;

		if (!leftElement && !this.state.isSearchActive) {
			return null;
		}

		if (!this.state.isSearchActive && React.isValidElement(leftElement)) {
			return (
				<View style={style.leftElementContainer}>
					{React.cloneElement(leftElement, { key: 'customLeftElement' })}
				</View>
			);
		}

		let iconName = leftElement;
		let onPress = onLeftElementPress;

		if (searchable && this.state.isSearchActive) {
			iconName = 'arrow-back';
			onPress = this.onSearchClosePressed;
		}

		const flattenLeftElement = StyleSheet.flatten(style.leftElement);

		return (
			<View style={style.leftElementContainer}>
				<IconToggle
					name={iconName}
					color={flattenLeftElement.color}
					onPress={onPress}
					size={size}
					style={flattenLeftElement}
				/>
			</View>
		);
	}
	renderCenterElement = (style) => {
		const { searchable, centerElement, onPress } = this.props;

		// there can be situastion like this:
		// 1. Given toolbar with title and searchable feature
		// 2. User presses search icon - isSearchActive === true
		// 3. User writes some search text and then select searched items in list (just example)
		// 4. Then you want to display to user he has 'n' selected items
		// 5. So you render toolbar with another props like centerElement==="n items selected" but
		//    you don't want user to be able search anymore (after he has selected something)
		// 6. So this.props.searchable===null and isSearchActive === true, if you pass searchable
		//    object again to this instance, search text and isSearchActive will be still set
		if (searchable && this.state.isSearchActive) {
			return (
				<TextInput
					ref={(ref) => { this.searchFieldRef = ref; }}
					autoFocus={searchable.autoFocus}
					autoCapitalize={searchable.autoCapitalize}
					autoCorrect={searchable.autoCorrect}
					onChangeText={this.onSearchTextChanged}
					onSubmitEditing={searchable.onSubmitEditing}
					placeholder={searchable.placeholder}
					placeholderTextColor={'white'}
					style={[style.titleText, { color: 'white' }]}
					underlineColorAndroid="transparent"
					value={this.state.searchValue}
				/>
			);
		}

		let content = null;
		let upperText = null;
		let lowerText = null;

		if (typeof centerElement === 'string') {
			content = (
				<Animated.View style={style.centerElementContainer}>
					<Text numberOfLines={1} style={style.titleText}>
						{centerElement}
					</Text>
				</Animated.View>
			);
		} else {
			if (centerElement) {
				upperText = centerElement.upperText;
				lowerText = centerElement.lowerText;
				content = (
					<View style={style.centerElementContainer}>
						<Text numberOfLines={1} style={style.titleText}>
							{upperText}
						</Text>
						<Text numberOfLines={1} style={{ color: '#f1f1f1', fontSize: 12 }}>
							{lowerText}
						</Text>
					</View>)
			}
			//content = centerElement;
		}

		if (!content) {
			return null;
		}

		return (
			<TouchableWithoutFeedback key="center" onPress={onPress}>
				{content}
			</TouchableWithoutFeedback>
		);
	}


	renderRightElement = (style) => {
		const { rightElement, onRightElementPress, searchable, size } = this.props;
		const { isSearchActive, searchValue } = this.state;

		// if there is no rightElement and searchable feature is off then we are sure on the right
		// is nothing
		if (!rightElement && !searchable) {
			return null;
		}

		let actionsMap = [];
		let result = [];

		if (rightElement) {
			if (typeof rightElement === 'string') {
				actionsMap.push(rightElement);
			} else if (Array.isArray(rightElement)) {
				actionsMap = rightElement;
			} else if (rightElement.actions) {
				actionsMap = rightElement.actions;
			}
		}

		const flattenRightElement = StyleSheet.flatten(style.rightElement);

		if (actionsMap) {
			result = actionsMap.map((action, index) => {
				if (React.isValidElement(action)) {
					return action;
				}

				return (
					<IconToggle
						key={index}
						name={action}
						color={flattenRightElement.color}
						size={size}
						style={flattenRightElement}
						onPress={() =>
							onRightElementPress && onRightElementPress({ action, index })
						}
					/>
				);
			});
		}

		if (React.isValidElement(rightElement)) {
			result.push(React.cloneElement(rightElement, { key: 'customRightElement' }));
		}


		// if searchable feature is on and search is active with some text, then we show clear
		// button, to be able to clear text
		if (searchable) {
			if (isSearchActive && searchValue.length > 0) {
				result.push(
					<IconToggle
						key="searchClear"
						name="clear"
						color={flattenRightElement.color}
						size={size}
						style={flattenRightElement}
						onPress={() => this.onSearchTextChanged('')}
					/>,
				);
			} else {
				result.push(
					<IconToggle
						key="searchIcon"
						name="search"
						color={flattenRightElement.color}
						size={size}
						onPress={this.onSearchPressed}
						style={flattenRightElement}
					/>,
				);
			}
		}

		if (rightElement && rightElement.menu && !isSearchActive) {
			result.push(
				<View key="menuIcon">
					{/* We need this view as an anchor for drop down menu. findNodeHandle can
						find just view with width and height, even it needs backgroundColor :/
					*/}
					<View
						ref={(c) => { this.menu = c; }}
						style={{
							backgroundColor: 'transparent',
							width: 1,
							height: StyleSheet.hairlineWidth,
						}}
					/>
					<IconToggle
						name="more-vert"
						color={flattenRightElement.color}
						size={size}
						onPress={() => this.onMenuPressed(rightElement.menu.labels)}
						style={flattenRightElement}
					/>
				</View>,
			);
		}

		return (
			<View style={style.rightElementContainer}>
				{result}
			</View>
		);
	}
	render() {
		const styles = getStyles(this.props, this.context, this.state);

		return (
			<Animated.View style={styles.container}>
				{this.renderLeftElement(styles)}
				{this.renderCenterElement(styles)}
				{this.renderRightElement(styles)}
			</Animated.View>
		);
	}

}

Toolbar.propTypes = propTypes;
Toolbar.defaultProps = defaultProps;
Toolbar.contextTypes = contextTypes;

export default Toolbar;