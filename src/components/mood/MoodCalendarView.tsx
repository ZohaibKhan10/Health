
import { useState } from "react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MoodEntry, formatDate } from "@/services/dataService";

interface MoodCalendarViewProps {
  moodEntries: MoodEntry[];
}

const moodColors: Record<string, string> = {
  "😁": "#22c55e", // Great - Green
  "🙂": "#4ade80", // Good - Light Green
  "😐": "#fbbf24", // Neutral - Yellow
  "🙁": "#fb923c", // Down - Orange
  "😔": "#f87171", // Sad - Red
};

const MoodCalendarView = ({ moodEntries }: MoodCalendarViewProps) => {
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  // Calendar functions
  const handlePrevMonth = () => {
    setMonth(subMonths(month, 1));
  };
  
  const handleNextMonth = () => {
    setMonth(addMonths(month, 1));
  };

  // Get mood entry for a date
  const getMoodForDate = (date: Date) => {
    const entry = moodEntries.find(e => e.date === formatDate(date));
    return entry?.mood || null;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const entry = moodEntries.find(e => e.date === formatDate(date));
      setSelectedEntry(entry || null);
    } else {
      setSelectedEntry(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-medium">{format(month, "MMMM yyyy")}</h2>
        <button onClick={handleNextMonth} className="p-2">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      <Calendar
        mode="single"
        month={month}
        onMonthChange={setMonth}
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md border pointer-events-auto"
        modifiers={{
          hasMood: (date) => getMoodForDate(date) !== null,
          selected: (date) => selectedDate ? isSameDay(date, selectedDate) : false
        }}
        modifiersStyles={{
          hasMood: { backgroundColor: "rgba(147, 197, 253, 0.2)" }
        }}
        components={{
          DayContent: (props) => {
            const mood = getMoodForDate(props.date);
            return (
              <div className="flex flex-col items-center justify-center">
                <div className={`rounded-full ${mood ? 'text-white font-medium' : ''}`}
                     style={{
                       backgroundColor: mood ? moodColors[mood] : 'transparent',
                       width: '24px',
                       height: '24px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                     }}>
                  {props.date.getDate()}
                </div>
                {mood && <div className="text-xs mt-1">{mood}</div>}
              </div>
            );
          },
        }}
      />
      
      {selectedEntry && (
        <div className="mt-6 p-4 bg-accent/20 rounded-md space-y-2 border border-accent/30">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{format(new Date(selectedEntry.date), "MMMM d, yyyy")}</h3>
            <span className="text-2xl">{selectedEntry.mood}</span>
          </div>
          
          {selectedEntry.tags && selectedEntry.tags.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Activities:</p>
              <div className="flex flex-wrap gap-1">
                {selectedEntry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {selectedEntry.note && (
            <div>
              <Separator className="my-2" />
              <p className="text-sm text-muted-foreground mb-1">Notes:</p>
              <p className="text-sm">{selectedEntry.note}</p>
            </div>
          )}
        </div>
      )}
      
      {!selectedEntry && selectedDate && (
        <div className="text-center mt-6 text-sm p-2 bg-muted/20 rounded-md">
          No mood entry for {format(selectedDate, "MMMM d, yyyy")}
        </div>
      )}
      
      {!selectedEntry && !selectedDate && (
        <div className="text-center mt-6 text-sm p-2 bg-muted/20 rounded-md">
          Select a date to view mood details
        </div>
      )}
    </div>
  );
};

export default MoodCalendarView;
