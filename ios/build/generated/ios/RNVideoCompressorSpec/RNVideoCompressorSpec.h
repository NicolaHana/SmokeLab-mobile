/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleObjCpp
 *
 * We create an umbrella header (and corresponding implementation) here since
 * Cxx compilation in BUCK has a limitation: source-code producing genrule()s
 * must have a single output. More files => more genrule()s => slower builds.
 */

#ifndef __cplusplus
#error This file must be compiled as Obj-C++. If you are importing it, you must change your file extension to .mm.
#endif
#import <Foundation/Foundation.h>
#import <RCTRequired/RCTRequired.h>
#import <RCTTypeSafety/RCTConvertHelpers.h>
#import <RCTTypeSafety/RCTTypedModuleConstants.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTCxxConvert.h>
#import <React/RCTManagedPointer.h>
#import <ReactCommon/RCTTurboModule.h>
#import <optional>
#import <vector>


@protocol NativeCompressorSpec <RCTBridgeModule, RCTTurboModule>

- (void)image_compress:(NSString *)imagePath
             optionMap:(NSDictionary *)optionMap
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject;
- (void)getImageMetaData:(NSString *)filePath
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject;
- (void)compress:(NSString *)fileUrl
       optionMap:(NSDictionary *)optionMap
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject;
- (void)cancelCompression:(NSString *)uuid;
- (void)getVideoMetaData:(NSString *)filePath
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject;
- (void)activateBackgroundTask:(NSDictionary *)options
                       resolve:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject;
- (void)deactivateBackgroundTask:(NSDictionary *)options
                         resolve:(RCTPromiseResolveBlock)resolve
                          reject:(RCTPromiseRejectBlock)reject;
- (void)compress_audio:(NSString *)fileUrl
             optionMap:(NSDictionary *)optionMap
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject;
- (void)upload:(NSString *)fileUrl
       options:(NSDictionary *)options
       resolve:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject;
- (void)cancelUpload:(NSString *)uuid
     shouldCancelAll:(BOOL)shouldCancelAll;
- (void)download:(NSString *)fileUrl
         options:(NSDictionary *)options
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject;
- (void)generateFilePath:(NSString *)_extension
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject;
- (void)getRealPath:(NSString *)path
               type:(NSString *)type
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject;
- (void)getFileSize:(NSString *)filePath
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject;
- (void)addListener:(NSString *)eventName;
- (void)removeListeners:(double)count;
- (void)createVideoThumbnail:(NSString *)fileUrl
                     options:(NSDictionary *)options
                     resolve:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject;
- (void)clearCache:(NSString * _Nullable)cacheDir
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject;

@end
namespace facebook::react {
  /**
   * ObjC++ class for module 'NativeCompressor'
   */
  class JSI_EXPORT NativeCompressorSpecJSI : public ObjCTurboModule {
  public:
    NativeCompressorSpecJSI(const ObjCTurboModule::InitParams &params);
  };
} // namespace facebook::react

