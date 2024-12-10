// Types for our timer state
export type TimerSettings = {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
};

// Default settings (in seconds)
export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
};

// Save settings to localStorage
export function saveSettings(settings: TimerSettings) {
  localStorage.setItem('timerSettings', JSON.stringify(settings));
}

// Load settings from localStorage
export function loadSettings(): TimerSettings {
  const saved = localStorage.getItem('timerSettings');
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
}

// Save completed sessions count
export function saveSessionsCount(count: number) {
  localStorage.setItem('sessionsCompleted', count.toString());
}

// Load completed sessions count
export function loadSessionsCount(): number {
  return Number(localStorage.getItem('sessionsCompleted')) || 0;
}
