// AdsContext.js
import React, { createContext,  useCallback,  useContext, useEffect, useRef, useState } from 'react';
import { AppState  } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import Constants from '../common/Constants';

const AdsContext = createContext();
// const interstitialAdUnitId = TestIds.INTERSTITIAL;
const interstitialAdUnitId = Constants.ADS.INTERSTITIALAD_UNIT_ID

const time = 30*60*1000

export const AdsProvider = ({ children }) => {
    const [appState, setAppState] = useState(AppState.currentState);
    const [backgroundTime, setBackgroundTime] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const adRef = useRef(null);

    const showAds = useCallback(() => {
        if (adRef.current && isLoaded) {
            if (global.isFirstAd || elapsedTime > time) {
                adRef.current.show();
                global.isFirstAd = false;
            } 
            setElapsedTime(0)
        } 
    }, [adRef.current, isLoaded, elapsedTime]);

    const clearAds = useCallback(() => {
        if (adRef.current) {
            adRef.current.removeAllListeners();
            adRef.current = null;
            setIsLoaded(false);
        }
    }, [adRef.current]);

    const loadAds = useCallback(() => {
        adRef.current = InterstitialAd.createForAdRequest(interstitialAdUnitId);
        adRef.current.addAdEventListener(AdEventType.LOADED, () => {
            setIsLoaded(true)
        });

        adRef.current.addAdEventListener(AdEventType.CLOSED, () => {
            clearAds();
        });

        adRef.current.load();
    }, [clearAds]);

    useEffect(() => {
        if (!adRef.current) {
            loadAds();
        }
        
        return () => { 
            clearAds();
        };
    }, [adRef.current]);

    useEffect(() => {
      const handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background') {
          setBackgroundTime(Date.now());
        } else if (appState === 'background' && nextAppState === 'active') {
          const backgroundDuration = Date.now() - backgroundTime;
          setElapsedTime(backgroundDuration);
          setBackgroundTime(0);
        }
        setAppState(nextAppState);
      };
  
      AppState.addEventListener('change', handleAppStateChange);
    }, [backgroundTime, appState]);

    return (
        <AdsContext.Provider value={{ showAds }}>
            {children}
        </AdsContext.Provider>
    );
};

export const useAdsContext = () => useContext(AdsContext);