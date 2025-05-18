
import { cn } from "@/lib/utils";
import { MoodType } from "@/services/dataService";

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onMoodSelect: (mood: MoodType) => void;
}

const moods: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: "😁", emoji: "😁", label: "Great", color: "#22c55e" },
  { type: "🙂", emoji: "🙂", label: "Good", color: "#4ade80" },
  { type: "😐", emoji: "😐", label: "Neutral", color: "#fbbf24" },
  { type: "🙁", emoji: "🙁", label: "Down", color: "#fb923c" },
  { type: "😔", emoji: "😔", label: "Sad", color: "#f87171" }
];

const MoodSelector = ({ selectedMood, onMoodSelect }: MoodSelectorProps) => {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {moods.map((mood) => (
        <button
          key={mood.type}
          className={cn(
            "flex flex-col items-center gap-1 p-3 rounded-full transition-all",
            selectedMood === mood.type
              ? "ring-2 ring-serene-400 scale-110"
              : "hover:bg-serene-50"
          )}
          style={{
            backgroundColor: selectedMood === mood.type ? `${mood.color}20` : 'transparent',
            borderColor: mood.color
          }}
          onClick={() => onMoodSelect(mood.type)}
          type="button"
        >
          <span className="text-4xl">{mood.emoji}</span>
          <span className="text-xs font-medium">{mood.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
