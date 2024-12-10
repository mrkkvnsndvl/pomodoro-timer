import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayIcon, PauseIcon, RefreshCwIcon } from "lucide-react";
import { soundManager } from "@/features/pomodoro/utils/sound";

type TimerProps = {
  timeLeft: number;
  isRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  currentSession: "work" | "shortBreak" | "longBreak";
};

export default function Timer({
  timeLeft,
  isRunning,
  toggleTimer,
  resetTimer,
}: TimerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleToggleTimer = () => {
    soundManager.playSound("buttonClick");
    toggleTimer();
  };

  const handleResetTimer = () => {
    soundManager.playSound("buttonClick");
    resetTimer();
  };

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center space-y-4 p-4 sm:p-6">
        <div className="text-4xl sm:text-6xl font-bold tabular-nums">
          {formatTime(timeLeft)}
        </div>
        <div className="flex flex-row space-x-4 w-full justify-center">
          <Button onClick={handleToggleTimer} size="lg" className="w-32">
            {isRunning ? (
              <PauseIcon className="mr-2 h-4 w-4" />
            ) : (
              <PlayIcon className="mr-2 h-4 w-4" />
            )}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button
            onClick={handleResetTimer}
            variant="outline"
            size="lg"
            className="w-32"
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
