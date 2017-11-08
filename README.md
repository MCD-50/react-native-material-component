
# React Native Material Component (iOS and Android supported)

# Getting Started
```bash
$ npm i react-native-material-component --save

if there is any unmet peer dependency run
$ npm i react-native-vector-icons --save
```

## Setting of vector icons
You can see [this repo](https://github.com/oblador/react-native-vector-icons) for much more information.

### React Native Link (recommended)
> Make sure you have atleast v0.31.0 react-native version.

```bash
$ react-native link react-native-vector-icons
```

### Manual Installation

#### Android (see [original](https://github.com/oblador/react-native-vector-icons#android))
Copy the `MaterialIcons` font file from [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons#android) to your local working directory:

`./node_modules/react-native-vector-icons/Fonts/MaterialIcons.ttf` -> `./android/app/src/main/assets/fonts`.

#### iOS (see [original](https://github.com/oblador/react-native-vector-icons#ios))

# Usage

To achieve the level of customizability, React Native Material UI is using a single JS object called uiTheme that is passed in via context. By default, this uiTheme object is based on the lightTheme that you can find [here](https://github.com/mcd-50/react-native-material-component/blob/master/ui/Light.js). So, you can change almost everything very easily.

The uiTheme object contains the following keys:

	spacing: {} // can be used to change the spacing of components.
	fontFamily: {} // can be used to change the default font family.
	palette: {  // can be used to change the color of components.
        primaryColor: blue500,
        accentColor: red500,
        ...
	}
	typography: {} // can be used to change the typography of components
	// you can change style of every each component
	avatar: {}
	button: {}
	toolbar: {}
	...


```js
import React, { Component } from 'react';
import { Navigator, NativeModules } from 'react-native';

import { Color, ThemeProvider } from '../react-native-material-component';

// you can set your style right here, it'll be propagated to application
const uiTheme = {
    palette: {
        primaryColor: Color.green500,
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
};

class Main extends Component {
    render() {
        return (
            <ThemeProvider uiTheme={uiTheme}>
                <App />
            </ThemeProvider>
        );
    }
}
```
**It means, if you want to change primary color of your application for example. You can just pass to ThemeProvider object with your own settings.** Your settings will be merged with default theme.

## What else?
Another great feature is, you can use the `uiTheme` everywhere. Even in your own components. Look how you can get the primary color.

```js
import ...

const contextTypes = {
    uiTheme: PropTypes.object.isRequired,
};

class MyButton extends Component {
    render() {
	    // it's really easy to get primary color everywhere in your app
        const { primaryColor } = this.context.uiTheme.palette;
        return ...
    }
}

export ...
```

# Animations are included

Note: You have to allow the animations for Android ([see React Native's documentation](http://facebook.github.io/react-native/releases/0.33/docs/animations.html#layoutanimation))
```js
UIManager.setLayoutAnimationEnabledExperimental && 
UIManager.setLayoutAnimationEnabledExperimental(true);
```

# Components

Here is a list of all component included in this library. (I'm working on documentation for every each component. Be patient please :))

- Avatar
- Badge
- AutoGrowTextInput
- Card
- Checkbox
- Divider
- Icon
- ListItem
- Progress
- SwipeListView
- Toolbar
- Toast
- TextField
- Dropdown
- RippleFeedback
- FloatingActionButton
- BottomNavigationBar
- SnackBar