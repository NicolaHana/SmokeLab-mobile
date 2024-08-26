import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import Constants from './Constants';

export default ToastConfig = {

    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftWidth: 0, height: null, paddingVertical: 12, marginTop: 12, minHeight: 36, borderRadius: 7, backgroundColor: 'rgba(22,22,22,1)' }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            text1NumberOfLines={1}
            text1Style={{
                fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                fontWeight: '600',
                fontSize: Constants.FONT_SIZE.FT16,
                color: 'rgba(255,255,255,1)'
            }}
            text2NumberOfLines={0}
            text2Style={{
                fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                fontWeight: '600',
                fontSize: Constants.FONT_SIZE.FT16,
                color: 'rgba(255,255,255,1)'
            }}
        />
    ),
    error: (props) => (
        <ErrorToast
            {...props}
            style={{ borderLeftWidth: 0, height: null, paddingVertical: 12, marginTop: 12, minHeight: 36, borderRadius: 6, backgroundColor: '#CD190E' }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            text1NumberOfLines={1}
            text1Style={{
                fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                fontWeight: '600',
                fontSize: Constants.FONT_SIZE.FT16,
                color: 'rgba(255,255,255,1)'
            }}
            text2NumberOfLines={0}
            text2Style={{
                fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                fontWeight: '600',
                fontSize: Constants.FONT_SIZE.FT16,
                color: 'rgba(255,255,255,1)'
            }}
        />
    ),
    info: (props) => (
        <InfoToast
            {...props}
            style={{ borderLeftWidth: 0, height: null, paddingVertical: 12, marginTop: 12, minHeight: 36, borderRadius: 7, backgroundColor: 'rgba(98,98,98,1)' }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            text1NumberOfLines={1}
            text1Style={{
                fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                fontWeight: '600',
                fontSize: Constants.FONT_SIZE.FT16,
                color: 'rgba(255,255,255,1)'
            }}
            text2NumberOfLines={0}
            text2Style={{
                fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                fontWeight: '600',
                fontSize: Constants.FONT_SIZE.FT16,
                color: 'rgba(255,255,255,1)'
            }}
        />
    ),
    custom: ({ text1, props }) => (
        <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
            <Text>{text1}</Text>
            <Text>{props.uuid}</Text>
        </View>
    )

}