import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { playSound } from "@/utils/sound";
import {
  loadSessionsCount,
  loadSettings,
  saveSessionsCount,
  saveSettings,
} from "@/utils/storage";
import { useEffect, useState } from "react";
import MotivationalQuote from "./motivational-quote";
import SessionTracker from "./session-tracker";
import Settings from "./settings";
import { ThemeToggle } from "./theme-toggle";
import Timer from "./timer";

// Type for different session types
type SessionType = "work" | "shortBreak" | "longBreak";

export default function PomodoroTimer() {
  // Load saved settings and sessions count
  const [settings, setSettings] = useState(loadSettings());
  const [sessionsCompleted, setSessionsCompleted] = useState(
    loadSessionsCount()
  );

  // Timer state
  const [currentSession, setCurrentSession] = useState<SessionType>("work");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration);

  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Update page title
  useEffect(() => {
    const emoji = currentSession === "work" ? "🎯" : "☕";
    document.title = `${formatTime(timeLeft)} ${emoji} - Pomodoro Timer`;
    return () => {
      document.title = "Pomodoro Timer";
    };
  }, [timeLeft, currentSession]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      // Count down every second
      timer = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer completed
      setIsRunning(false);

      if (currentSession === "work") {
        // Work session completed
        playSound("workComplete");
        const newCount = sessionsCompleted + 1;
        setSessionsCompleted(newCount);
        saveSessionsCount(newCount);

        // Switch to break
        const nextSession = newCount % 4 === 0 ? "longBreak" : "shortBreak";
        handleSessionChange(nextSession);
      } else {
        // Break completed
        playSound("breakComplete");
        handleSessionChange("work");
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentSession, sessionsCompleted]);

  // Handle session type change
  const handleSessionChange = (newSession: SessionType) => {
    setIsRunning(false);
    setCurrentSession(newSession);

    // Set appropriate time for the session
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
  };

  // Handle settings update
  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);

    // Update current timer immediately
    if (!isRunning) {
      if (currentSession === "work") {
        setTimeLeft(newSettings.workDuration);
      } else if (currentSession === "shortBreak") {
        setTimeLeft(newSettings.shortBreakDuration);
      } else if (currentSession === "longBreak") {
        setTimeLeft(newSettings.longBreakDuration);
      }
    }
  };

  // Handle timer controls
  const toggleTimer = () => {
    playSound("buttonClick");
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    playSound("buttonClick");
    setIsRunning(false);
    handleSessionChange(currentSession);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4 w-full max-w-md mx-auto min-h-screen justify-center">
      <h1 className="text-4xl font-bold">Pomodoro Timer</h1>
      <Tabs
        defaultValue="work"
        value={currentSession}
        onValueChange={(value) => handleSessionChange(value as SessionType)}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="work" className="flex-1">
            Work
          </TabsTrigger>
          <TabsTrigger value="shortBreak" className="flex-1">
            Short Break
          </TabsTrigger>
          <TabsTrigger value="longBreak" className="flex-1">
            Long Break
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Timer
        timeLeft={timeLeft}
        isRunning={isRunning}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
      />
      <SessionTracker sessionsCompleted={sessionsCompleted} />
      <Settings settings={settings} updateSettings={updateSettings} />
      <MotivationalQuote />
      <ThemeToggle />
    </div>
  );
}
