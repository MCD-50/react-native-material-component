import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		paddingVertical: 4,
		paddingLeft: 4,
	},

	text: {
		textAlign: 'right',
		backgroundColor: 'transparent',
	},
});

export default class Counter extends PureComponent {
	static propTypes = {
		count: PropTypes.number.isRequired,
		limit: PropTypes.number,

		fontSize: PropTypes.number,

		baseColor: PropTypes.string.isRequired,
		errorColor: PropTypes.string.isRequired,

		style: Text.propTypes.style,
	};

	render() {
		let { count, limit, baseColor, errorColor, fontSize, style } = this.props;

		let textStyle = {
			color: count > limit ? errorColor : baseColor,
			fontSize,
		};

		if (!limit) {
			return null;
		}

		return (
			<View style={styles.container}>
				<Text style={[styles.text, style, textStyle]}>
					{count} / {limit}
				</Text>
			</View>
		);
	}
}