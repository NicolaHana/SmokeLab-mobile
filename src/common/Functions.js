import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, collection, getDoc } from 'firebase/firestore/lite';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import moment from 'moment';
import Constants from './Constants';
import { CommonActions } from '@react-navigation/native';

const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage();

export const presentAlertMessage = ({ title = null, message = null }) => {
  Alert.alert(title, message);
};

export const presentToastMessage = ({
  type,
  position,
  title = null,
  message,
}) => {
  Toast.show({
    type: type,
    position: position,
    text1: title,
    text2: message,
  });
};

export const uploadFileToStorage = async (destinationPath, sourcePath) => {
  const storageReference = ref(storage, destinationPath);
  try {
    const response = await fetch(sourcePath);
    const blob = await response.blob();

    await uploadBytes(storageReference, blob, { contentType: 'image/jpeg' });
    const downloadURL = await getDownloadURL(storageReference);

    return downloadURL;
  } catch (error) {
    console.error('uploadFileToStorage:', error);
    throw error;
  }
};

export const getLoggedInUser = async () => {
  try {
    const documentSnapShot = await getDoc(
      doc(collection(firestore, 'live_users'), auth.currentUser.uid),
    );
    if (documentSnapShot.exists()) {
      return documentSnapShot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('getLoggedInUser:', error);
    throw error;
  }
};

export const capitalizeWords = str => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getDuration = ({ fromTime, toTime }) => {
  var duration = moment.duration(moment(toTime).diff(moment(fromTime)));

  var hours = duration.asHours();
  hours = Number(hours) % 60;

  var minutes = duration.asMinutes();
  minutes = Number(minutes) % 60;

  hours = Math.floor(hours);
  minutes = Math.floor(minutes);

  const hoursLabel =
    hours > 0 ? hours + (hours === 1 ? ' Hour ' : ' Hours ') : '';
  const minutesLabel =
    minutes > 0 ? minutes + (minutes === 1 ? ' Minute' : ' Minutes') : '';

  return { duration: duration.asSeconds(), label: hoursLabel + minutesLabel };
};

export const getActiveSubscription = customerInfo => {
  const checkProductValid = productIdentifier => {
    if (
      moment(customerInfo.allExpirationDates[productIdentifier]).isAfter(
        moment(),
      )
    ) {
      return true;
    } else {
      return false;
    }
  };
  let purchasedProductIdentifier = null;
  let purchasedDate = null;
  let expirationDate = null;
  let pruchasedPlatform = null;

  if (customerInfo.activeSubscriptions.length == 0) {
    return null;
  } else if (customerInfo.activeSubscriptions.length == 1) {
    const productIdentifier = customerInfo.activeSubscriptions[0];
    if (checkProductValid(productIdentifier)) {
      purchasedProductIdentifier = productIdentifier;
    } else {
      return null;
    }
  } else {
    let allPurchaseDates = customerInfo.allPurchaseDates;

    var reversed = {};
    const purchasedDates = [];
    Object.keys(allPurchaseDates).forEach(key => {
      reversed[allPurchaseDates[key]] = key;
      purchasedDates.push(allPurchaseDates[key]);
    });
    purchasedDates.sort();
    purchasedDates.reverse();

    var productIdentifier = null;
    for (let i = 0; i < purchasedDates.length; i++) {
      const purchasedDate = purchasedDates[i];
      if (checkProductValid(reversed[purchasedDate])) {
        productIdentifier = reversed[purchasedDate];
        productPurchaseDate = purchasedDate;
        break;
      }
    }
    purchasedProductIdentifier = productIdentifier;
  }
  if (purchasedProductIdentifier) {
    const entitlementIdentifier =
      Constants.SUBSCRIPTIONS.TIERS[purchasedProductIdentifier] == 0
        ? 'Unlimited cooks'
        : Constants.SUBSCRIPTIONS.TIERS[purchasedProductIdentifier] == 1
          ? 'Unlimited cooks'
          : '';
    const subscriptionTier =
      Constants.SUBSCRIPTIONS.TIERS[purchasedProductIdentifier] == 0
        ? 'Unlimited'
        : Constants.SUBSCRIPTIONS.TIERS[purchasedProductIdentifier] == 1
          ? 'Unlimited'
          : '';

    if (customerInfo.entitlements.active[entitlementIdentifier]) {
      purchasedDate =
        customerInfo.entitlements.active[entitlementIdentifier]
          .latestPurchaseDate;
      expirationDate =
        customerInfo.entitlements.active[entitlementIdentifier].expirationDate;

      switch (customerInfo.entitlements.active[entitlementIdentifier].store) {
        case 'APP_STORE':
          pruchasedPlatform = 'ios';
          break;
        case 'PLAY_STORE':
          pruchasedPlatform = 'android';
          break;
        case 'STRIPE':
          pruchasedPlatform = 'web';
          break;
        case 'PROMOTIONAL':
          pruchasedPlatform = 'admin';
          break;
        default:
          pruchasedPlatform = '';
          break;
      }
      const activeSubscription = {
        product_identifier: purchasedProductIdentifier,
        purchased_date: purchasedDate,
        expiration_date: expirationDate,
        purchased_platform: pruchasedPlatform,
        subscription_tier: subscriptionTier,
      };
      return activeSubscription;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const navigateAndReset = ({ navigation, tabNavigator, rootScreen }) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: tabNavigator,
          state: {
            type: 'tab',
            index: 0,
            routes: [{ name: rootScreen }],
          },
        },
      ],
    }),
  );
};

export const convertActivityTimeToDate = activityTime => {
  //   return moment(
  //     `${moment().format('YYYY-MM-DD')} ${activityTime
  //       .replace(' AM', '')
  //       .replace(' PM', '')}`,
  //     'YYYY-MM-DD HH:mm',
  //   );
  return moment(activityTime ?? new Date().getTime());
};
