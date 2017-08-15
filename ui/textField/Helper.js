import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
	...StyleSheet.absoluteFillObject,
	paddingVertical: 4,
  },

  text: {
	backgroundColor: 'transparent',
  },
});

export default class Helper extends PureComponent {
  static defaultProps = {
	numberOfLines: 1,
  };

  static propTypes = {
	style: Animated.Text.propTypes.style,
	children: PropTypes.oneOfType([
	  PropTypes.arrayOf(PropTypes.node),
	  PropTypes.node,
	]),
  };

  render() {
	let { children, style, ...props } = this.props;

	return (
	  <View style={styles.container}>
		<Animated.Text style={[styles.text, style]} {...props}>
		  {children}
		</Animated.Text>
	  </View>
	);
  }
}