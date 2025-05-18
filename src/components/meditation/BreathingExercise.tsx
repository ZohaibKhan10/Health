
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

type BreathingState = "inhale" | "hold" | "exhale" | "pause" | "idle";

export const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [breathingState, setBreathingState] = useState<BreathingState>("idle");
  const [currentCycle, setCurrentCycle] = useState(0);
  
  const totalCycles = 3;
  const inhaleTime = 4;
  const holdTime = 7;
  const exhaleTime = 8;
  const pauseTime = 1;
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          const newTimer = prevTimer + 1;
          
          if (breathingState === "inhale" && newTimer >= inhaleTime) {
            setBreathingState("hold");
            return 0;
          }
          
          if (breathingState === "hold" && newTimer >= holdTime) {
            setBreathingState("exhale");
            return 0;
          }
          
          if (breathingState === "exhale" && newTimer >= exhaleTime) {
            if (currentCycle >= totalCycles - 1) {
              setIsActive(false);
              setBreathingState("idle");
              setCurrentCycle(0);
              return 0;
            } else {
              setBreathingState("pause");
              return 0;
            }
          }
          
          if (breathingState === "pause" && newTimer >= pauseTime) {
            setBreathingState("inhale");
            setCurrentCycle(c => c + 1);
            return 0;
          }
          
          return newTimer;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, breathingState, currentCycle]);
  
  const handleStart = () => {
    setIsActive(true);
    setBreathingState("inhale");
    setTimer(0);
    setCurrentCycle(0);
  };
  
  const handlePause = () => {
    setIsActive(!isActive);
  };
  
  const handleReset = () => {
    setIsActive(false);
    setBreathingState("idle");
    setTimer(0);
    setCurrentCycle(0);
  };
  
  const getSize = () => {
    if (breathingState === "inhale") {
      return 40 + (timer / inhaleTime) * 60;
    }
    if (breathingState === "hold") {
      return 100;
    }
    if (breathingState === "exhale") {
      return 100 - (timer / exhaleTime) * 60;
    }
    return 40; // Default size
  };
  
  const getMessage = () => {
    switch (breathingState) {
      case "inhale":
        return "Breathe in...";
      case "hold":
        return "Hold...";
      case "exhale":
        return "Breathe out...";
      case "pause":
        return "Ready...";
      default:
        return "Ready to begin";
    }
  };
  
  const getProgress = () => {
    if (currentCycle === 0 && timer === 0) return 0;
    
    const totalTime = inhaleTime + holdTime + exhaleTime + pauseTime;
    const completedCycles = currentCycle;
    
    let currentProgress = 0;
    if (breathingState === "inhale") {
      currentProgress = timer;
    } else if (breathingState === "hold") {
      currentProgress = inhaleTime + timer;
    } else if (breathingState === "exhale") {
      currentProgress = inhaleTime + holdTime + timer;
    } else if (breathingState === "pause") {
      currentProgress = inhaleTime + holdTime + exhaleTime + timer;
    }
    
    return ((completedCycles * totalTime + currentProgress) / (totalCycles * totalTime)) * 100;
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">4-7-8 Breathing Technique</h3>
          <p className="text-sm text-muted-foreground">
            Breathe in for 4, hold for 7, exhale for 8 seconds
          </p>
        </div>
        
        <div className="relative flex items-center justify-center my-8">
          <div 
            className={`
              rounded-full 
              bg-gradient-to-r from-blue-400 to-purple-400 
              transition-all duration-1000
              flex items-center justify-center text-white font-medium
              ${breathingState === "hold" ? "animate-pulse" : ""}
            `}
            style={{ 
              width: `${getSize()}px`, 
              height: `${getSize()}px` 
            }}
          >
            {getMessage()}
          </div>
          
          <div 
            className="w-36 h-36 rounded-full absolute border-2 border-muted"
            style={{
              background: `conic-gradient(theme(colors.primary.DEFAULT) ${getProgress()}%, transparent 0%)`,
              maskImage: 'radial-gradient(transparent 60%, black 61%)',
              WebkitMaskImage: 'radial-gradient(transparent 60%, black 61%)',
            }}
          />
        </div>
        
        <div className="text-center mb-4">
          <p className="text-lg">
            Cycle {currentCycle + 1 > totalCycles ? totalCycles : currentCycle + 1} of {totalCycles}
          </p>
        </div>
        
        <div className="flex gap-3">
          {!isActive ? (
            <Button onClick={handleStart} className="gap-2">
              <Play className="h-4 w-4" />
              {breathingState === "idle" ? "Start" : "Resume"}
            </Button>
          ) : (
            <Button onClick={handlePause} className="gap-2">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}
          
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
