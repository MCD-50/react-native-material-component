import { View, Picker } from 'react-native';
import React, { PureComponent, PropTypes, } from 'react';
import RippleFeedback from './utils/RippleFeedback.js';

const propTypes = {
	children: PropTypes.node,
	onValueChange: PropTypes.func.isRequired,
	style: PropTypes.object,
	pickerItems: PropTypes.array.isRequired,
};

const defaultProps = {
	style: {

	},
};
const contextTypes = {
	uiTheme: PropTypes.object.isRequired,
};

function getStyles(props) {
	const local = {};

	if (props.fullWidth) {
		local.container = {
			marginHorizontal: 0,
		};
	}

	if (props.background) {
		local.container = {
			...local.container,
			backgroundColor: props.background
		}
	}

	return {
		container: [
			local.container,
			props.style,
		],
	};
}

class Dropdown extends PureComponent {

	constructor(params) {
		super(params);
		this.state = {
			selectedValue: '',
		}
	}

	render() {
		const { onValueChange, pickerItems, children } = this.props;
		const { selectedValue } = this.state;
		const styles = getStyles(this.props);

		const content = (<Picker style={[styles.container]} selectedValue={selectedValue}
			onValueChange={(itemValue, itemIndex) => {
				this.setState({ selectedValue: itemValue })
				this.props.onValueChange(itemValue, itemIndex);
			}}>
			{pickerItems.map(x => <Picker.Item label={x.label} value={x.value} />)}
		</Picker>);

		return content;
	}

}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;
Dropdown.contextTypes = contextTypes;

export default Dropdown;