/* eslint-disable import/no-unresolved, import/extensions */
import React, { PureComponent, PropTypes } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableWithoutFeedback,
} from 'react-native';
/* eslint-enable import/no-unresolved, import/extensions */

import Divider from './utils/Divider.js';
import Icon from './Icon.js';
import IconToggle from './IconToggle.js';
import RippleFeedback from './utils/RippleFeedback.js';
import Avatar from './Avatar.js';

const propTypes = {
	// generally
	dense: PropTypes.bool,
	// should render divider after list item?
	divider: PropTypes.bool,
	onPress: PropTypes.func,
	onPressValue: PropTypes.any,
	numberOfLines: React.PropTypes.oneOf([1, 2, 3, 'dynamic']),
	style: PropTypes.object,

	// left side

	leftElement: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
	]),
	onLeftElementPress: PropTypes.func,

	// center side
	centerElement: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
		PropTypes.shape({
			primaryElement: PropTypes.shape({
				icon: PropTypes.string,
				primaryText: PropTypes.string.isRequired,
			}),
			secondaryText: PropTypes.string,
			tertiaryText: PropTypes.string,
		}),
	]),
	// right side
	rightElement: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
		PropTypes.shape({
			upperElement: PropTypes.string,
			lowerElement: PropTypes.element,
		}),
	]),
	onRightElementPress: PropTypes.func,
};
const defaultProps = {
	numberOfLines: 1,
	style: {},
};

const contextTypes = {
	uiTheme: PropTypes.object.isRequired,
};

function getNumberOfSecondaryTextLines(numberOfLines) {
	if (numberOfLines === 'dynamic') {
		return null;
	}

	return numberOfLines - 1;
}
function getNumberOfLines(props) {
	const { numberOfLines, centerElement } = props;

	if (centerElement && centerElement.secondaryText && centerElement.tertiaryText
		&& (!numberOfLines || numberOfLines < 3)) {
		return 3;
	} else if (centerElement && centerElement.secondaryText &&
		(!numberOfLines || numberOfLines < 2)) {
		return 2;
	}

	return numberOfLines || 1;
}

function getListItemHeight(props, state) {
	const { leftElement, dense } = props;
	const { numberOfLines } = state;

	if (numberOfLines === 'dynamic') {
		return null;
	}

	if (!leftElement && numberOfLines === 1) {
		return dense ? 40 : 48;
	}

	if (numberOfLines === 1) {
		return dense ? 48 : 56;
	} else if (numberOfLines === 2) {
		return dense ? 60 : 72;
	} else if (numberOfLines === 3) {
		return dense ? 80 : 88;
	}

	return null;
}
function getStyles(props, context, state) {
	const { rightElement } = props;
	const { listItem } = context.uiTheme;
	const { numberOfLines } = state;


	const container = {
		height: getListItemHeight(props, state),
	};
	const contentViewContainer = {};
	const leftElementContainer = {};

	if (numberOfLines === 'dynamic') {
		contentViewContainer.paddingVertical = 16;
		leftElementContainer.alignSelf = 'flex-start';
	}
	if (typeof rightElement !== 'string') {
		contentViewContainer.paddingRight = 16;
	}

	return {
		container: [
			listItem.container,
			container,
			props.style.container,
		],
		content: [
			listItem.content,
			props.style.content,
		],
		contentViewContainer: [
			listItem.contentViewContainer,
			contentViewContainer,
			props.style.contentViewContainer,
		],
		leftElementContainer: [
			listItem.leftElementContainer,
			leftElementContainer,
			props.style.leftElementContainer,
		],
		centerElementContainer: [
			listItem.centerElementContainer,
			props.style.centerElementContainer,
		],
		textViewContainer: [
			listItem.textViewContainer,
			props.style.textViewContainer,
		],
		primaryText: [
			listItem.primaryText,
			props.style.primaryText,
		],
		firstLine: [
			listItem.firstLine,
			props.style.firstLine,
		],
		primaryTextContainer: [
			listItem.primaryTextContainer,
			props.style.primaryTextContainer,
		],
		secondaryText: [
			listItem.secondaryText,
			props.style.secondaryText,
		],
		tertiaryText: [
			listItem.tertiaryText,
			props.style.tertiaryText,
		],
		rightElementContainer: [
			listItem.rightElementContainer,
			props.style.rightElementContainer,
		],
		leftElement: [
			listItem.leftElement,
			props.style.leftElement,
		],
		rightElement: [
			listItem.rightElement,
			props.style.rightElement,
		],
	};
}

class ListItem extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			numberOfLines: getNumberOfLines(props),
		};
	}

	componentWillReceiveProps(nextPros) {
		this.setState({ numberOfLines: getNumberOfLines(nextPros) });
	}

	onListItemPressed = () => {
		const { onPress, onPressValue } = this.props;
		if (onPress) {
			onPress(onPressValue);
		}
	};

	onLeftElementPressed = () => {
		const { onLeftElementPress, onPress, onPressValue } = this.props;

		if (onLeftElementPress) {
			onLeftElementPress(onPressValue);
		} else if (onPress) {
			onPress(onPressValue);
		}
	};

	onRightElementPressed = () => {
		const { onRightElementPress, onPressValue } = this.props;

		if (onRightElementPress) {
			onRightElementPress(onPressValue);
		}
	};

	// onLongPressed = () => {
	//     const { onLongPress, onPressValue } = this.props;
	//     if (onLongPress) {
	//         console.log('on long press');
	//         onLongPress(onPressValue);
	//     }
	// }


	renderLeftElement = (styles) => {

		const { leftElement, centerElement  } = this.props;

		if (!leftElement) {
			return null;
		}

		let leftStyle = null;

		if (centerElement.tertiaryText != null && typeof centerElement.tertiaryText != undefined) {
			leftStyle = {
				width: 50,
				marginLeft: 10,
				marginRight: 6,
				marginBottom: 15
			}
		} else {
			leftStyle = {
				width: 50,
				marginLeft: 10,
				marginRight: 6,
			};
		}

		const flattenLeftElement = StyleSheet.flatten(styles.leftElement);
		let content = null;

		if (typeof leftElement === 'string') {
			content = (
				<TouchableWithoutFeedback onPress={this.onLeftElementPressed}>
					<Icon name={leftElement} color={flattenLeftElement.color} />
				</TouchableWithoutFeedback>
			);

		} else {

			if (leftElement.props.text == '###icon') {
				content = (
					<TouchableWithoutFeedback onPress={this.onLeftElementPressed}>
						<View>
							<Avatar bgcolor='#cbe3f5' icon='done' iconColor='#0078fd' />
						</View>
					</TouchableWithoutFeedback>
				);
			} else {
				content = (
					<TouchableWithoutFeedback onPress={this.onLeftElementPressed}>
						<View>
							{leftElement}
						</View>
					</TouchableWithoutFeedback>
				);
			}
		}

		return (
			<View style={leftStyle}>
				{content}
			</View>
		);
	}


	renderCenterElement = (styles) => {
		const { centerElement } = this.props;
		let content = null;

		if (React.isValidElement(centerElement)) {
			content = centerElement;
		} else if (centerElement) {
			let primaryText = null;
			let icon = null;
			let secondaryText = null;
			let tertiaryText = null;

			if (typeof centerElement === 'string') {
				primaryText = centerElement;
				content = (
					<View style={styles.textViewContainer}>
						<View style={styles.firstLine}>
							<View style={styles.primaryTextContainer}>
								<Text numberOfLines={1} style={styles.primaryText}>
									{primaryText}
								</Text>
							</View>
						</View>
					</View>);
			} else {
				primaryText = centerElement.primaryElement.primaryText;
				icon = centerElement.primaryElement.icon ? centerElement.primaryElement.icon : null;
				secondaryText = centerElement.secondaryText;
				tertiaryText = centerElement.tertiaryText;

				const numberOfLines = !tertiaryText ?
					getNumberOfSecondaryTextLines(this.state.numberOfLines) : 1;

				if (tertiaryText != null && typeof tertiaryText != undefined) {
					content = (
						<View style={styles.textViewContainer}>
							<View style={styles.firstLine}>
								<View style={{ alignItems: 'center', justifyContent: 'center' }}>
									{this.renderCenterElementIcon(icon)}
								</View>
								<View style={styles.primaryTextContainer}>
									<Text numberOfLines={1} style={styles.primaryText}>
										{primaryText}
									</Text>
								</View>
							</View>
							{secondaryText &&
								<View>
									<Text numberOfLines={numberOfLines} style={styles.tertiaryText}>
										{secondaryText}
									</Text>
								</View>
							}
							{tertiaryText &&
								<View>
									<Text numberOfLines={numberOfLines} style={styles.tertiaryText}>
										{tertiaryText}
									</Text>
								</View>
							}
						</View>
					);
				} else {
					content = (
						<View style={styles.textViewContainer}>
							<View style={[styles.firstLine, { marginBottom: 5 }]}>
								<View style={{ alignItems: 'center', justifyContent: 'center' }}>
									{this.renderCenterElementIcon(icon)}
								</View>
								<View style={styles.primaryTextContainer}>
									<Text numberOfLines={1} style={styles.primaryText}>
										{primaryText}
									</Text>
								</View>
							</View>
							{secondaryText &&
								<View>
									<Text numberOfLines={numberOfLines} style={styles.tertiaryText}>
										{secondaryText}
									</Text>
								</View>
							}
						</View>)
				}
			}
		}


		return (
			<View style={styles.centerElementContainer}>
				{content}
			</View>)
	}

	renderCenterElementIcon = (icon) => {
		if (icon == null) return null;
		let size = 18;
		if (icon == 'headset') {
			size = 16;
		}
		if (icon == 'headset' || icon == 'people')
			return <Icon name={icon} size={size} style={{ color: 'black', marginRight: 5 }} />
		return null;
	}


	renderRightElement = (styles) => {
		const { rightElement, centerElement } = this.props;

		let content = null;

		if (!rightElement) {
			return null;
		}

		let height = null;
		let margin = null;

		if (centerElement.tertiaryText == null || typeof centerElement.tertiaryText === undefined) {
			height = 34;
			margin = 8;
		} else {
			margin = 0;
			height = 42;
		}

		if (React.isValidElement(rightElement)) {
			content = rightElement;
		} else if (rightElement) {

			let upperElement = null;
			let lowerElement = null;

			if (typeof rightElement === 'string') {
				upperElement = rightElement;
			} else {
				upperElement = rightElement.upperElement;
				lowerElement = rightElement.lowerElement;
			}
			const flattenRightElement = StyleSheet.flatten(styles.rightElement);

			if (upperElement && lowerElement) {
				content = (
					<View>
						<Text style={[styles.tertiaryText, { marginTop: margin, height: height - margin, fontSize: 12 }]}>
							{upperElement}
						</Text>
						<View style={{ alignItems: 'flex-end' }}>
							{lowerElement}
						</View>
					</View>);
			} else if (upperElement) {
				content = (
					<View style={{ marginTop: margin }}>
						<Text style={[styles.tertiaryText, { fontSize: 12 }]}>
							{upperElement}
						</Text>
					</View>);
			} else if (lowerElement) {
				content = (
					<View style={{ marginTop: height, alignItems: 'flex-end' }}>
						{lowerElement}
					</View>);
			}
		}


		if (content == null)
			return null;


		return (
			<View style={[styles.rightElementContainer]}>
				{content}
			</View>
		);
	}
	renderDivider = () => {
		const { divider } = this.props;

		if (!divider) {
			return null;
		}

		return <Divider />;
	}
	renderContent = styles => (
		<View style={styles.contentViewContainer}>
			{this.renderLeftElement(styles)}
			{this.renderCenterElement(styles)}
			{this.renderRightElement(styles)}
		</View>
	)
	render() {
		const { onPress } = this.props;
		const styles = getStyles(this.props, this.context, this.state);

		// renders left element, center element and right element
		let content = this.renderContent(styles);

		if (onPress) {
			content = (
				<RippleFeedback delayPressIn={50} onPress={this.onListItemPressed}>
					{content}
				</RippleFeedback>
			);
		}
		return (
			<View>
				<View style={styles.container}>
					{content}
				</View>
				{this.renderDivider()}
			</View>
		);
	}
}

ListItem.propTypes = propTypes;
ListItem.defaultProps = defaultProps;
ListItem.contextTypes = contextTypes;

export default ListItem;