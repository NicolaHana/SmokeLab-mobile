const THEME = {

    get COLOR() {

        return {
            PRIMARY: global.theme === 'light' ? '#900603' : '#900603',

            GRAIDENT_DARK: global.theme === 'light' ? '#900603' : '#900603',
            GRAIDENT_LIGHT: global.theme === 'light' ? '#a63835' : '#a63835',
            DESTRUCTIVE: global.theme === 'light' ? '#c01111' : '#c01111',

            TRANSPARENT: global.theme === 'light' ? 'transparent' : 'transparent',
            WHITE: global.theme === 'light' ? '#FFF' : '#FFF',
            BLACK: global.theme === 'light' ? '#000' : '#000',

            // SECONDARY: global.theme === 'light' ? '#4c434a' : '#4c434a',

            BACKGROUND_100: global.theme === 'light' ? '#FFF' : '#000',
            // BACKGROUND_200: global.theme === 'light' ? '#f4f5f7' : '#f4f5f7',
            // BACKGROUND_300: global.theme === 'light' ? '#c0111133' : '#c0111133',

            TEXT_100: global.theme === 'light' ? '#000000' : '#FFF',
            TEXT_200: global.theme === 'light' ? '#565656' : '#989898',
            TEXT_300: global.theme === 'light' ? '#989898' : '#b2b2b2',
            // TEXT_400: global.theme === 'light' ? '#565656' : '#FFF',

            SEPERATOR: global.theme === 'light' ? '#d0d2d4' : '#989898',

            TEXT_INPUT_BORDER: global.theme === 'light' ? '#c0c2c4' : '#e2e2e2',
            TEXT_INPUT_PLACEHOLDER: global.theme === 'light' ? '#565656' : '#646464',
            TEXT_INPUT_LABEL: global.theme === 'light' ? '#323232' : '#e2e2e2',
            TEXT_INPUT_TEXT: global.theme === 'light' ? '#000' : '#FFF',
            TEXT_INPUT_BACKGROUND: global.theme === 'light' ? '#FFF' : '#000',
            TEXT_INPUT_DISABLE_BACKGROUND: global.theme === 'light' ? '#eaeaea' : '#222',
            TEXT_INPUT_SELECTION_COLOR: global.theme === 'light' ? '#000' : '#FFF',

            // FACEBOOK: global.theme === 'light' ? '#1877F2' : '#1877F2',
            // INSTAGRAM: global.theme === 'light' ? '#FA7E1E' : '#FA7E1E',
            // TIKTOK: global.theme === 'light' ? '#000000' : '#000000',

            SHADOW: global.theme === 'light' ? '#000' : '#FFF',
            OVERLAY: global.theme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,25,0.1)',
        }
    },

    get LIGHT_COLOR() {

        return {
            PRIMARY: '#900603',

            GRAIDENT_DARK: '#900603',
            GRAIDENT_LIGHT: '#a63835',
            DESTRUCTIVE: '#c01111',

            TRANSPARENT: 'transparent',
            WHITE: '#FFF',
            BLACK: '#000',

            SECONDARY: '#4c434a',

            BACKGROUND_100: '#FFF',
            BACKGROUND_200: '#f4f5f7',
            BACKGROUND_300: '#c0111133',

            TEXT_100: '#000000',
            TEXT_200: '#565656',
            TEXT_300: '#989898',
            TEXT_400: '#565656',

            SEPERATOR: '#d0d2d4',

            TEXT_INPUT_BORDER: '#c0c2c4',
            TEXT_INPUT_PLACEHOLDER: '#565656',
            TEXT_INPUT_LABEL: '#323232',
            TEXT_INPUT_TEXT: '#000',
            TEXT_INPUT_BACKGROUND: '#FFF',
            TEXT_INPUT_DISABLE_BACKGROUND: '#eaeaea',
            TEXT_INPUT_SELECTION_COLOR: '#000',

            FACEBOOK: '#1877F2',
            INSTAGRAM: '#FA7E1E',
            TIKTOK: '#000000',

            SHADOW: '#000',
            OVERLAY: 'rgba(0,0,0,0.5)',
        }
    },

    get DARK_COLOR() {

        return {
            PRIMARY: '#900603',

            GRAIDENT_DARK: '#900603',
            GRAIDENT_LIGHT: '#a63835',
            DESTRUCTIVE: '#c01111',

            TRANSPARENT: 'transparent',
            WHITE: '#FFF',
            BLACK: '#000',

            SECONDARY: '#4c434a',

            BACKGROUND_100: '#000',
            BACKGROUND_200: '#f4f5f7',
            BACKGROUND_300: '#c0111133',

            TEXT_100: '#FFF',
            TEXT_200: '#989898',
            TEXT_300: '#b2b2b2',
            TEXT_400: '#FFF',

            SEPERATOR: '#989898',

            TEXT_INPUT_BORDER: '#e2e2e2',
            TEXT_INPUT_PLACEHOLDER: '#646464',
            TEXT_INPUT_LABEL: '#e2e2e2',
            TEXT_INPUT_TEXT: '#FFF',
            TEXT_INPUT_BACKGROUND: '#000',
            TEXT_INPUT_DISABLE_BACKGROUND: '#222',
            TEXT_INPUT_SELECTION_COLOR: '#FFF',

            FACEBOOK: '#1877F2',
            INSTAGRAM: '#FA7E1E',
            TIKTOK: '#000000',

            SHADOW: '#FFF',
            OVERLAY: 'rgba(255,255,25,0.1)',
        }
    }

}

export default THEME