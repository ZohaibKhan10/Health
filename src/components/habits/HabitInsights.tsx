
import { useStore } from "@/services/dataService";

export const HabitInsights = () => {
  const { habits } = useStore();

  // Get streak for each habit
  const streaks = habits.map(habit => {
    return {
      name: habit.name,
      streak: habit.completedDates.length // Simplified streak calculation
    };
  });

  // Sort by streak (highest first)
  const sortedStreaks = [...streaks].sort((a, b) => b.streak - a.streak);
  
  return (
    <div className="space-y-6">
      {habits.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Current Streaks</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sortedStreaks.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center text-center"
              >
                <span className="text-2xl font-bold">{item.streak}</span>
                <span className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
