// #import "AppDelegate.h"
//
// #import <OneSignalFramework/OneSignalFramework.h>
// #import <React/RCTRootView.h>
// #import <React/RCTBundleURLProvider.h>
// #import "Orientation.h"
// #import <AuthenticationServices/AuthenticationServices.h>
// #import <SafariServices/SafariServices.h>
// #import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
// #import <React/RCTLinkingManager.h> // <- Add This Import




//
// @implementation AppDelegate
//
//- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
//{
//#if DEBUG
//  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" ];
//#else
//  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//#endif
//}
//
// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
// {
//   self.moduleName = @"Smokelab";
//   self.initialProps = @{};
//
//   // Facebook SDK initialization
//   [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
//
//   // OneSignal initialization code
//   [OneSignal.Debug setLogLevel:ONE_S_LL_VERBOSE];
//   [OneSignal initialize:@"3bca7d86-69fe-4ae5-b4f9-cc47b5c1d792" withLaunchOptions:launchOptions];
//   [OneSignal.Notifications requestPermission:^(BOOL accepted) {
//       NSLog(@"User accepted notifications: %d", accepted);
//   } fallbackToSettings:true];
//
//   return [super application:application didFinishLaunchingWithOptions:launchOptions];
// }
//
////- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
////{
////#if DEBUG
////  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" ];
////#else
////  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
////#endif
////}
//
// - (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
//   return [Orientation getOrientation];
// }
//
// - (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//   if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
//     return YES;
//   }
//   if ([RCTLinkingManager application:app openURL:url options:options]) {
//     return YES;
//   }
//   return NO;
// }
//
// @end
//
//



 


/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import <AuthenticationServices/AuthenticationServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h> // <- Add This Import
#import <React/RCTLinkingManager.h> // <- Add This Import

#import "Orientation.h"
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions]; // <- add this
  [[FBSDKAppEvents shared] activateApp]; // <- Add This Line
  [FIRApp configure];

  NSURL *jsCodeLocation;
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.js"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Smokelab"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  // JG: Configure the scaled image for the background
  CGRect bounds = [UIScreen mainScreen].bounds;
  UIGraphicsBeginImageContext(bounds.size);
  [[UIImage imageNamed:@"bg"] drawInRect:bounds];
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();

  self.window = [[UIWindow alloc] initWithFrame:bounds];

  // JG: Set the background image
  self.window.backgroundColor = [UIColor colorWithPatternImage:image];

  // JG: Set the rootView background color to opaque
  rootView.backgroundColor = [UIColor colorWithWhite:1 alpha:0];

  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  if (@available(iOS 13, *)) {
    self.window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
  }

  if (@available(iOS 13.0, *)) {
    rootView.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
  }
  if (@available(iOS 13, *)) {
    self.window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
  }

  if (@available(iOS 14, *)) {
    UIDatePicker *picker = [UIDatePicker appearance];
    picker.preferredDatePickerStyle = UIDatePickerStyleWheels;
  }

  return YES;
}

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }

  if ([RCTLinkingManager application:app openURL:url options:options]) {
    return YES;
  }

  return NO;
}

//- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
//  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
//}
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
//fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
//  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
//}
//- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
//  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
//}
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

@end
