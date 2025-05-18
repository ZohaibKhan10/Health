
import { WaterTracker } from "@/components/wellness/WaterTracker";
import { BreathingAnimation } from "@/components/wellness/BreathingAnimation";
import { MealLogger } from "@/components/wellness/MealLogger";
import { SleepTracker } from "@/components/wellness/SleepTracker";
import { FitnessRoutine } from "@/components/wellness/FitnessRoutine";
import { StretchSequence } from "@/components/wellness/StretchSequence";
import { WeightTracker } from "@/components/wellness/WeightTracker";
import { motion } from "@/components/ui/motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, CupSoda, Utensils, Bed, Move, Weight } from "lucide-react";

const Wellness = () => {
  return (
    <div className="container max-w-6xl mx-auto space-y-8 animate-fade-in">
      <motion.h1 
        className="text-3xl font-serif text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Wellness Tracking
        </span>
      </motion.h1>
      
      <motion.div 
        className="text-center text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Monitor your daily wellness activities
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <WaterTracker />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <MealLogger />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <SleepTracker />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <WeightTracker />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <BreathingAnimation />
      </motion.div>
      
      <Tabs defaultValue="fitness" className="w-full mt-8">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-4">
          <TabsTrigger value="fitness" className="flex gap-2 items-center">
            <Dumbbell className="h-4 w-4" />
            <span>Fitness Routine</span>
          </TabsTrigger>
          <TabsTrigger value="stretch" className="flex gap-2 items-center">
            <Move className="h-4 w-4" />
            <span>Stretch Sequence</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="fitness">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <FitnessRoutine />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="stretch">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <StretchSequence />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wellness;
