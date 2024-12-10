import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PauseIcon, PlayIcon, RefreshCwIcon } from "lucide-react";

// Props for the Timer component
type TimerProps = {
  timeLeft: number;
  isRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
};

export default function Timer({
  timeLeft,
  isRunning,
  toggleTimer,
  resetTimer,
}: TimerProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center space-y-4 p-4 sm:p-6">
        {/* Timer Display */}
        <div className="text-4xl sm:text-6xl font-bold tabular-nums">
          {formatTime(timeLeft)}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-row space-x-4 w-full justify-center">
          <Button onClick={toggleTimer} size="lg" className="w-32">
            {isRunning ? (
              <>
                <PauseIcon className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <PlayIcon className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
          <Button
            onClick={resetTimer}
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
