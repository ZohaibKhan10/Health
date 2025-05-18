
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export const StudyTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 59) {
            setMinutes(prevMinutes => {
              if (prevMinutes === 59) {
                setHours(prevHours => prevHours + 1);
                return 0;
              }
              return prevMinutes + 1;
            });
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    setMinutes(0);
    setHours(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h3 className="text-lg font-medium mb-2">Study Timer</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Track your focus sessions
      </p>
      
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-card border rounded-md w-28 h-20 flex items-center justify-center">
          <span className="text-4xl font-mono">{hours.toString().padStart(2, '0')}</span>
        </div>
        <span className="text-2xl">:</span>
        <div className="bg-card border rounded-md w-28 h-20 flex items-center justify-center">
          <span className="text-4xl font-mono">{minutes.toString().padStart(2, '0')}</span>
        </div>
        <span className="text-2xl">:</span>
        <div className="bg-card border rounded-md w-28 h-20 flex items-center justify-center">
          <span className="text-4xl font-mono">{seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        {!isActive ? (
          <Button onClick={handleStart}>
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
        ) : (
          <Button onClick={handlePause}>
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )}
        
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};
