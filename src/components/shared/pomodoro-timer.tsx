"use client";

import { useState, useEffect, useCallback } from "react";
import Timer from "./timer";
import Settings from "./settings";
import SessionTracker from "./session-tracker";
import MotivationalQuote from "./motivational-quote";
import { ThemeToggle } from "./theme-toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadState, saveState } from "@/features/pomodoro/utils/state-manager";
import { soundManager } from "@/features/pomodoro/utils/sound";

type SessionType = "work" | "shortBreak" | "longBreak";

const DEFAULT_SETTINGS = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
};

export default function PomodoroTimer() {
  // Initialize state from localStorage or use defaults
  const savedState = loadState();
  const [settings, setSettings] = useState(savedState?.settings || DEFAULT_SETTINGS);
  const [currentSession, setCurrentSession] = useState<SessionType>(savedState?.currentSession || "work");
  const [isRunning, setIsRunning] = useState(savedState?.isRunning || false);
  const [timeLeft, setTimeLeft] = useState(savedState?.timeLeft || settings.workDuration);
  const [sessionsCompleted, setSessionsCompleted] = useState(savedState?.sessionsCompleted || 0);

  // Save state whenever it changes
  useEffect(() => {
    if (timeLeft > 0 || !isRunning) { // Only save state when timer is running or when explicitly changed
      saveState({
        settings,
        currentSession,
        isRunning,
        timeLeft,
        sessionsCompleted,
      });
    }
  }, [settings, currentSession, isRunning, timeLeft, sessionsCompleted]);

  const switchSession = useCallback(
    (newSession: SessionType) => {
      setIsRunning(false);
      setCurrentSession(newSession);
      
      let newTimeLeft;
      switch (newSession) {
        case "work":
          newTimeLeft = settings.workDuration;
          break;
        case "shortBreak":
          newTimeLeft = settings.shortBreakDuration;
          break;
        case "longBreak":
          newTimeLeft = settings.longBreakDuration;
          break;
      }
      
      setTimeLeft(newTimeLeft);
      
      // Save state after switching session
      saveState({
        settings,
        currentSession: newSession,
        isRunning: false,
        timeLeft: newTimeLeft,
        sessionsCompleted,
      });
    },
    [settings, sessionsCompleted]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      soundManager.playSound(currentSession === "work" ? "workComplete" : "breakComplete");
      setIsRunning(false);
      
      // Handle session completion and switching
      const handleSessionComplete = () => {
        if (currentSession === "work") {
          // After work session, increment count and switch to appropriate break
          const newSessions = sessionsCompleted + 1;
          const nextSession = newSessions % 4 === 0 ? "longBreak" : "shortBreak";
          
          setSessionsCompleted(newSessions);
          saveState({
            settings,
            currentSession,
            isRunning: false,
            timeLeft: 0,
            sessionsCompleted: newSessions,
          });
          
          setTimeout(() => {
            switchSession(nextSession);
          }, 500);
        } else {
          // After break session, switch back to work
          setTimeout(() => {
            switchSession("work");
          }, 500);
        }
      };

      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentSession, settings, sessionsCompleted, switchSession]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    switchSession("work");
    setSessionsCompleted(0);
  };

  const updateSettings = useCallback((newSettings: typeof settings) => {
    setSettings(newSettings);
    if (!isRunning) {
      switch (currentSession) {
        case "work":
          setTimeLeft(newSettings.workDuration);
          break;
        case "shortBreak":
          setTimeLeft(newSettings.shortBreakDuration);
          break;
        case "longBreak":
          setTimeLeft(newSettings.longBreakDuration);
          break;
      }
    }
    // Save settings to localStorage
    saveState({
      settings: newSettings,
      currentSession,
      isRunning,
      timeLeft,
      sessionsCompleted,
    });
  }, [currentSession, isRunning, timeLeft, sessionsCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Update document title with timer
  useEffect(() => {
    const timerText = formatTime(timeLeft);
    const sessionEmoji = currentSession === "work" ? "🎯" : "☕";
    document.title = `${timerText} ${sessionEmoji} - Pomodoro Timer`;

    // Cleanup - reset title when component unmounts
    return () => {
      document.title = "Pomodoro Timer";
    };
  }, [timeLeft, currentSession]);

  return (
    <div className="flex flex-col items-center space-y-6 p-4 w-full max-w-md mx-auto min-h-screen justify-center">
      <h1 className="text-4xl font-bold">Pomodoro Timer</h1>
      <Tabs
        value={currentSession}
        onValueChange={(value) => switchSession(value as SessionType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
          <TabsTrigger value="longBreak">Long Break</TabsTrigger>
        </TabsList>
      </Tabs>
      <Timer
        timeLeft={timeLeft}
        isRunning={isRunning}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
        currentSession={currentSession}
      />
      <SessionTracker sessionsCompleted={sessionsCompleted} />
      <Settings settings={settings} updateSettings={updateSettings} />
      <MotivationalQuote />
      <div className="mt-6">
        <ThemeToggle />
      </div>
    </div>
  );
}
