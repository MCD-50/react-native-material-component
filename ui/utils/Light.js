import Color from 'color';
import {
  blue500,
  red500,
  white,
  black,
} from './Colors.js';

import Spacing from './Spacing.js';
import Typography from './Typography.js';

const TEXTBOLDPRICOLOR = '#212121';
const TEXTGRAYSECCOLOR = '#8F8F8F'
const PRICOLOR = '#0086ff';
const ACCENTCOLOR = '#ff4500';

export default {
    Spacing,
    Typography,
    
    palette: {
        primaryColor: PRICOLOR,
        accentColor: ACCENTCOLOR,
        primaryTextColor: TEXTBOLDPRICOLOR,
        secondaryTextColor: TEXTGRAYSECCOLOR,
        alternateTextColor: 'white',
        
        canvasColor: white,
        
        borderColor: Color(black).alpha(.12).toString(),
        
        disabledColor: Color(black).alpha(.38).toString(),
        disabledTextColor: Color(black).alpha(.26).toString(),
        activeIcon: Color(black).alpha(.54).toString(),
        inactiveIcon: Color(black).alpha(.38).toString(),

        listItemPrimaryTextColor:'black',
        listItemSecondaryTextColor:'#b2b2b2',
    },
};