import { useEffect, useCallback, useRef } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import Constants from '../common/Constants';

const SECONDS = 180
const useInterstitialAdWithDelay = () => {
    const timerRef = useRef(null)
    const adRef = useRef(null)
    // const interstitialAdUnitId = TestIds.INTERSTITIAL;
    const interstitialAdUnitId = Constants.ADS.INTERSTITIALAD_UNIT_ID

    const initializeAd = useCallback(() => {
        if (adRef.current) {
            cancelNextAd()
        }
        adRef.current = InterstitialAd.createForAdRequest(interstitialAdUnitId);
        adRef.current.addAdEventListener(AdEventType.LOADED, () => {
            clearTimerRef()

            adRef.current.show();
        });

        adRef.current.addAdEventListener(AdEventType.CLOSED, () => {
            initializeAdWithDelay();
        });

        adRef.current.load();
    }, []);

    const initializeAdWithDelay = useCallback(() => {
        if (adRef.current) {
            cancelNextAd()
        }
        adRef.current = InterstitialAd.createForAdRequest(interstitialAdUnitId);
        adRef.current.addAdEventListener(AdEventType.LOADED, () => {
            clearTimerRef()

            timerRef.current = setTimeout(() => {
                adRef.current.show();
            }, SECONDS * 1000);
        });

        adRef.current.addAdEventListener(AdEventType.CLOSED, () => {
            initializeAdWithDelay();
        });

        adRef.current.load();
    }, []);

    const cancelNextAd = useCallback(() => {
        clearTimerRef()
        clearAdRef()
    }, []);

    const clearTimerRef = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }

    const clearAdRef = () => {
        if (adRef.current) {
            adRef.current.removeAllListeners()
            adRef.current = null
        }
    }

    useEffect(() => {
        return () => { };
    }, []);

    return { initializeAd, initializeAdWithDelay, cancelNextAd };
};

export default useInterstitialAdWithDelay;
