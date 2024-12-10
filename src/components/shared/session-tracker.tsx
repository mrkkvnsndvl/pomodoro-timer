import { Badge } from "@/components/ui/badge";
import { CheckCircle2Icon } from "lucide-react";

type SessionTrackerProps = {
  sessionsCompleted: number;
};

export default function SessionTracker({
  sessionsCompleted,
}: SessionTrackerProps) {
  return (
    <div className="flex items-center space-x-2 bg-secondary rounded-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
      <CheckCircle2Icon className="h-5 w-5 text-primary" />
      <span className="text-sm font-medium">Sessions Completed:</span>
      <Badge variant="default" className="text-lg">
        {sessionsCompleted}
      </Badge>
    </div>
  );
}
