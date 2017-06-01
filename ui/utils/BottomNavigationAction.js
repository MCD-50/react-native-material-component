import React, { PureComponent, PropTypes } from 'react';
import { StyleSheet, View, Text } from 'react-native';


import RippleFeedback from './RippleFeedback.js';
import Icon from '../Icon.js';


const propTypes = {
	icon: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
	]).isRequired,
	label: PropTypes.string,
	active: PropTypes.bool.isRequired,
	onPress: PropTypes.func,
	style: PropTypes.shape({
		container: View.propTypes.style,
		active: Text.propTypes.style,
		disabled: Text.propTypes.style,
	}),
};

const defaultProps = {
	active: false,
	disabled: false,
	style: {},
};

const contextTypes = {
	uiTheme: PropTypes.object.isRequired,
};

function getStyles(props, context) {
	const { bottomNavigationAction } = context.uiTheme;

	const local = {};

	if (props.active) {
		local.container = bottomNavigationAction.containerActive;
		local.icon = bottomNavigationAction.iconActive;
		local.label = bottomNavigationAction.labelActive;
	}

	if (!props.label) {
		local.container = { paddingTop: 16, paddingBottom: 16 };
	}

	return {
		container: [
			bottomNavigationAction.container,
			local.container,
			props.style.container,
		],
		icon: [
			bottomNavigationAction.icon,
			local.icon,
			props.style.icon,
		],
		label: [
			bottomNavigationAction.label,
			local.label,
			props.style.label,
		],
	};
}

class BottomNavigationAction extends PureComponent {
	renderIcon(icon, styles, color) {
		let element;
		if (React.isValidElement(icon)) {
			// we need icon to change color after it's selected, so we send the color and style to
			// custom element
			element = React.cloneElement(icon, { style: styles.icon, color });
		} else {
			element = <Icon name={icon} style={styles.icon} color={color} />;
		}
		return element;
	}

	render() {
		const { icon, label, onPress } = this.props;

		const styles = getStyles(this.props, this.context);
		const color = StyleSheet.flatten(styles.icon).color;

		const iconElement = this.renderIcon(icon, styles, color);

		return (
			<RippleFeedback onPress={onPress}>
				<View style={styles.container}>
					{iconElement}
					<Text style={styles.label}>{label}</Text>
				</View>
			</RippleFeedback>
		);
	}
}

BottomNavigationAction.propTypes = propTypes;
BottomNavigationAction.defaultProps = defaultProps;
BottomNavigationAction.contextTypes = contextTypes;

export default BottomNavigationAction;