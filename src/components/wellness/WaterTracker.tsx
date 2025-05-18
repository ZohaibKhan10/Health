
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CupSoda, Plus, Minus } from "lucide-react";
import { useWellnessStore } from "@/services/wellnessService";
import { motion } from "@/components/ui/motion";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const WaterTracker = () => {
  const { addWaterCup, removeWaterCup, setWaterGoal, getTodayWaterIntake } = useWellnessStore();
  const todayIntake = getTodayWaterIntake();
  const [isAddButtonActive, setIsAddButtonActive] = useState(false);
  
  // Calculate percentage of goal achieved
  const percentComplete = Math.min((todayIntake.cups / todayIntake.goal) * 100, 100);
  
  return (
    <Card className="border border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CupSoda className="h-5 w-5 text-blue-500" />
            Water Intake
          </span>
          <div className="flex items-center gap-2 text-sm">
            <span>Daily Goal:</span>
            <Select
              value={String(todayIntake.goal)}
              onValueChange={(value) => setWaterGoal(parseInt(value))}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num} cups
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={percentComplete} className="h-2" />
        
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex flex-wrap justify-center gap-2 max-w-xs">
              {Array.from({ length: todayIntake.goal }).map((_, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CupSoda 
                    size={36} 
                    className={`${
                      i < todayIntake.cups ? 'text-blue-500 fill-blue-500/70' : 'text-gray-300'
                    } transition-colors duration-300`} 
                  />
                  {i < todayIntake.cups && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="sr-only">Cup {i+1} filled</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={removeWaterCup}
            disabled={todayIntake.cups <= 0}
          >
            <Minus className="mr-1 h-4 w-4" /> Remove Cup
          </Button>
          
          <div className="text-center font-medium text-lg">
            {todayIntake.cups} / {todayIntake.goal} cups
          </div>
          
          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => {
                addWaterCup();
                setIsAddButtonActive(true);
                setTimeout(() => setIsAddButtonActive(false), 300);
              }}
              className={isAddButtonActive ? "bg-blue-600" : ""}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Cup
            </Button>
          </motion.div>
        </div>
        
        {percentComplete >= 100 && (
          <motion.div 
            className="text-center text-green-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            🎉 Daily goal achieved!
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
