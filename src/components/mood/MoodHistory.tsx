
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoodEntry, GratitudeEntry } from "@/services/dataService";
import MoodCard from "./MoodCard";

interface MoodHistoryProps {
  moodEntries: MoodEntry[];
  gratitudeEntries: GratitudeEntry[];
}

const MoodHistory = ({ moodEntries, gratitudeEntries }: MoodHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get mood entry for selected date
  const formattedSelectedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const moodEntry = moodEntries.find(entry => entry.date === formattedSelectedDate);
  const gratitudeEntry = gratitudeEntries.find(entry => entry.date === formattedSelectedDate);
  
  // Get dates with entries for highlighting in calendar
  const datesWithMoodEntries = new Set(moodEntries.map(entry => entry.date));
  const datesWithGratitudeEntries = new Set(gratitudeEntries.map(entry => entry.date));

  // Create a function to determine if a date has entries
  const hasEntries = (date: Date): boolean => {
    const dateString = format(date, 'yyyy-MM-dd');
    return datesWithMoodEntries.has(dateString) || datesWithGratitudeEntries.has(dateString);
  };

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6">
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    modifiers={{
                      hasEntry: (date) => hasEntries(date),
                    }}
                    modifiersClassNames={{
                      hasEntry: "border-2 border-serene-400",
                    }}
                  />
                </PopoverContent>
              </Popover>
              
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full border-2 border-serene-400"></div>
                  <span>Days with entries</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {moodEntry || gratitudeEntry ? (
          <>
            {moodEntry && (
              <MoodCard moodEntry={moodEntry} />
            )}
            
            {gratitudeEntry && (
              <Card className="overflow-hidden border border-calm-100">
                <div className="bg-calm-50 py-2 px-4">
                  <h3 className="font-medium">Gratitude</h3>
                </div>
                <CardContent className="p-4">
                  <p className="italic text-gray-700">{gratitudeEntry.text}</p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
            {selectedDate ? (
              <>
                <p>No entries for {format(selectedDate, 'MMMM d, yyyy')}</p>
                <p className="mt-2">Select another date or create a new entry from the Today page.</p>
              </>
            ) : (
              <p>Please select a date to view entries.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodHistory;
