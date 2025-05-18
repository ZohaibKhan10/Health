import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bed, Plus, Calendar } from "lucide-react";
import { useWellnessStore, SleepEntry } from "@/services/wellnessService";
import { formatDate } from "@/services/dataService";
import { format, differenceInHours, parseISO, subDays, differenceInMinutes } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "@/components/ui/motion";

export const SleepTracker = () => {
  const { addSleepEntry, getRecentSleepEntries } = useWellnessStore();
  const recentEntries = getRecentSleepEntries(7);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState(formatDate(new Date()));
  const [bedTime, setBedTime] = useState("22:00");
  const [wakeTime, setWakeTime] = useState("06:00");
  const [quality, setQuality] = useState<SleepEntry["quality"]>(4);
  const [notes, setNotes] = useState("");
  
  const calculateHoursSlept = (bed: string, wake: string): number => {
    // Create date objects for calculation
    const today = new Date();
    const bedDate = new Date(today);
    const wakeDate = new Date(today);
    
    const [bedHours, bedMinutes] = bed.split(':').map(Number);
    const [wakeHours, wakeMinutes] = wake.split(':').map(Number);
    
    bedDate.setHours(bedHours, bedMinutes, 0);
    wakeDate.setHours(wakeHours, wakeMinutes, 0);
    
    // Handle case where wake time is the next day
    if (wakeDate < bedDate) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }
    
    // Calculate difference in hours, rounded to 1 decimal place
    const diffMinutes = differenceInMinutes(wakeDate, bedDate);
    const diffHours = diffMinutes / 60;
    return Math.round(diffHours * 10) / 10;
  };
  
  const handleAddSleep = () => {
    const hoursSlept = calculateHoursSlept(bedTime, wakeTime);
    
    if (hoursSlept <= 0) {
      toast({
        title: "Invalid Times",
        description: "Wake time must be after bed time",
        variant: "destructive",
      });
      return;
    }
    
    const newEntry: Omit<SleepEntry, "id"> = {
      date,
      hoursSlept,
      bedTime,
      wakeTime,
      quality,
      notes: notes.trim() || undefined
    };
    
    addSleepEntry(newEntry);
    toast({
      title: "Sleep Entry Added",
      description: `${hoursSlept} hours of sleep recorded`,
    });
    
    // Reset form
    setDate(formatDate(new Date()));
    setBedTime("22:00");
    setWakeTime("06:00");
    setQuality(4);
    setNotes("");
    setIsDialogOpen(false);
  };
  
  // Prepare data for chart
  const chartData = recentEntries.map(entry => ({
    date: format(new Date(entry.date), "MMM dd"),
    hours: entry.hoursSlept,
    quality: entry.quality || 3
  }));
  
  // Get latest entry for display
  const latestEntry = recentEntries.length > 0 
    ? recentEntries[recentEntries.length - 1] 
    : null;
  
  return (
    <Card className="border border-indigo-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-indigo-600" />
            Sleep Tracker
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" /> Log Sleep
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestEntry ? (
          <motion.div 
            className="p-3 bg-indigo-50 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">Last Sleep:</span>
              <span className="text-sm">{format(new Date(latestEntry.date), "MMM dd")}</span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="text-sm">
                {latestEntry.bedTime} → {latestEntry.wakeTime}
              </div>
              <div className="text-lg font-bold">{latestEntry.hoursSlept} hrs</div>
            </div>
            {latestEntry.quality && (
              <div className="mt-1 text-sm">
                Quality: {Array(latestEntry.quality).fill("⭐").join("")}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No sleep entries yet. Log your first night!
          </div>
        )}
        
        {chartData.length > 1 && (
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Recent Sleep History
            </h3>
            <div className="h-60 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12} 
                  />
                  <YAxis 
                    domain={[0, 12]} 
                    fontSize={12} 
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} hours`, "Sleep"]} 
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#6366f1"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Add Sleep Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Sleep</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label htmlFor="date" className="col-span-1">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label htmlFor="bedTime" className="col-span-1">
                  Bed Time
                </Label>
                <Input
                  id="bedTime"
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label htmlFor="wakeTime" className="col-span-1">
                  Wake Time
                </Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label htmlFor="quality" className="col-span-1">
                  Quality
                </Label>
                <div className="col-span-3 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`px-2 ${star <= (quality || 0) ? "text-yellow-500" : "text-gray-300"}`}
                      onClick={() => setQuality(star as SleepEntry["quality"])}
                    >
                      ⭐
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 items-start">
                <Label htmlFor="notes" className="col-span-1 pt-2">
                  Notes
                </Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="col-span-3"
                  placeholder="Optional notes about your sleep"
                />
              </div>
              
              {bedTime && wakeTime && (
                <div className="text-center font-medium">
                  Total sleep: {calculateHoursSlept(bedTime, wakeTime)} hours
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSleep}>Log Sleep</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
