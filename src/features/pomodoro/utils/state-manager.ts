type TimerState = {
  settings: {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
  };
  currentSession: "work" | "shortBreak" | "longBreak";
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  lastUpdated?: number;
};

const STORAGE_KEY = "pomodoroState";

export const saveState = (state: TimerState) => {
  const stateWithTimestamp = {
    ...state,
    lastUpdated: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithTimestamp));
};

export const loadState = (): TimerState | null => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (!savedState) return null;

  try {
    const state = JSON.parse(savedState) as TimerState;
    
    // If the timer was running when the page was closed/refreshed
    // calculate the correct time remaining
    if (state.isRunning && state.lastUpdated) {
      const elapsedSeconds = Math.floor((Date.now() - state.lastUpdated) / 1000);
      state.timeLeft = Math.max(0, state.timeLeft - elapsedSeconds);
      
      // If timer completed while away, reset it
      if (state.timeLeft === 0) {
        state.isRunning = false;
      }
    }
    
    return state;
  } catch (error) {
    console.error("Error loading saved state:", error);
    return null;
  }
};

export const clearState = () => {
  localStorage.removeItem(STORAGE_KEY);
};
