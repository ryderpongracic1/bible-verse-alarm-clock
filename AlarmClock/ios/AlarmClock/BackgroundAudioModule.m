//
//  BackgroundAudioModule.m
//  AlarmClock
//
//  Created by Claude Code
//  React Native bridge for BackgroundAudioManager
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BackgroundAudioManager, NSObject)

// Start background audio session
RCT_EXTERN_METHOD(startBackgroundAudio:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Stop background audio session
RCT_EXTERN_METHOD(stopBackgroundAudio:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Check if background audio is running
RCT_EXTERN_METHOD(isBackgroundAudioRunning:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
