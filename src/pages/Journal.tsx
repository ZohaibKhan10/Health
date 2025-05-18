
import { useStore } from "@/services/dataService";
import MoodHistory from "@/components/mood/MoodHistory";

const Journal = () => {
  const { moodEntries, gratitudeEntries } = useStore();
  
  return (
    <div className="container max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-serif">Journal</h1>
      
      <MoodHistory 
        moodEntries={moodEntries}
        gratitudeEntries={gratitudeEntries}
      />
    </div>
  );
};

export default Journal;
