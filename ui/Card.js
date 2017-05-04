import { View } from 'react-native';
import React, { PureComponent, PropTypes } from 'react';
import RippleFeedback from './utils/RippleFeedback.js';

const propTypes = {
	children: PropTypes.node,
	onPress: PropTypes.func,
	style: PropTypes.object,
};
const defaultProps = {
	style: {
	},
};
const contextTypes = {
	uiTheme: PropTypes.object.isRequired,
};

function getStyles(props, context) {
	const { card } = context.uiTheme;

	const local = {};
	
	if (props.fullWidth) {
		local.container = {
			marginHorizontal: 0,
		};
	}

	if(props.background){
		local.container = {
			...local.container,
			backgroundColor: props.background
		}
	}


	return {
		container: [
			card.container,
			local.container,
			props.style,
		],
	};
}

class Card extends PureComponent {
	
	render() {
		
		const { onPress, children } = this.props;

		const styles = getStyles(this.props, this.context);

		const content = (
			<View style={[styles.container]}>
				{children}
			</View>
		);

		if (onPress) {
			return (
				<RippleFeedback onPress={onPress}>
					{content}
				</RippleFeedback>
			);
		}

		return content;
	}

}

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;
Card.contextTypes = contextTypes;

export default Card;