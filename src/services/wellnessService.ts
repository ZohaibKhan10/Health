import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatDate } from './dataService';

// Water Intake
export type WaterIntake = {
  id: string;
  date: string;
  cups: number;
  goal: number;
};

// Meal Log
export type Meal = {
  id: string;
  date: string;
  name: string;
  calories: number;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

// Sleep Log
export type SleepEntry = {
  id: string;
  date: string;
  hoursSlept: number;
  bedTime: string;
  wakeTime: string;
  quality?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
};

// Fitness
export type Exercise = {
  id: string;
  name: string;
  duration: number; // in seconds
  sets?: number;
  reps?: number;
  completed: boolean;
  order: number;
};

export type WorkoutRoutine = {
  id: string;
  name: string;
  exercises: Exercise[];
  date: string;
  completed: boolean;
};

// Stretch
export type StretchExercise = {
  id: string;
  name: string;
  duration: number; // in seconds
  imageUrl?: string;
  description?: string;
  order: number;
};

export type StretchRoutine = {
  id: string;
  name: string;
  exercises: StretchExercise[];
};

// Weight Tracking
export type WeightEntry = {
  id: string;
  date: string;
  weight: number;
  note?: string;
};

type WellnessState = {
  // Water tracking
  waterIntake: WaterIntake[];
  waterGoal: number;
  
  // Meal tracking
  meals: Meal[];
  
  // Sleep tracking
  sleepEntries: SleepEntry[];
  
  // Fitness tracking
  workoutRoutines: WorkoutRoutine[];
  activeWorkoutId: string | null;
  
  // Stretch routines
  stretchRoutines: StretchRoutine[];
  activeStretchRoutineId: string | null;
  
  // Weight tracking
  weightEntries: WeightEntry[];
  
  // Actions
  addWaterCup: () => void;
  removeWaterCup: () => void;
  setWaterGoal: (goal: number) => void;
  resetWaterIntake: () => void;
  getTodayWaterIntake: () => WaterIntake;
  
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  deleteMeal: (id: string) => void;
  getTodayMeals: () => Meal[];
  getTodayCalories: () => number;
  
  addSleepEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  updateSleepEntry: (id: string, entry: Partial<SleepEntry>) => void;
  getRecentSleepEntries: (days: number) => SleepEntry[];
  
  addWorkoutRoutine: (routine: Omit<WorkoutRoutine, 'id'>) => void;
  updateExerciseStatus: (routineId: string, exerciseId: string, completed: boolean) => void;
  setActiveWorkout: (id: string | null) => void;
  
  addStretchRoutine: (routine: Omit<StretchRoutine, 'id'>) => void;
  updateStretchExerciseOrder: (routineId: string, exercises: StretchExercise[]) => void;
  setActiveStretchRoutine: (id: string | null) => void;
  
  // Weight tracking actions
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  updateWeightEntry: (id: string, entry: Partial<WeightEntry>) => void;
  deleteWeightEntry: (id: string) => void;
  getRecentWeightEntries: (days: number) => WeightEntry[];
};

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Default workout routine
const defaultWorkoutRoutine: Omit<WorkoutRoutine, 'id'> = {
  name: "Quick Full Body",
  exercises: [
    { id: generateId(), name: "Push-ups", duration: 60, sets: 3, reps: 10, completed: false, order: 0 },
    { id: generateId(), name: "Squats", duration: 60, sets: 3, reps: 15, completed: false, order: 1 },
    { id: generateId(), name: "Plank", duration: 30, completed: false, order: 2 },
    { id: generateId(), name: "Jumping Jacks", duration: 60, completed: false, order: 3 },
  ],
  date: formatDate(new Date()),
  completed: false
};

// Default stretch routine
const defaultStretchRoutine: Omit<StretchRoutine, 'id'> = {
  name: "Morning Stretch",
  exercises: [
    { 
      id: generateId(), 
      name: "Neck Stretch", 
      duration: 20, 
      description: "Gently tilt your head to each side", 
      order: 0 
    },
    { 
      id: generateId(), 
      name: "Shoulder Rolls", 
      duration: 15, 
      description: "Roll your shoulders forward and backward", 
      order: 1 
    },
    { 
      id: generateId(), 
      name: "Standing Side Stretch", 
      duration: 30, 
      description: "Raise your arms and lean to each side", 
      order: 2 
    },
    { 
      id: generateId(), 
      name: "Hamstring Stretch", 
      duration: 25, 
      description: "Bend forward at your hips", 
      order: 3 
    },
  ]
};

export const useWellnessStore = create<WellnessState>()(
  persist(
    (set, get) => ({
      // Initial state
      waterIntake: [],
      waterGoal: 8, // Default goal: 8 cups
      meals: [],
      sleepEntries: [],
      workoutRoutines: [{ ...defaultWorkoutRoutine, id: generateId() }],
      activeWorkoutId: null,
      stretchRoutines: [{ ...defaultStretchRoutine, id: generateId() }],
      activeStretchRoutineId: null,
      weightEntries: [],
      
      // Water tracking actions
      addWaterCup: () => set((state) => {
        const today = formatDate(new Date());
        const todayEntry = state.waterIntake.find(entry => entry.date === today);
        
        if (todayEntry) {
          return {
            waterIntake: state.waterIntake.map(entry => 
              entry.date === today 
                ? { ...entry, cups: entry.cups + 1 }
                : entry
            )
          };
        } else {
          return {
            waterIntake: [
              ...state.waterIntake,
              { id: generateId(), date: today, cups: 1, goal: state.waterGoal }
            ]
          };
        }
      }),
      
      removeWaterCup: () => set((state) => {
        const today = formatDate(new Date());
        const todayEntry = state.waterIntake.find(entry => entry.date === today);
        
        if (todayEntry && todayEntry.cups > 0) {
          return {
            waterIntake: state.waterIntake.map(entry => 
              entry.date === today 
                ? { ...entry, cups: entry.cups - 1 }
                : entry
            )
          };
        }
        
        return state;
      }),
      
      setWaterGoal: (goal) => set((state) => {
        const today = formatDate(new Date());
        const todayEntry = state.waterIntake.find(entry => entry.date === today);
        
        // Update today's goal if it exists
        if (todayEntry) {
          return {
            waterGoal: goal,
            waterIntake: state.waterIntake.map(entry => 
              entry.date === today 
                ? { ...entry, goal }
                : entry
            )
          };
        }
        
        return { waterGoal: goal };
      }),
      
      resetWaterIntake: () => set((state) => {
        const today = formatDate(new Date());
        
        return {
          waterIntake: state.waterIntake.filter(entry => entry.date !== today)
        };
      }),
      
      getTodayWaterIntake: () => {
        const today = formatDate(new Date());
        const todayEntry = get().waterIntake.find(entry => entry.date === today);
        
        if (todayEntry) {
          return todayEntry;
        }
        
        return {
          id: 'temp',
          date: today,
          cups: 0,
          goal: get().waterGoal
        };
      },
      
      // Meal tracking actions
      addMeal: (meal) => set((state) => ({
        meals: [...state.meals, { ...meal, id: generateId() }]
      })),
      
      deleteMeal: (id) => set((state) => ({
        meals: state.meals.filter(meal => meal.id !== id)
      })),
      
      getTodayMeals: () => {
        const today = formatDate(new Date());
        return get().meals.filter(meal => meal.date === today);
      },
      
      getTodayCalories: () => {
        const todayMeals = get().getTodayMeals();
        return todayMeals.reduce((total, meal) => total + meal.calories, 0);
      },
      
      // Sleep tracking actions
      addSleepEntry: (entry) => set((state) => {
        // Check if entry for this date already exists
        const existingEntryIndex = state.sleepEntries.findIndex(e => e.date === entry.date);
        
        if (existingEntryIndex !== -1) {
          // Replace existing entry
          const updatedEntries = [...state.sleepEntries];
          updatedEntries[existingEntryIndex] = { ...entry, id: state.sleepEntries[existingEntryIndex].id };
          return { sleepEntries: updatedEntries };
        }
        
        return {
          sleepEntries: [...state.sleepEntries, { ...entry, id: generateId() }]
        };
      }),
      
      updateSleepEntry: (id, updatedFields) => set((state) => ({
        sleepEntries: state.sleepEntries.map(entry => 
          entry.id === id ? { ...entry, ...updatedFields } : entry
        )
      })),
      
      getRecentSleepEntries: (days) => {
        // Get entries for the past X days
        const entries = get().sleepEntries;
        const today = new Date();
        
        return entries
          .filter(entry => {
            const entryDate = new Date(entry.date);
            const diffTime = Math.abs(today.getTime() - entryDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= days;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },
      
      // Workout actions
      addWorkoutRoutine: (routine) => set((state) => ({
        workoutRoutines: [...state.workoutRoutines, { ...routine, id: generateId() }]
      })),
      
      updateExerciseStatus: (routineId, exerciseId, completed) => set((state) => {
        const updatedRoutines = state.workoutRoutines.map(routine => {
          if (routine.id === routineId) {
            const updatedExercises = routine.exercises.map(exercise => 
              exercise.id === exerciseId ? { ...exercise, completed } : exercise
            );
            
            // Check if all exercises are completed
            const allCompleted = updatedExercises.every(ex => ex.completed);
            
            return {
              ...routine,
              exercises: updatedExercises,
              completed: allCompleted
            };
          }
          return routine;
        });
        
        return { workoutRoutines: updatedRoutines };
      }),
      
      setActiveWorkout: (id) => set({ activeWorkoutId: id }),
      
      // Stretch routine actions
      addStretchRoutine: (routine) => set((state) => ({
        stretchRoutines: [...state.stretchRoutines, { ...routine, id: generateId() }]
      })),
      
      updateStretchExerciseOrder: (routineId, exercises) => set((state) => ({
        stretchRoutines: state.stretchRoutines.map(routine => 
          routine.id === routineId 
            ? { ...routine, exercises }
            : routine
        )
      })),
      
      setActiveStretchRoutine: (id) => set({ activeStretchRoutineId: id }),
      
      // Weight tracking actions
      addWeightEntry: (entry) => set((state) => ({
        weightEntries: [...state.weightEntries, { ...entry, id: generateId() }]
      })),
      
      updateWeightEntry: (id, updatedFields) => set((state) => ({
        weightEntries: state.weightEntries.map(entry => 
          entry.id === id ? { ...entry, ...updatedFields } : entry
        )
      })),
      
      deleteWeightEntry: (id) => set((state) => ({
        weightEntries: state.weightEntries.filter(entry => entry.id !== id)
      })),
      
      getRecentWeightEntries: (days) => {
        // Get entries for the past X days
        const entries = get().weightEntries;
        const today = new Date();
        
        return entries
          .filter(entry => {
            const entryDate = new Date(entry.date);
            const diffTime = Math.abs(today.getTime() - entryDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= days;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },
    }),
    {
      name: 'wellness-storage'
    }
  )
);
