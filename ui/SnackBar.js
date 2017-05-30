'use strict';

import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableNativeFeedback, TouchableOpacity, Platform, Animated, Easing } from 'react-native';


const defaultProps = {
	accentColor: "#ff4500",
	messageColor: "#FFFFFF",
	backgroundColor: "#484848"
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		paddingLeft: 24,
		paddingRight: 24,
		paddingTop: 14,
		paddingBottom: 14
	},
	text_msg: {
		fontSize: 14,
		flex: 1
	},
	action_text: {
		fontSize: 14,
		fontWeight: '600'
	}
});

const easing_values = {
	entry: Easing.bezier(0.0, 0.0, 0.2, 1),
	exit: Easing.bezier(0.4, 0.0, 1, 1)
}

const duration_values = {
	entry: 200,
	exit: 200
}

class SnackBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			translateValue: new Animated.Value(0),
			hideDistance: 9999
		};
	}

	render() {
		return (
			<Animated.View style={[styles.container, { backgroundColor: this.props.backgroundColor, bottom: this.state.translateValue.interpolate({ inputRange: [0, 1], outputRange: [this.state.hideDistance * -1, 0] }) }]} onLayout={(event) => { this.setState({ hideDistance: event.nativeEvent.layout.height }); }}>
				<Text style={[styles.text_msg, { color: this.props.messageColor }]}>{this.props.textMessage}</Text>
				{this.props.actionHandler && this.props.actionText && Platform.OS === 'android' &&
					<TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()} onPress={() => { this.props.actionHandler() }} >
						<Text style={[styles.action_text, { color: this.props.accentColor }]}>{this.props.actionText.toUpperCase()}</Text>
					</TouchableNativeFeedback>
				}
				{this.props.actionHandler && this.props.actionText && Platform.OS === 'ios' &&
					<TouchableOpacity onPress={() => { this.props.actionHandler() }} >
						<Text style={[styles.action_text, { color: this.props.accentColor }]}>{this.props.actionText.toUpperCase()}</Text>
					</TouchableOpacity>
				}
			</Animated.View>
		);
	}

	componentDidMount() {
		if (this.props.visible) {
			this.state.translateValue.setValue(1);
		}
		else {
			this.state.translateValue.setValue(0);
		}
	}

	componentWillReceiveProps(nextProps) {
		if ((nextProps.visible) && (!this.props.visible)) {
			Animated.timing(
				this.state.translateValue,
				{
					duration: duration_values.entry,
					toValue: 1,
					easing: easing_values.entry
				}
			).start();
		}
		else if ((!nextProps.visible) && (this.props.visible)) {
			Animated.timing(
				this.state.translateValue,
				{
					duration: duration_values.exit,
					toValue: 0,
					easing: easing_values.exit
				}
			).start();
		}
	}

}

SnackBar.defaultProps = defaultProps;

export default SnackBar;