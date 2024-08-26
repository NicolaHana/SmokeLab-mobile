import { Dimensions, Platform } from 'react-native';

export default {

    LAYOUT: {
        SCREEN_WIDTH: Dimensions.get('window').width,
        SCREEN_HEIGHT: Dimensions.get('window').height,

        HEADER_HEIGHT: 56,
    },

    ADS: {
        BANNER_AD_UNIT_ID: Platform.OS === 'ios' ? 'ca-app-pub-6093468591464222/1995263165' : 'ca-app-pub-6093468591464222/1803691472',
        INTERSTITIALAD_UNIT_ID: Platform.OS === 'ios' ? 'ca-app-pub-6093468591464222/5742936480' : 'ca-app-pub-6093468591464222/9654261335'
    },

    TERMS_URL: 'https://www.smokelabapp.com/terms',
    PRIVAY_URL: 'https://www.smokelabapp.com/privacy',

    BARCODE_API_KEY: 'e93spaivpzbzsop7c7qjppfbatp5ju',
    EAN_LOOKUP_API_KEY: '0703df08a9msh86c3f8a15fb5714p11c309jsne0174b74ea5e',

    WEATHER_API_KEY: 'edee2fbe134a83d2dad69fabc80175ce',

    KLAVIYO: {
        PUBLIC_API_KEY: 'QUA27f',
        PRIVATE_API_KEY: 'pk_67c78171b0253c0fc7af319cbe19ca3af0'
    },

    ONESIGNAL_APP_ID: '3bca7d86-69fe-4ae5-b4f9-cc47b5c1d792',

    SUBSCRIPTIONS: {
        ITEMS: Platform.select({
            android: [
                'sl_49.99_ul_cooks:unlimited-cooks',
                'sl_6.99_ul_cooks:unlimited-cooks'
            ],
            ios: [
                'sl_49.99_ul_cooks',
                'sl_6.99_ul_cooks',
            ]
        }),
        TIERS: {
            'sl_49.99_ul_cooks:unlimited-cooks': 0,
            'sl_49.99_ul_cooks': 0,

            'sl_6.99_ul_cooks:unlimited-cooks': 1,
            'sl_6.99_ul_cooks': 1,
        }
    },

    ACTIVITY_TYPE: {
        MEAT_ON: 'meat on',
        MOP: 'mop',
        SPRAY: 'spray',
        WRAP: 'wrap',
        UNWRAP: 'unwrap',
        ANY: 'any',
        TEMP: 'temp',
        MEAT_OFF: 'meat off',
    },

    SEARH: {
        MOST_RECENT_COOKS: 'Most recent cooks',
        HIGHEST_RATED_COOKS: 'Highest rated cooks',
        ALL_OF_MY_COOKS: 'All of my cooks',

        MEAT_TYPE: 'Meat type',
        INJECTION: 'Injection',
        RUB: 'Rub',
        WOOD_CHARCOAL: 'Wood/Charcoal',
        ALL_FIELDS: 'All fields',
    },

    FONT_FAMILY: {
        ...Platform.select({
            ios: {
                PRIMARY_LIGHT: 'Inter-Light',
                PRIMARY_REGULAR: 'Inter-Regular',
                PRIMARY_MEDIUM: 'Inter-Medium',
                PRIMARY_SEMIBOLD: 'Inter-SemiBold',
                PRIMARY_BOLD: 'Inter-Bold',
                PRIMARY_BLACK: 'Inter-Black',
            },
            android: {
                PRIMARY_LIGHT: 'Inter-Light',
                PRIMARY_REGULAR: 'Inter-Regular',
                PRIMARY_MEDIUM: 'Inter-Medium',
                PRIMARY_SEMIBOLD: 'Inter-SemiBold',
                PRIMARY_BOLD: 'Inter-Bold',
                PRIMARY_BLACK: 'Inter-Black',
            },
        })
    },

    FONT_SIZE: {
        FT10: Dimensions.get('window').width <= 375 ? 10 : 10,
        FT11: Dimensions.get('window').width <= 375 ? 11 : 11,
        FT12: Dimensions.get('window').width <= 375 ? 12 : 12,
        FT13: Dimensions.get('window').width <= 375 ? 13 : 13,
        FT14: Dimensions.get('window').width <= 375 ? 14 : 14,
        FT15: Dimensions.get('window').width <= 375 ? 15 : 15,
        FT16: Dimensions.get('window').width <= 375 ? 16 : 16,
        FT18: Dimensions.get('window').width <= 375 ? 18 : 18,
        FT17: Dimensions.get('window').width <= 375 ? 17 : 17,
        FT20: Dimensions.get('window').width <= 375 ? 20 : 20,
        FT22: Dimensions.get('window').width <= 375 ? 22 : 22,
        FT24: Dimensions.get('window').width <= 375 ? 24 : 24,
        FT25: Dimensions.get('window').width <= 375 ? 25 : 25,
        FT26: Dimensions.get('window').width <= 375 ? 26 : 26,
        FT28: Dimensions.get('window').width <= 375 ? 28 : 28,
        FT30: Dimensions.get('window').width <= 375 ? 30 : 30,
        FT32: Dimensions.get('window').width <= 375 ? 32 : 32,
        FT34: Dimensions.get('window').width <= 375 ? 34 : 34,
        FT36: Dimensions.get('window').width <= 375 ? 36 : 36,
        FT38: Dimensions.get('window').width <= 375 ? 38 : 38,
        FT40: Dimensions.get('window').width <= 375 ? 40 : 40,
        FT48: Dimensions.get('window').width <= 375 ? 48 : 48,
        FT64: Dimensions.get('window').width <= 375 ? 64 : 64,
    },

    DATE_TIME_FORMAT: 'YYYY-MM-DD hh:mm A',
    DATE_TIME_DISPLAY_FORMAT: 'hh:mm A',
    DATE_FORMAT: 'YYYY-MM-DD',
}