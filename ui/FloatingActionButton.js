import React, { PureComponent, PropTypes } from 'react';
import {
	View,
	Text,
	LayoutAnimation,
	StyleSheet,
	TouchableWithoutFeedback,
	Animated,
	Easing,
	Platform,
} from 'react-native';

import Icon from './Icon.js';
import IconToggle from './IconToggle.js';
import RippleFeedback from './utils/RippleFeedback.js';
import getPlatformElevation from './utils/GetPlatformElevation.js';

const propTypes = {
	actions: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.arrayOf(PropTypes.element),
		PropTypes.arrayOf(PropTypes.shape({
			icon: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.element,
			]),
			label: PropTypes.string,
			name: PropTypes.string,
		})),
	]),
	onPress: PropTypes.func,
	onLongPress: PropTypes.func,
	hidden: PropTypes.bool,
	icon: PropTypes.string,
	transition: PropTypes.oneOf(['toolbar', 'speedDial']),
	style: PropTypes.shape({
		container: View.propTypes.style,
		icon: Text.propTypes.style,
	}),
};
const defaultProps = {
	icon: 'add',
	style: {},
	hidden: false,
};
const contextTypes = {
	uiTheme: PropTypes.object.isRequired,
};

function getStyles(props, context, state) {
	const { actionButton } = context.uiTheme;
	const { size } = props;

	const local = {
		container: {},
	};

	if (size) {
		local.container = {
			height: size,
			width: size,
			borderRadius: size / 2,
		};
	}

	local.container = {
		...local.container,
		...getPlatformElevation(state.elevation),
	};

	return {
		positionContainer: [
			actionButton.positionContainer,
			local.positionContainer,
			props.style.positionContainer,
		],
		toolbarPositionContainer: [
			actionButton.toolbarPositionContainer,
			local.toolbarPositionContainer,
			props.style.toolbarPositionContainer,
		],
		container: [
			actionButton.container,
			local.container,
			props.style.container,
		],
		overlayContainer: [
			actionButton.overlayContainer,
			local.overlayContainer,
			props.style.overlayContainer,
		],
		toolbarContainer: [
			actionButton.toolbarContainer,
			local.toolbarContainer,
			props.style.toolbarContainer,
		],
		toolbarActionContainer: [
			actionButton.toolbarActionContainer,
			local.toolbarActionContainer,
			props.style.toolbarActionContainer,
		],
		speedDialContainer: [
			actionButton.speedDialContainer,
			local.speedDialContainer,
			props.style.speedDialContainer,
		],
		speedDialActionContainer: [
			actionButton.speedDialActionContainer,
			local.speedDialActionContainer,
			props.style.speedDialActionContainer,
		],
		speedDialActionLabel: [
			actionButton.speedDialActionLabel,
			local.speedDialActionLabel,
			props.style.speedDialActionLabel,
		],
		speedDialActionLabelContainer: [
			actionButton.speedDialActionLabelContainer,
			local.speedDialActionLabelContainer,
			props.style.speedDialActionLabelContainer,
		],
		speedDialActionIconContainer: [
			actionButton.speedDialActionIconContainer,
			local.speedDialActionIconContainer,
			props.style.speedDialActionIconContainer,
		],
		speedDialActionIcon: [
			actionButton.speedDialActionIcon,
			local.speedDialActionIcon,
			props.style.speedDialActionIcon,
		],
		icon: [
			actionButton.icon,
			local.icon,
			props.style.icon,
		],
	};
}

class  FloatingActionButton extends PureComponent {
	constructor(props) {
		super(props);

		const scaleValue = props.hidden ? 0.01 : 1;

		this.state = {
			render: 'button',
			elevation: 2,
			scaleValue: new Animated.Value(scaleValue),
		};
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.hidden !== this.props.hidden) {
			if (nextProps.hidden === true) {
				this.hide();
			} else {
				this.show();
			}
		}
	}
	componentWillUpdate(nextProps, nextState) {
		if (this.state.render !== nextState.render) {
			LayoutAnimation.easeInEaseOut();
		}
	}
	onPress = (action) => {
		const { onPress } = this.props;

		this.toggleState();

		if (onPress) {
			onPress(action);
		}
	}
	getActionItemKey = ({ icon, name }) => {
		let key = icon;
		if (name) {
			key = name;
		} else if (React.isValidElement(icon) && icon.key) {
			key = icon.key;
		}
		return key;
	}
	toggleState = () => {
		const { transition } = this.props;

		if (this.state.render === 'button') {
			if (transition) {
				this.setState({ render: transition });
			}
		} else {
			this.setState({ render: 'button' });
		}
	}
	show = () => {
		Animated.timing(this.state.scaleValue, {
			toValue: 1,
			duration: 225,
			easing: Easing.bezier(0.0, 0.0, 0.2, 1),
			useNativeDriver: Platform.OS === 'android',
		}).start();
	}
	hide = () => {
		Animated.timing(this.state.scaleValue, {
			// TODO: why is not 0 here?
			// see: https://github.com/facebook/react-native/issues/10510
			toValue: 0.01,
			duration: 195,
			easing: Easing.bezier(0.4, 0.0, 0.6, 1),
			useNativeDriver: Platform.OS === 'android',
		}).start();
	}
	renderToolbarTransition = (styles) => {
		const { actions } = this.props;

		return (
			<View style={styles.toolbarPositionContainer}>
				<View key="main-button" style={styles.toolbarContainer}>
					{actions.map((action) => {
						if (typeof action === 'string') {
							return this.renderToolbarAction(styles, action);
						}
						if (React.isValidElement(action)) {
							return this.renderToolbarElementAction(styles, action);
						}
						return this.renderToolbarLabelAction(
							styles, action.icon, action.label, action.name);
					})}
				</View>
			</View>
		);
	}
	renderSpeedDialTransition = (styles) => {
		const { actions } = this.props;

		return (
			<View style={[StyleSheet.absoluteFillObject, { flex: 1 }]}>
				<TouchableWithoutFeedback onPress={this.toggleState}>
					<View style={styles.overlayContainer}>
						<View style={[styles.positionContainer, styles.speedDialContainer]}>
							<View style={{ alignItems: 'flex-end', marginBottom: 16 }}>
								{actions.map((action) => {
									if (typeof action === 'string') {
										return this.renderAction(styles, action);
									}

									if (React.isValidElement(action)) {
										return this.renderElementAction(styles, action);
									}

									return this.renderLabelAction(
										styles, action.icon, action.label, action.name);
								})}
							</View>
							{this.renderMainButton(styles)}
						</View>
					</View>
				</TouchableWithoutFeedback>
			</View>
		);
	}
	renderMainButton = (styles) => {
		const { onLongPress, icon } = this.props;
		const { render } = this.state;

		const mainIcon = render !== 'button' ? 'clear' : icon;

		return (
			<View key="main-button" style={styles.container}>
				<RippleFeedback
					color="#AAF"
					onPress={() => this.onPress('main-button')}
					onLongPress={onLongPress}
					onPressIn={() => this.setState({ elevation: 4 })}
					onPressOut={() => this.setState({ elevation: 2 })}
					delayPressIn={20}
				>
					{this.renderIconButton(styles, mainIcon)}
				</RippleFeedback>
			</View>
		);
	}
	renderToolbarAction = (styles, icon, name) => {
		let content;
		const key = this.getActionItemKey({ icon, name });

		if (React.isValidElement(icon)) {
			content = (
				<RippleFeedback
					color="#AAF"
					onPress={() => this.onPress(key)}
					delayPressIn={20}
				>
					{this.renderIconButton(styles, icon)}
				</RippleFeedback>);
		} else {
			content = (
				<IconToggle
					key={key}
					name={key}
					onPress={() => this.onPress(key)}
					style={{ icon: styles.icon }}
				/>);
		}
		return (
			<View key={key} style={styles.toolbarActionContainer}>
				{content}
			</View>
		);
	}
	renderToolbarElementAction = (styles, icon) => {
		const key = this.getActionItemKey({ icon });
		return (
			<View key={key} style={styles.toolbarActionContainer}>
				{this.renderToolbarAction(styles, icon)}
			</View>
		);
	}
	/**
	* TODO: implement labels for toolbar?
	*/
	renderToolbarLabelAction = (styles, icon, label, name) => {
		const key = this.getActionItemKey({ icon, name });
		return (
			<View key={key} style={styles.toolbarActionContainer}>
				{this.renderToolbarAction(styles, icon, name)}
			</View>
		);
	}
	renderAction = (styles, icon, name) => {
		const key = this.getActionItemKey({ icon, name });
		return (
			<View key={key} style={styles.speedDialActionIconContainer}>
				<View style={styles.speedDialActionIcon}>
					<RippleFeedback
						color="#AAF"
						onPress={() => this.onPress(key)}
						delayPressIn={20}
					>
						{this.renderIconButton(styles, icon)}
					</RippleFeedback>
				</View>
			</View>
		);
	}
	renderElementAction = (styles, icon) => {
		const key = this.getActionItemKey({ icon });
		return (
			<View key={key} style={styles.speedDialActionContainer}>
				{this.renderAction(styles, icon)}
			</View>
		);
	}
	renderLabelAction = (styles, icon, label, name) => {
		const key = this.getActionItemKey({ icon, name });
		return (
			<View key={key} style={styles.speedDialActionContainer}>
				<View style={styles.speedDialActionLabelContainer}>
					<Text style={styles.speedDialActionLabel}>{label}</Text>
				</View>
				{this.renderAction(styles, icon, name)}
			</View>
		);
	}
	renderIconButton = (styles, icon) => {
		let result;
		if (React.isValidElement(icon)) {
			result = icon;
		} else {
			result = <Icon name={icon} style={styles.icon} />;
		}
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				{result}
			</View>
		);
	}
	renderButton = styles => (
		<Animated.View
			style={[styles.positionContainer, {
				transform: [{
					scale: this.state.scaleValue,
				}],
			}]}
		>
			{this.renderMainButton(styles)}
		</Animated.View>
	);
	render() {
		const { render } = this.state;

		const styles = getStyles(this.props, this.context, this.state);

		if (render === 'toolbar') {
			return this.renderToolbarTransition(styles);
		} else if (render === 'speedDial') {
			return this.renderSpeedDialTransition(styles);
		}

		return this.renderButton(styles);
	}
}

FloatingActionButton.propTypes = propTypes;
FloatingActionButton.defaultProps = defaultProps;
FloatingActionButton.contextTypes = contextTypes;

export default FloatingActionButton;