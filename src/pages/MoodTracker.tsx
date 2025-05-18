
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useStore, formatDate, MoodType } from "@/services/dataService";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import MoodSelector from "@/components/mood/MoodSelector";
import { format } from "date-fns";

interface ActivityTag {
  name: string;
  selected: boolean;
}

const MoodTracker = () => {
  const { addMoodEntry, getTodaysMoodEntry } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check for existing entry today
  const todayEntry = getTodaysMoodEntry();
  
  // State for mood selection
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(todayEntry?.mood || null);
  const [moodLevel, setMoodLevel] = useState<number>(todayEntry?.moodLevel || 5);
  const [note, setNote] = useState<string>(todayEntry?.note || "");
  
  // State for activity tags
  const [activityTags, setActivityTags] = useState<ActivityTag[]>([
    { name: "Exercise", selected: todayEntry?.tags?.includes("Exercise") || false },
    { name: "Work", selected: todayEntry?.tags?.includes("Work") || false },
    { name: "Family", selected: todayEntry?.tags?.includes("Family") || false },
    { name: "Friends", selected: todayEntry?.tags?.includes("Friends") || false },
    { name: "Sleep", selected: todayEntry?.tags?.includes("Sleep") || false },
    { name: "Meditation", selected: todayEntry?.tags?.includes("Meditation") || false },
    { name: "Reading", selected: todayEntry?.tags?.includes("Reading") || false },
    { name: "Travel", selected: todayEntry?.tags?.includes("Travel") || false },
    { name: "Outdoors", selected: todayEntry?.tags?.includes("Outdoors") || false },
    { name: "Food", selected: todayEntry?.tags?.includes("Food") || false },
    { name: "Creative", selected: todayEntry?.tags?.includes("Creative") || false },
    { name: "Learning", selected: todayEntry?.tags?.includes("Learning") || false },
    { name: "Self-care", selected: todayEntry?.tags?.includes("Self-care") || false },
    { name: "Resting", selected: todayEntry?.tags?.includes("Resting") || false },
  ]);

  // Toggle activity tag selection
  const toggleActivityTag = (index: number) => {
    const updatedTags = [...activityTags];
    updatedTags[index].selected = !updatedTags[index].selected;
    setActivityTags(updatedTags);
  };

  // Save mood entry
  const handleSaveEntry = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Pick an emoji that represents how you're feeling.",
        variant: "destructive"
      });
      return;
    }

    // Get selected activity tags
    const selectedTags = activityTags
      .filter(tag => tag.selected)
      .map(tag => tag.name);

    // Create mood entry
    addMoodEntry({
      date: formatDate(new Date()),
      mood: selectedMood,
      moodLevel: moodLevel,
      note: note,
      tags: selectedTags
    });

    toast({
      title: "Mood tracked successfully!",
      description: `Your mood entry for ${format(new Date(), "MMMM d")} has been saved.`,
    });

    // Navigate to analytics page
    navigate("/mood/analytics");
  };

  const getMoodLevelLabel = () => {
    if (moodLevel <= 3) return "Not good";
    if (moodLevel <= 7) return "Neutral";
    return "Amazing";
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif">Track Your Mood</h1>
        <p className="text-muted-foreground mt-2">
          Record how you're feeling for {format(new Date(), "MMMM d, yyyy")}
        </p>
      </div>
      
      <Card className="border-serene-100">
        <CardHeader className="bg-serene-50/50">
          <CardTitle className="text-xl text-center">
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {/* Mood Emoji Selection */}
          <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
          
          {/* Mood Level Slider */}
          <div className="space-y-2">
            <p className="text-center font-medium">Fine-tune your mood level (1-10)</p>
            <Slider
              value={[moodLevel]}
              min={1}
              max={10}
              step={1}
              onValueChange={(values) => setMoodLevel(values[0])}
              className="mt-6"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Not good</span>
              <span className="font-medium">{getMoodLevelLabel()} ({moodLevel}/10)</span>
              <span>Amazing</span>
            </div>
          </div>

          {/* Activity Tags */}
          <div className="space-y-2">
            <p className="font-medium">What activities have you done today? (optional)</p>
            <ScrollArea className="h-24 border rounded-md p-2">
              <div className="flex flex-wrap gap-2">
                {activityTags.map((tag, index) => (
                  <Badge
                    key={tag.name}
                    variant={tag.selected ? "default" : "outline"}
                    className={`cursor-pointer hover:bg-accent/50 ${tag.selected ? "" : "bg-background"}`}
                    onClick={() => toggleActivityTag(index)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <p className="font-medium">Add some notes about your day (optional)</p>
            <Textarea
              placeholder="What's on your mind today?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => navigate("/mood/analytics")}>
              View Analytics
            </Button>
            <Button onClick={handleSaveEntry} className="px-8">
              Save Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;
