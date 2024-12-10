// Simple object to store our sound file names
export const SOUND_SETTINGS = {
  workComplete: "notification.mp3",
  breakComplete: "notification.mp3",
  buttonClick: "button-click.mp3",
};

// Simple function to play a sound
export function playSound(soundName: keyof typeof SOUND_SETTINGS) {
  const audio = new Audio(`/sounds/${SOUND_SETTINGS[soundName]}`);
  audio.play().catch(error => {
    console.error(`Failed to play sound ${soundName}:`, error);
  });
}
