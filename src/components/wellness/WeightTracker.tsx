
import { useState, useRef, useEffect } from "react";
import { useWellnessStore, WeightEntry } from "@/services/wellnessService";
import { format, subDays, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "@/components/ui/motion";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Weight, Plus, Trash2, Edit } from "lucide-react";
import { formatDate } from "@/services/dataService";
import { toast } from "@/hooks/use-toast";

export const WeightTracker = () => {
  const { weightEntries, addWeightEntry, updateWeightEntry, deleteWeightEntry, getRecentWeightEntries } = useWellnessStore();
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // For focusing the weight input
  const weightInputRef = useRef<HTMLInputElement>(null);

  // Generate chart data whenever weight entries change
  useEffect(() => {
    const recentEntries = getRecentWeightEntries(30);
    
    // If we have no data, create placeholder data points
    if (recentEntries.length === 0) {
      const placeholderData = Array.from({ length: 5 }).map((_, i) => ({
        date: format(subDays(new Date(), 4 - i), 'MMM dd'),
        weight: 0,
        isEmpty: true
      }));
      setChartData(placeholderData);
      return;
    }
    
    // Process actual data
    const processedData = recentEntries.map(entry => ({
      date: format(parseISO(entry.date), 'MMM dd'),
      weight: entry.weight,
      isEmpty: false,
      originalDate: entry.date,
      note: entry.note
    }));
    
    setChartData(processedData);
  }, [weightEntries, getRecentWeightEntries]);

  const handleAddWeight = () => {
    if (!weight || isNaN(Number(weight))) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight",
        variant: "destructive"
      });
      return;
    }

    const today = formatDate(new Date());
    
    if (editingEntry) {
      // Update existing entry
      updateWeightEntry(editingEntry.id, {
        weight: Number(weight),
        note
      });
      toast({
        title: "Weight updated",
        description: "Your weight entry has been updated"
      });
    } else {
      // Add new entry
      addWeightEntry({
        date: today,
        weight: Number(weight),
        note: note.trim() || undefined
      });
      toast({
        title: "Weight added",
        description: "Your weight has been recorded"
      });
    }
    
    // Reset form
    setWeight("");
    setNote("");
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (entry: WeightEntry) => {
    setWeight(String(entry.weight));
    setNote(entry.note || "");
    setEditingEntry(entry);
    setIsDialogOpen(true);
    
    // Focus the weight input after dialog opens
    setTimeout(() => {
      if (weightInputRef.current) {
        weightInputRef.current.focus();
      }
    }, 100);
  };

  const handleDelete = (id: string) => {
    deleteWeightEntry(id);
    toast({
      title: "Entry deleted",
      description: "Your weight entry has been removed"
    });
  };

  const openNewEntryDialog = () => {
    setWeight("");
    setNote("");
    setEditingEntry(null);
    setIsDialogOpen(true);
    
    // Focus the weight input after dialog opens
    setTimeout(() => {
      if (weightInputRef.current) {
        weightInputRef.current.focus();
      }
    }, 100);
  };
  
  // Custom chart config
  const chartConfig = {
    weight: {
      label: "Weight",
      theme: {
        light: "#9b87f5",
        dark: "#9b87f5",
      },
    }
  };
  
  // Find minimum and maximum weight values for chart scaling
  const weights = chartData.filter(item => !item.isEmpty).map(item => item.weight);
  const minWeight = weights.length > 0 ? Math.floor(Math.min(...weights) - 1) : 0;
  const maxWeight = weights.length > 0 ? Math.ceil(Math.max(...weights) + 1) : 100;
  
  // Get recent entries for the table
  const recentEntries = getRecentWeightEntries(10).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/40 dark:to-indigo-950/40">
        <CardTitle className="flex items-center gap-2">
          <Weight className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Weight Tracker
        </CardTitle>
        <CardDescription>
          Track your weight progress over time
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-6 pt-2">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                domain={[minWeight, maxWeight]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                width={30}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--color-weight, #9b87f5)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                isAnimationActive={true}
                animationDuration={1500}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="px-6 pb-4">
          <motion.div 
            className="overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-md p-4 max-h-60 overflow-y-auto scrollbar-thin">
              {recentEntries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{format(parseISO(entry.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{entry.weight} kg</TableCell>
                        <TableCell className="max-w-[150px] truncate">{entry.note || "—"}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No weight entries yet. Add your first weight record.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end bg-slate-50 dark:bg-slate-900/50 border-t">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewEntryDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Weight
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit Weight Entry" : "Add Weight Entry"}</DialogTitle>
              <DialogDescription>
                {editingEntry 
                  ? "Update your weight record" 
                  : "Record your current weight to track progress"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter weight in kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  ref={weightInputRef}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  placeholder="e.g., After morning workout"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddWeight}>
                {editingEntry ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
