import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const BreathingAnimation = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycles, setCycles] = useState(0);
  
  // Configuration for breathing cycle
  const inhaleTime = 4; // seconds
  const holdTime = 7; // seconds
  const exhaleTime = 8; // seconds
  const restTime = 1; // seconds
  const totalCycles = 3; // number of breath cycles
  
  // Reset the session
  const resetSession = () => {
    setIsActive(false);
    setCurrentPhase('rest');
    setSecondsLeft(0);
    setCycles(0);
  };
  
  // Toggle active state
  const toggleActive = () => {
    if (!isActive) {
      // Starting a new session
      setIsActive(true);
      setCurrentPhase('inhale');
      setSecondsLeft(inhaleTime);
      setCycles(0);
    } else {
      // Pausing
      setIsActive(false);
    }
  };
  
  // Timer effect
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (isActive) {
      intervalId = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Move to the next phase when current phase is complete
            if (currentPhase === 'inhale') {
              setCurrentPhase('hold');
              return holdTime;
            } else if (currentPhase === 'hold') {
              setCurrentPhase('exhale');
              return exhaleTime;
            } else if (currentPhase === 'exhale') {
              // Finish a cycle
              const nextCycle = cycles + 1;
              if (nextCycle >= totalCycles) {
                // End the session
                resetSession();
                return 0;
              } else {
                setCycles(nextCycle);
                setCurrentPhase('rest');
                return restTime;
              }
            } else { // rest
              setCurrentPhase('inhale');
              return inhaleTime;
            }
          }
          
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, currentPhase, cycles]);
  
  // Text instructions based on current phase
  const getInstructions = () => {
    switch (currentPhase) {
      case 'inhale':
        return "Inhale slowly";
      case 'hold':
        return "Hold your breath";
      case 'exhale':
        return "Exhale slowly";
      case 'rest':
        return "Get ready...";
      default:
        return "Press start";
    }
  };
  
  // Circle size variations for breathing animation
  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: inhaleTime, ease: "easeInOut" }
    },
    hold: {
      scale: 1.5,
      transition: { duration: holdTime, ease: "linear" }
    },
    exhale: {
      scale: 1,
      transition: { duration: exhaleTime, ease: "easeInOut" }
    },
    rest: {
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  return (
    <Card className="border border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          {currentPhase === 'inhale' ? (
            <ArrowDown className="h-5 w-5 text-blue-500" />
          ) : currentPhase === 'exhale' ? (
            <ArrowUp className="h-5 w-5 text-blue-500" />
          ) : (
            <span className="h-5 w-5 flex items-center justify-center text-blue-500">•</span>
          )}
          Breathing Exercise
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6 pt-4">
        <div className="relative flex items-center justify-center h-52 w-52">
          <motion.div
            className="absolute h-40 w-40 bg-blue-100 rounded-full"
            variants={circleVariants}
            animate={currentPhase}
          />
          
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-lg font-medium text-blue-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-lg font-medium">{getInstructions()}</p>
                {isActive && <p className="text-sm">{secondsLeft}s</p>}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSession}
            disabled={!isActive && cycles === 0}
            className="flex gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            onClick={toggleActive}
            className="flex gap-1"
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {cycles === 0 ? "Start" : "Resume"}
              </>
            )}
          </Button>
        </div>
        
        {isActive && cycles > 0 && (
          <div className="text-sm text-muted-foreground">
            Cycle {cycles + 1} of {totalCycles}
          </div>
        )}
        
        {!isActive && cycles === totalCycles && (
          <motion.div 
            className="text-green-600 font-medium text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Great job! You've completed the breathing session.
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
