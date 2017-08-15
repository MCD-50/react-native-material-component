import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  line: {
	position: 'absolute',
	top: -2,
	left: -1.5,
	right: -1.5,
	bottom: 0,
	borderWidth: 1,
  },
});

export default class Line extends PureComponent {
  static propTypes = {
	type: PropTypes.oneOf(['solid', 'dotted', 'dashed']).isRequired,
	color: PropTypes.string.isRequired,
  };

  render() {
	let { color: borderColor, type: borderStyle } = this.props;

	let lineStyle = {
	  borderColor,
	  borderStyle,
	};

	return (
	  <View style={[styles.line, lineStyle]} pointerEvents='none' />
	);
  }
}