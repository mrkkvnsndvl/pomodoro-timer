import { SOUND_SETTINGS } from "../constants/settings";

class SoundManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  private getAudioElement(
    soundName: keyof typeof SOUND_SETTINGS
  ): HTMLAudioElement {
    const soundPath = SOUND_SETTINGS[soundName];
    let audio = this.audioCache.get(soundPath);

    if (!audio) {
      audio = new Audio(`/sounds/${soundPath}`);
      this.audioCache.set(soundPath, audio);
    }

    return audio;
  }

  playSound(soundName: keyof typeof SOUND_SETTINGS): void {
    const audio = this.getAudioElement(soundName);
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.error(`Failed to play sound ${soundName}:`, error);
    });
  }
}

export const soundManager = new SoundManager();
