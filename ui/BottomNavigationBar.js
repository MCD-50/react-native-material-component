import React, { PropTypes, PureComponent } from 'react';
import { View, Platform, Animated, Easing, StyleSheet } from 'react-native';

import BottomNavigationAction from './BottomNavigationAction.react';

const propTypes = {
	active: PropTypes.string,
	children: PropTypes.node.isRequired,
	hidden: PropTypes.bool,
	style: PropTypes.shape({
		container: View.propTypes.style,
	}),
};
const defaultProps = {
	hidden: false,
	style: {},
};
const contextTypes = {
	uiTheme: PropTypes.object.isRequired,
};

function getStyles(props, context) {
	const { bottomNavigation } = context.uiTheme;
	const local = {};

	return {
		container: [
			bottomNavigation.container,
			local.container,
			props.style.container,
		],
	};
}

class BottomNavigationBar extends PureComponent {
	constructor(props, context) {
		super(props, context);

		this.state = {
			styles: getStyles(props, context),
			moveAnimated: new Animated.Value(0),
		};
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.style !== this.props.style) {
			this.setState({ styles: getStyles(nextProps, this.context) });
		}

		if (nextProps.hidden !== this.props.hidden) {
			if (nextProps.hidden === true) {
				this.hide();
			} else {
				this.show();
			}
		}
	}
	show = () => {
		Animated.timing(this.state.moveAnimated, {
			toValue: 0,
			duration: 225,
			easing: Easing.bezier(0.0, 0.0, 0.2, 1),
			useNativeDriver: Platform.OS === 'android',
		}).start();
	}
	hide = () => {
		const { moveAnimated, styles } = this.state;

		Animated.timing(moveAnimated, {
			toValue: StyleSheet.flatten(styles.container).height,
			duration: 195,
			easing: Easing.bezier(0.4, 0.0, 0.6, 1),
			useNativeDriver: Platform.OS === 'android',
		}).start();
	}
	render() {
		const { active, children } = this.props;
		const { styles } = this.state;

		return (
			<Animated.View
				style={[styles.container, {
					transform: [{
						translateY: this.state.moveAnimated,
					}],
				}]}>
				{React.Children.map(
					children,
					child => React.cloneElement(child, {
						...child.props,
						active: child.key === active,
					}),
				)}
			</Animated.View>
		);
	}
}

BottomNavigationBar.propTypes = propTypes;
BottomNavigationBar.defaultProps = defaultProps;
BottomNavigationBar.contextTypes = contextTypes;
BottomNavigationBar.Action = BottomNavigationAction;

export default BottomNavigationBar;