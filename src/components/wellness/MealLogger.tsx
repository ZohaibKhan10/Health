
import { useState } from "react";
import { useWellnessStore, Meal } from "@/services/wellnessService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/services/dataService";
import { Utensils, Plus, Clock, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const MealLogger = () => {
  const { meals, addMeal, deleteMeal, getTodayMeals, getTodayCalories } = useWellnessStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  
  const todayMeals = getTodayMeals();
  const totalCalories = getTodayCalories();
  
  const handleAddMeal = () => {
    if (!name || !calories || !time) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(Number(calories))) {
      toast({
        title: "Invalid calories",
        description: "Calories must be a number",
        variant: "destructive"
      });
      return;
    }
    
    const newMeal: Omit<Meal, 'id'> = {
      date: formatDate(new Date()),
      name,
      calories: Number(calories),
      time,
      type
    };
    
    addMeal(newMeal);
    toast({
      title: "Meal added",
      description: "Your meal has been logged"
    });
    
    // Reset form
    setName("");
    setCalories("");
    setTime("");
    setType("breakfast");
    setIsDialogOpen(false);
  };
  
  const handleDeleteMeal = (id: string) => {
    deleteMeal(id);
    toast({
      title: "Meal deleted",
      description: "Your meal has been removed"
    });
  };
  
  // Get current time in HH:MM format for default value
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  
  const openNewMealDialog = () => {
    setName("");
    setCalories("");
    setTime(getCurrentTime());
    setType("breakfast");
    setIsDialogOpen(true);
  };
  
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40">
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          Meal Logger
        </CardTitle>
        <CardDescription>
          Track your daily meals and caloric intake
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 pt-2">
        <div className="mb-4 text-center">
          <div className="text-3xl font-bold">{totalCalories}</div>
          <div className="text-sm text-muted-foreground">calories today</div>
        </div>
        
        <div className="max-h-64 overflow-y-auto scrollbar-thin">
          {todayMeals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meal</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayMeals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell className="font-medium">
                      <div className="font-medium">{meal.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{meal.type}</div>
                    </TableCell>
                    <TableCell>{meal.time}</TableCell>
                    <TableCell>{meal.calories}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteMeal(meal.id)}
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
              No meals logged today. Add your first meal.
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end bg-slate-50 dark:bg-slate-900/50 border-t">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewMealDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log a Meal</DialogTitle>
              <DialogDescription>
                Record what you've eaten to track your nutrition
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Meal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Grilled Chicken Salad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 350"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Meal Type</Label>
                <Select 
                  value={type} 
                  onValueChange={(value) => setType(value as "breakfast" | "lunch" | "dinner" | "snack")}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMeal}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
