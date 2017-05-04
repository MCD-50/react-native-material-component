/* eslint-disable import/no-unresolved, import/extensions */
import { StyleSheet, Text, View } from 'react-native';
import React, { PureComponent, PropTypes } from 'react';
/* eslint-enable import/no-unresolved, import/extensions */
import IconToggle from './IconToggle.js';
import RippleFeedback from './utils/RippleFeedback.js';

const propTypes = {
	label: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	checked: PropTypes.bool,
	disabled: PropTypes.bool,
	uncheckedIcon: PropTypes.string,
	checkedIcon: PropTypes.string,
	onCheck: PropTypes.func,
};

const defaultProps = {
	checkedIcon: 'check-box',
	uncheckedIcon: 'check-box-outline-blank',
	disabled: false,
	style: {},
};

const contextTypes = {
	uiTheme: PropTypes.object.isRequired,
};

function getStyles(props, context) {
	const { checkbox, palette } = context.uiTheme;
	const { disabled } = props;

	const local = {};
	return {
		container: [
			checkbox.container,
			local.container,
			props.style.container,
		],
		icon: [
			checkbox.icon,
			props.style.icon,
		],
		label: [
			checkbox.label,
			local.label,
			props.style.label,
			// disabled has the highest priority
			disabled && { color: palette.disabledTextColor },
		],
	};
}

class Checkbox extends PureComponent {
	onPress = () => {
		const { checked, disabled, onCheck, value } = this.props;

		if (!disabled && onCheck) {
			onCheck(!checked, value);
		}
	}
	render() {
		const { checked, checkedIcon, uncheckedIcon, disabled, value } = this.props;

		const styles = getStyles(this.props, this.context);

		const labelColor = StyleSheet.flatten(styles.label).color;
		const iconColor = StyleSheet.flatten(styles.icon).color;

		const content = (
			<View style={styles.container}>
				<Text style={[styles.label, {fontSize:16}]}>
					{this.props.label}
				</Text>
				<IconToggle
					key={`${value}-${checked}`}
					name={checked ? checkedIcon : uncheckedIcon}
					disabled={disabled}
					color={checked ? iconColor : labelColor}
					onPress={this.onPress}
				/>
			</View>
		);

		if (disabled) {
			return content;
		}

		return (
			<RippleFeedback onPress={this.onPress}>
				{content}
			</RippleFeedback>
		);
	}
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;
Checkbox.contextTypes = contextTypes;

export default Checkbox;