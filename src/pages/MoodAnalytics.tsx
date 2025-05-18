
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Calendar as CalendarIcon, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/services/dataService";
import MoodChart from "@/components/mood/MoodChart";
import MoodCalendarView from "@/components/mood/MoodCalendarView";

const MoodAnalytics = () => {
  const { moodEntries } = useStore();

  return (
    <div className="container max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif">Mood Analytics</h1>
          <p className="text-muted-foreground mt-2">Track and analyze your mood patterns</p>
        </div>
        
        <Link to="/mood">
          <Button>
            Add New Entry
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Mood Calendar</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">View your daily mood entries</p>
            <MoodCalendarView moodEntries={moodEntries} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 overflow-x-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Mood Trends</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground items-center mb-4">Track how your mood changes over time</p>
            {moodEntries.length > 0 ? (
              <MoodChart moodEntries={moodEntries} />
            ) : (
              <div className="flex flex-col items-center justify-center h-52 text-muted-foreground">
                <Info className="h-12 w-12 mb-4 opacity-50" />
                <p>No mood entries yet. Start tracking your mood to see trends.</p>
                <Link to="/mood" className="mt-4">
                  <Button variant="secondary">Add Your First Entry</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodAnalytics;
