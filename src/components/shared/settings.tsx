import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { SettingsIcon } from "lucide-react";

type SettingsProps = {
  settings: {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
  };
  updateSettings: (newSettings: SettingsProps["settings"]) => void;
};

export default function Settings({ settings, updateSettings }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSettings = { ...localSettings, [name]: parseInt(value) * 60 };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Timer Settings
          </DialogTitle>
          <DialogDescription>
            Adjust the timer durations for work, short break, and long break.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-4">
            <Label htmlFor="workDuration" className="text-sm sm:text-base">
              Work Duration: {localSettings.workDuration / 60} minutes
            </Label>
            <Slider
              id="workDuration"
              name="workDuration"
              min={1}
              max={60}
              step={1}
              value={[localSettings.workDuration / 60]}
              onValueChange={(value) =>
                handleChange({
                  target: { name: "workDuration", value: value[0].toString() },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              className="w-full"
            />
          </div>
          <div className="space-y-2 sm:space-y-4">
            <Label
              htmlFor="shortBreakDuration"
              className="text-sm sm:text-base"
            >
              Short Break Duration: {localSettings.shortBreakDuration / 60}{" "}
              minutes
            </Label>
            <Slider
              id="shortBreakDuration"
              name="shortBreakDuration"
              min={1}
              max={15}
              step={1}
              value={[localSettings.shortBreakDuration / 60]}
              onValueChange={(value) =>
                handleChange({
                  target: {
                    name: "shortBreakDuration",
                    value: value[0].toString(),
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              className="w-full"
            />
          </div>
          <div className="space-y-2 sm:space-y-4">
            <Label htmlFor="longBreakDuration" className="text-sm sm:text-base">
              Long Break Duration: {localSettings.longBreakDuration / 60}{" "}
              minutes
            </Label>
            <Slider
              id="longBreakDuration"
              name="longBreakDuration"
              min={1}
              max={30}
              step={1}
              value={[localSettings.longBreakDuration / 60]}
              onValueChange={(value) =>
                handleChange({
                  target: {
                    name: "longBreakDuration",
                    value: value[0].toString(),
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Save Settings
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
