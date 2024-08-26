import React, { useEffect } from 'react'
import { View } from 'react-native';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import Constants from '../common/Constants';
import { AppEventsLogger, Settings } from 'react-native-fbsdk-next';

const BannerAdsView = ({ onAdLoaded, onAdFailedToLoad }) => {
    // const bannerAdUnitId = TestIds.BANNER;
    const bannerAdUnitId = Constants.ADS.BANNER_AD_UNIT_ID
    useEffect(() => {}, []);
    return (
        <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, position: 'absolute', bottom: 0, alignItems: 'center' }}>
            <BannerAd
                unitId={bannerAdUnitId}
                size={BannerAdSize.BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                onAdLoaded={onAdLoaded}
                onAdFailedToLoad={onAdFailedToLoad}
            />
        </View>
    )
}

export default BannerAdsView;