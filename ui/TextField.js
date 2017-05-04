
import React, { Component, PropTypes } from "react";
import { View, TextInput, StyleSheet } from "react-native";

import Underline from './utils/Underline.js';
import FloatingLabel from './utils/FloatingLabel.js';

const propTypes = {
    duration: PropTypes.number,
    label: PropTypes.string,
    highlightColor: PropTypes.string,
    labelColor: PropTypes.string,
    borderColor: PropTypes.string,
    textColor: PropTypes.string,
    textFocusColor: PropTypes.string,
    textBlurColor: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    dense: PropTypes.bool,
    inputStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,
    labelStyle: PropTypes.object,
    multiline: PropTypes.bool,
    autoGrow: PropTypes.bool,
    height: PropTypes.number
};

const defaultProps = {
    duration: 100,
    labelColor: '#b2b2b2',
    borderColor: '#E0E0E0',
    textColor: '#000',
    value: '',
    dense: false,
    underlineColorAndroid: 'rgba(0,0,0,0)',
    multiline: false,
    autoGrow: false,
    height: 40,
};


const styles = StyleSheet.create({
    wrapper: {
        height: 72,
        paddingTop: 30,
        paddingBottom: 7,
    },

    denseWrapper: {
        height: 60,
        paddingTop: 28,
        paddingBottom: 4,
        position: 'relative'
    },

    textInput: {
        fontSize: 16,
        height: 34,
        lineHeight: 34,
        textAlignVertical: 'top'
    },

    denseTextInput: {
        fontSize: 13,
        height: 27,
        lineHeight: 4,
        paddingBottom: 3,
        textAlignVertical: 'top'
    }
});

class TextField extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isFocused: false,
            text: props.value,
            height: props.height
        };
    }

    focus() {
        this.refs.input.focus();
    }
    blur() {
        this.refs.input.blur();
    }
    isFocused() {
        return this.state.isFocused;
    }
    measureLayout(...args) {
        this.refs.wrapper.measureLayout(...args)
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.text !== nextProps.value) {
            nextProps.value.length !== 0 ?
                this.refs.floatingLabel.floatLabel()
                : this.refs.floatingLabel.sinkLabel();
            this.setState({ text: nextProps.value });
        }
        if (this.props.height !== nextProps.height) {
            this.setState({ height: nextProps.height });
        }
    }
    render() {
        let {
            label,
            highlightColor,
            duration,
            labelColor,
            borderColor,
            textColor,
            textFocusColor,
            textBlurColor,
            onFocus,
            onBlur,
            onChange,
            onChangeText,
            value,
            dense,
            inputStyle,
            wrapperStyle,
            labelStyle,
            height,
            autoGrow,
            multiline,
            ...props
        } = this.props;

        return (
            <View style={[dense ? styles.denseWrapper : styles.wrapper, this.state.height ? { height: undefined } : {}, wrapperStyle]} ref="wrapper">
                <TextInput
                    style={[dense ? styles.denseTextInput : styles.textInput, {
                        color: textColor
                    }, (this.state.isFocused && textFocusColor) ? {
                        color: textFocusColor
                    } : {}, (!this.state.isFocused && textBlurColor) ? {
                        color: textBlurColor
                    } : {}, inputStyle, this.state.height ? { height: this.state.height } : {}, { paddingLeft: 1, paddingTop: 10, paddingBottom: 10 }]}
                    multiline={false}
                    autoCapitalize={'sentences'}
                    onFocus={() => {
                        this.setState({ isFocused: true });
                        this.refs.floatingLabel.floatLabel();
                        this.refs.underline.expandLine();
                        onFocus && onFocus();
                    }}
                    onBlur={() => {
                        this.setState({ isFocused: false });
                        !this.state.text.length && this.refs.floatingLabel.sinkLabel();
                        this.refs.underline.shrinkLine();
                        onBlur && onBlur();
                    }}
                    onChangeText={(text) => {
                        this.setState({ text: text });
                        onChangeText && onChangeText(text);
                    }}

                    onChange={(event) => {
                        if (autoGrow) {
                            this.setState({ height: event.nativeEvent.contentSize.height });
                        }
                        onChange && onChange(event);
                    }}
                    ref="input"
                    value={this.state.text}
                    {...props}
                />

                
                <Underline
                    ref="underline"
                    highlightColor={highlightColor}
                    duration={duration}
                    borderColor={borderColor}
                />
                <FloatingLabel
                    isFocused={this.state.isFocused}
                    ref="floatingLabel"
                    focusHandler={this.focus.bind(this)}
                    label={label}
                    labelColor={labelColor}
                    highlightColor={highlightColor}
                    duration={duration}
                    dense={dense}
                    hasValue={(this.state.text.length) ? true : false}
                    style={labelStyle}
                />
            </View>
        );
    }
}

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;

