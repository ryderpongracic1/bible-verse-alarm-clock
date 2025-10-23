//
//  BackgroundAudioManager.swift
//  AlarmClock
//
//  Created by Claude Code
//  Background audio session manager for continuous alarm playback
//

import Foundation
import AVFoundation

@objc(BackgroundAudioManager)
class BackgroundAudioManager: NSObject {

  private var audioPlayer: AVAudioPlayer?
  private var isBackgroundAudioActive: Bool = false

  // MARK: - Public Methods

  /// Start the background audio session with silent sound loop
  @objc func startBackgroundAudio(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async { [weak self] in
      guard let self = self else {
        reject("ERROR", "Self is nil", nil)
        return
      }

      // Avoid starting if already active
      if self.isBackgroundAudioActive {
        resolve(["status": "already_active", "message": "Background audio already running"])
        return
      }

      do {
        // Configure audio session for background playback
        try self.configureAudioSession()

        // Start playing silent audio loop
        try self.startSilentAudioLoop()

        self.isBackgroundAudioActive = true
        resolve(["status": "success", "message": "Background audio started successfully"])

        NSLog("[BackgroundAudioManager] Background audio session started")

      } catch {
        reject("AUDIO_ERROR", "Failed to start background audio: \(error.localizedDescription)", error)
        NSLog("[BackgroundAudioManager] Error starting background audio: \(error)")
      }
    }
  }

  /// Stop the background audio session
  @objc func stopBackgroundAudio(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async { [weak self] in
      guard let self = self else {
        reject("ERROR", "Self is nil", nil)
        return
      }

      self.stopSilentAudioLoop()
      self.isBackgroundAudioActive = false

      resolve(["status": "success", "message": "Background audio stopped successfully"])

      NSLog("[BackgroundAudioManager] Background audio session stopped")
    }
  }

  /// Check if background audio is currently active
  @objc func isBackgroundAudioRunning(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    resolve(["isRunning": self.isBackgroundAudioActive])
  }

  // MARK: - Private Methods

  /// Configure AVAudioSession for background audio playback
  private func configureAudioSession() throws {
    let audioSession = AVAudioSession.sharedInstance()

    // Set category to playback with options for mixing with other audio
    // .playback allows background audio
    // .mixWithOthers allows other apps to play audio simultaneously
    try audioSession.setCategory(
      .playback,
      mode: .default,
      options: [.mixWithOthers]
    )

    // Activate the audio session
    try audioSession.setActive(true)

    NSLog("[BackgroundAudioManager] Audio session configured for background playback")
  }

  /// Start playing the silent audio file in a loop
  private func startSilentAudioLoop() throws {
    // Locate the silence.wav file in the app bundle
    guard let silenceURL = Bundle.main.url(forResource: "silence", withExtension: "wav") else {
      throw NSError(
        domain: "BackgroundAudioManager",
        code: 404,
        userInfo: [NSLocalizedDescriptionKey: "silence.wav file not found in bundle"]
      )
    }

    // Create audio player
    audioPlayer = try AVAudioPlayer(contentsOf: silenceURL)

    guard let player = audioPlayer else {
      throw NSError(
        domain: "BackgroundAudioManager",
        code: 500,
        userInfo: [NSLocalizedDescriptionKey: "Failed to initialize audio player"]
      )
    }

    // Configure for infinite loop
    player.numberOfLoops = -1  // -1 means infinite loop
    player.volume = 0.0  // Silent (volume at 0)

    // Prepare and play
    player.prepareToPlay()
    player.play()

    NSLog("[BackgroundAudioManager] Silent audio loop started")
  }

  /// Stop the silent audio loop
  private func stopSilentAudioLoop() {
    if let player = audioPlayer {
      player.stop()
      audioPlayer = nil
      NSLog("[BackgroundAudioManager] Silent audio loop stopped")
    }

    // Optionally deactivate audio session
    // Note: We keep it active if other audio might play
    do {
      try AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
      NSLog("[BackgroundAudioManager] Audio session deactivated")
    } catch {
      NSLog("[BackgroundAudioManager] Warning: Could not deactivate audio session: \(error)")
    }
  }

  // MARK: - React Native Bridge Requirements

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
