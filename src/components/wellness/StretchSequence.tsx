
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Move, Play, Pause, RotateCcw, GripVertical } from "lucide-react";
import { useWellnessStore, StretchExercise } from "@/services/wellnessService";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

export const StretchSequence = () => {
  const { stretchRoutines, updateStretchExerciseOrder, setActiveStretchRoutine, activeStretchRoutineId } = useWellnessStore();
  
  // Use first routine if none is active
  const currentRoutine = activeStretchRoutineId
    ? stretchRoutines.find(r => r.id === activeStretchRoutineId)
    : stretchRoutines[0];
  
  const [exercises, setExercises] = useState<StretchExercise[]>(
    currentRoutine?.exercises.sort((a, b) => a.order - b.order) || []
  );
  const [draggedExerciseId, setDraggedExerciseId] = useState<string | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);
  
  // Set active routine when component mounts
  useEffect(() => {
    if (currentRoutine && !activeStretchRoutineId) {
      setActiveStretchRoutine(currentRoutine.id);
      setExercises(currentRoutine.exercises.sort((a, b) => a.order - b.order));
    }
  }, [currentRoutine, activeStretchRoutineId, setActiveStretchRoutine]);
  
  // Update exercises when routine changes
  useEffect(() => {
    if (currentRoutine) {
      setExercises(currentRoutine.exercises.sort((a, b) => a.order - b.order));
    }
  }, [currentRoutine]);
  
  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            
            // Move to next exercise if available
            if (activeExerciseIndex < exercises.length - 1) {
              const nextIndex = activeExerciseIndex + 1;
              setActiveExerciseIndex(nextIndex);
              setTimeLeft(exercises[nextIndex].duration);
              setIsTimerRunning(true);
              toast({
                title: "Next stretch",
                description: exercises[nextIndex].name
              });
            } else {
              // End of sequence
              toast({
                title: "Stretching Complete!",
                description: "Great job completing the sequence!",
              });
              setActiveExerciseIndex(-1);
            }
            
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
  }, [isTimerRunning, timeLeft, activeExerciseIndex, exercises]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startSequence = () => {
    if (exercises.length === 0) return;
    
    // Reset any running timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setActiveExerciseIndex(0);
    setTimeLeft(exercises[0].duration);
    setIsTimerRunning(true);
    
    toast({
      title: "Starting stretch",
      description: exercises[0].name
    });
  };
  
  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };
  
  const resetTimer = () => {
    if (activeExerciseIndex >= 0) {
      setTimeLeft(exercises[activeExerciseIndex].duration);
      setIsTimerRunning(false);
    }
  };
  
  const stopSequence = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsTimerRunning(false);
    setActiveExerciseIndex(-1);
    setTimeLeft(0);
  };
  
  // Drag and drop handlers
  const handleDragStart = (id: string) => {
    setDraggedExerciseId(id);
  };
  
  const handleDragEnter = (targetId: string) => {
    if (!draggedExerciseId || draggedExerciseId === targetId) return;
    
    // Reorder the exercises
    const draggedIndex = exercises.findIndex(ex => ex.id === draggedExerciseId);
    const targetIndex = exercises.findIndex(ex => ex.id === targetId);
    
    if (draggedIndex < 0 || targetIndex < 0) return;
    
    const newExercises = [...exercises];
    const [draggedItem] = newExercises.splice(draggedIndex, 1);
    newExercises.splice(targetIndex, 0, draggedItem);
    
    // Update order property
    const updatedExercises = newExercises.map((ex, idx) => ({
      ...ex,
      order: idx
    }));
    
    setExercises(updatedExercises);
    
    // Save the new order if not in active sequence
    if (activeExerciseIndex < 0 && currentRoutine) {
      updateStretchExerciseOrder(currentRoutine.id, updatedExercises);
    }
  };
  
  const handleDragEnd = () => {
    setDraggedExerciseId(null);
  };
  
  if (!currentRoutine) {
    return (
      <Card className="border border-purple-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Move className="h-5 w-5 text-purple-600" />
            Stretch Sequence
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          No stretch routines available.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border border-purple-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Move className="h-5 w-5 text-purple-600" />
            {currentRoutine.name}
          </span>
          {activeExerciseIndex >= 0 ? (
            <span className="text-sm font-normal">
              {activeExerciseIndex + 1} of {exercises.length}
            </span>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={startSequence}
            >
              <Play className="mr-1 h-4 w-4" />
              Start Sequence
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeExerciseIndex >= 0 && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center py-2">
              <h3 className="text-lg font-medium">
                {exercises[activeExerciseIndex].name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {exercises[activeExerciseIndex].description}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center">
              <div className="text-3xl font-mono mb-2">
                {formatTime(timeLeft)}
              </div>
              
              <Progress 
                value={(timeLeft / exercises[activeExerciseIndex].duration) * 100} 
                className="h-2 mb-4 w-full max-w-xs" 
              />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={toggleTimer}
                >
                  {isTimerRunning ? (
                    <><Pause className="mr-1 h-4 w-4" /> Pause</>
                  ) : (
                    <><Play className="mr-1 h-4 w-4" /> Resume</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetTimer}
                >
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  onClick={stopSequence}
                >
                  Stop
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeExerciseIndex < 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground mb-2">
              Drag to reorder stretches
            </div>
            
            {exercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                draggable
                onDragStart={() => handleDragStart(exercise.id)}
                onDragEnter={() => handleDragEnter(exercise.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`flex items-center justify-between p-3 rounded-md cursor-move ${
                  draggedExerciseId === exercise.id ? 'border-2 border-dashed border-purple-300 bg-purple-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400 cursor-grab">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(exercise.duration)}
                      {exercise.description && (
                        <span className="ml-1 text-xs text-gray-500">
                          • {exercise.description.slice(0, 30)}
                          {exercise.description.length > 30 && '...'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
