import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, Play, Pause, RotateCcw, Check } from "lucide-react";
import { useWellnessStore, WorkoutRoutine, Exercise } from "@/services/wellnessService";
import { toast } from "@/hooks/use-toast";
import { motion } from "@/components/ui/motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const FitnessRoutine = () => {
  const { 
    workoutRoutines, 
    updateExerciseStatus, 
    setActiveWorkout, 
    activeWorkoutId 
  } = useWellnessStore();
  
  // Find first incomplete workout or just take the first one
  const currentRoutine = activeWorkoutId 
    ? workoutRoutines.find(r => r.id === activeWorkoutId)
    : workoutRoutines.find(r => !r.completed) || workoutRoutines[0];
  
  // Timer state
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);
  
  // Set active workout when component mounts
  useEffect(() => {
    if (currentRoutine && !activeWorkoutId) {
      setActiveWorkout(currentRoutine.id);
    }
  }, [currentRoutine, activeWorkoutId, setActiveWorkout]);
  
  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer complete
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            toast({
              title: "Exercise Complete!",
              description: "Great job! Move to the next exercise.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isTimerRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timeLeft]);
  
  const startTimer = (exercise: Exercise) => {
    // Reset any running timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setActiveExerciseId(exercise.id);
    setTimeLeft(exercise.duration);
    setIsTimerRunning(true);
  };
  
  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };
  
  const resetTimer = (exercise: Exercise) => {
    setTimeLeft(exercise.duration);
    setIsTimerRunning(false);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleToggleExercise = (exerciseId: string, completed: boolean) => {
    if (currentRoutine) {
      updateExerciseStatus(currentRoutine.id, exerciseId, completed);
    }
  };
  
  // Calculate progress
  const totalExercises = currentRoutine?.exercises.length || 0;
  const completedExercises = currentRoutine?.exercises.filter(ex => ex.completed).length || 0;
  const progressPercentage = totalExercises > 0 
    ? (completedExercises / totalExercises) * 100 
    : 0;
  
  if (!currentRoutine) {
    return (
      <Card className="border border-orange-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-orange-600" />
            Fitness Routine
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          No workout routines available.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border border-orange-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-orange-600" />
            {currentRoutine.name}
          </span>
          <span className="text-sm font-normal">
            {completedExercises} of {totalExercises} completed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressPercentage} className="h-2" />
        
        <div className="space-y-2">
          {currentRoutine.exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: exercise.order * 0.1 }}
              className={cn(
                "flex items-center justify-between p-3 rounded-md",
                exercise.completed ? "bg-orange-50" : "hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={exercise.completed}
                  onCheckedChange={(checked) => {
                    handleToggleExercise(exercise.id, checked === true);
                  }}
                  className={exercise.completed ? "text-orange-600" : ""}
                />
                <div>
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(exercise.duration)}
                    {exercise.sets && exercise.reps && (
                      <span> • {exercise.sets}×{exercise.reps}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {activeExerciseId === exercise.id ? (
                  <>
                    <div className="text-sm font-mono w-12 text-right">
                      {formatTime(timeLeft)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={toggleTimer}
                    >
                      {isTimerRunning ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => resetTimer(exercise)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startTimer(exercise)}
                    disabled={exercise.completed}
                  >
                    <Play className="mr-1 h-4 w-4" />
                    Start
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {currentRoutine.completed && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
              <Check className="h-5 w-5" />
              Workout Complete! Great job!
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
