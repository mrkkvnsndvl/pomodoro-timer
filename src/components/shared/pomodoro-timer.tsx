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
    saveState({
      settings,
      currentSession,
      isRunning,
      timeLeft,
      sessionsCompleted,
    });
  }, [settings, currentSession, isRunning, timeLeft, sessionsCompleted]);

  const switchSession = useCallback(
    (newSession: SessionType) => {
      setIsRunning(false);
      setCurrentSession(newSession);
      switch (newSession) {
        case "work":
          setTimeLeft(settings.workDuration);
          break;
        case "shortBreak":
          setTimeLeft(settings.shortBreakDuration);
          break;
        case "longBreak":
          setTimeLeft(settings.longBreakDuration);
          break;
      }
      // Save state after switching session
      saveState({
        settings,
        currentSession: newSession,
        isRunning: false,
        timeLeft: settings[`${newSession}Duration`],
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
          // Save state on each tick
          saveState({
            settings,
            currentSession,
            isRunning,
            timeLeft: newTime,
            sessionsCompleted,
          });
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      soundManager.playSound(currentSession === "work" ? "workComplete" : "breakComplete");
      setIsRunning(false);
      
      if (currentSession === "work") {
        setSessionsCompleted((prev) => {
          const newSessions = prev + 1;
          // Determine next break type
          const nextSession = newSessions % 4 === 0 ? "longBreak" : "shortBreak";
          switchSession(nextSession);
          return newSessions;
        });
      } else {
        switchSession("work");
      }
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
