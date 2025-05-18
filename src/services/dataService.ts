import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

// Updated MoodType to support emoji
export type MoodType = '😔' | '🙁' | '😐' | '🙂' | '😁';

export type MoodEntry = {
  id: string;
  date: string;
  mood: MoodType;
  moodLevel?: number;
  note?: string;
  tags?: string[];
};

export type Habit = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  completedDates: string[];
  createdAt: string;
};

export type Affirmation = {
  id: string;
  text: string;
  isFavorite: boolean;
  createdAt: string;
};

export type GratitudeEntry = {
  id: string;
  date: string;
  text: string;
};

type StoreState = {
  moodEntries: MoodEntry[];
  habits: Habit[];
  affirmations: Affirmation[];
  gratitudeEntries: GratitudeEntry[];
  dailyAffirmation: Affirmation | null;
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  addAffirmation: (affirmation: Omit<Affirmation, 'id' | 'createdAt' | 'isFavorite'>) => void;
  toggleFavoriteAffirmation: (id: string) => void;
  addGratitudeEntry: (entry: Omit<GratitudeEntry, 'id'>) => void;
  setDailyAffirmation: (affirmation: Affirmation) => void;
  getTodaysMoodEntry: () => MoodEntry | undefined;
  getHabitCompletionForDate: (habitId: string, date: string) => boolean;
  getTodaysGratitudeEntry: () => GratitudeEntry | undefined;
};

// Default affirmations
const defaultAffirmations: Omit<Affirmation, 'id' | 'createdAt'>[] = [
  { text: "I am worthy of love and respect", isFavorite: false },
  { text: "Today I choose calm over worry", isFavorite: false },
  { text: "I have the power to create positive change", isFavorite: false },
  { text: "I am enough exactly as I am", isFavorite: false },
  { text: "I celebrate my strengths and accept my weaknesses", isFavorite: false },
  { text: "My potential is limitless", isFavorite: false },
  { text: "I release what I cannot control", isFavorite: false },
  { text: "Each breath brings me peace and clarity", isFavorite: false },
  { text: "Today is full of possibilities", isFavorite: false },
  { text: "I trust my journey, even when the path isn't clear", isFavorite: false },
];

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Format date to YYYY-MM-DD
export const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

// Use zustand with persist middleware to save data to localStorage
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      moodEntries: [],
      habits: [],
      affirmations: defaultAffirmations.map(aff => ({
        ...aff,
        id: generateId(),
        createdAt: formatDate(new Date())
      })),
      gratitudeEntries: [],
      dailyAffirmation: null,

      addMoodEntry: (entry) => set((state) => {
        const today = formatDate(new Date());
        // Check if there's already an entry for today
        const existingEntryIndex = state.moodEntries.findIndex(e => e.date === entry.date);
        
        if (existingEntryIndex >= 0) {
          // Replace existing entry
          const updatedEntries = [...state.moodEntries];
          updatedEntries[existingEntryIndex] = { ...entry, id: state.moodEntries[existingEntryIndex].id };
          return { moodEntries: updatedEntries };
        } else {
          // Add new entry
          return { moodEntries: [...state.moodEntries, { ...entry, id: generateId() }] };
        }
      }),

      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, { 
          ...habit, 
          id: generateId(), 
          completedDates: [],
          createdAt: formatDate(new Date())
        }]
      })),

      deleteHabit: (habitId) => set((state) => ({
        habits: state.habits.filter(habit => habit.id !== habitId)
      })),

      toggleHabitCompletion: (habitId, date) => set((state) => {
        const habitIndex = state.habits.findIndex(h => h.id === habitId);
        if (habitIndex === -1) return state;

        const habit = state.habits[habitIndex];
        const isCompleted = habit.completedDates.includes(date);
        
        const updatedHabit = {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter(d => d !== date)
            : [...habit.completedDates, date]
        };

        const updatedHabits = [...state.habits];
        updatedHabits[habitIndex] = updatedHabit;

        return { habits: updatedHabits };
      }),

      addAffirmation: (affirmation) => set((state) => ({
        affirmations: [...state.affirmations, { 
          ...affirmation, 
          id: generateId(),
          isFavorite: false,
          createdAt: formatDate(new Date())
        }]
      })),

      toggleFavoriteAffirmation: (id) => set((state) => ({
        affirmations: state.affirmations.map(aff => 
          aff.id === id ? { ...aff, isFavorite: !aff.isFavorite } : aff
        )
      })),

      addGratitudeEntry: (entry) => set((state) => {
        const today = formatDate(new Date());
        // Check if there's already an entry for today
        const existingEntryIndex = state.gratitudeEntries.findIndex(e => e.date === today);
        
        if (existingEntryIndex >= 0) {
          // Replace existing entry
          const updatedEntries = [...state.gratitudeEntries];
          updatedEntries[existingEntryIndex] = { ...entry, id: state.gratitudeEntries[existingEntryIndex].id };
          return { gratitudeEntries: updatedEntries };
        } else {
          // Add new entry
          return { gratitudeEntries: [...state.gratitudeEntries, { ...entry, id: generateId() }] };
        }
      }),

      setDailyAffirmation: (affirmation) => set({ dailyAffirmation: affirmation }),

      getTodaysMoodEntry: () => {
        const today = formatDate(new Date());
        return get().moodEntries.find(entry => entry.date === today);
      },

      getHabitCompletionForDate: (habitId, date) => {
        const habit = get().habits.find(h => h.id === habitId);
        return habit ? habit.completedDates.includes(date) : false;
      },

      getTodaysGratitudeEntry: () => {
        const today = formatDate(new Date());
        return get().gratitudeEntries.find(entry => entry.date === today);
      }
    }),
    {
      name: 'sereniflow-storage'
    }
  )
);

// Function to select a random daily affirmation if none is set
export const ensureDailyAffirmation = () => {
  const { dailyAffirmation, affirmations, setDailyAffirmation } = useStore.getState();
  
  if (!dailyAffirmation) {
    if (affirmations.length > 0) {
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      setDailyAffirmation(affirmations[randomIndex]);
    }
  }
};
