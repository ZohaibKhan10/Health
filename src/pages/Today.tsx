import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Heart, Smile, Clock, MessageSquare, ChevronRight } from "lucide-react";
import { useStore, ensureDailyAffirmation, formatDate } from "@/services/dataService";
import AffirmationCard from "@/components/affirmations/AffirmationCard";
import MoodSelector from "@/components/mood/MoodSelector";
import { Link } from "react-router-dom";
import { HabitsList } from "@/components/habits/HabitsList";
import { StudyTimer } from "@/components/focus/StudyTimer";
import { BreathingExercise } from "@/components/meditation/BreathingExercise";
import { motion } from "@/components/ui/motion";

const Today = () => {
  ensureDailyAffirmation();
  
  const { 
    dailyAffirmation,
    habits,
    getTodaysMoodEntry,
  } = useStore();
  
  const todaysMoodEntry = getTodaysMoodEntry();
  const completedHabits = habits.filter(habit => 
    habit.completedDates.includes(formatDate(new Date()))
  ).length;

  // Get user info from localStorage
  const [userName, setUserName] = useState("friend");
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const { name } = JSON.parse(user);
      setUserName(name || "friend");
    }
  }, []);

  return (
    <div className="container max-w-6xl mx-auto space-y-8 animate-fade-in">
      <motion.h1 
        className="text-3xl font-serif text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to Serene Flow
        </span>
        <motion.span 
          className="inline-block ml-2"
          initial={{ rotate: -10 }}
          animate={{ rotate: [0, -10, 0] }}
          transition={{ duration: 0.6, ease: "easeInOut", repeat: 3, repeatDelay: 4 }}
        >
          <Heart className="inline h-6 w-6 text-pink-500" />
        </motion.span>
      </motion.h1>
      
      <motion.div 
        className="text-center text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {userName}!
      </motion.div>
      
      {/* Daily Affirmation */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {dailyAffirmation && (
          <AffirmationCard affirmation={dailyAffirmation} className="max-w-xl w-full" />
        )}
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border border-serene-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">
                <div className="flex items-center gap-2">
                  <Smile className="h-5 w-5" />
                  <span>Today's Mood</span>
                </div>
              </CardTitle>
              <Link to="/mood">
                <Button variant="ghost" size="sm" className="gap-1">
                  <span>View Details</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {todaysMoodEntry ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-5xl">{todaysMoodEntry.mood}</div>
                  <p className="text-muted-foreground text-center">
                    {todaysMoodEntry.note || "No notes added for today."}
                  </p>
                  {todaysMoodEntry.tags && todaysMoodEntry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {todaysMoodEntry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-accent/30 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-muted-foreground">You haven't logged your mood today</p>
                  <Link to="/mood">
                    <Button>
                      <Smile className="mr-2 h-4 w-4" />
                      Check In
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Habits Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border border-serene-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Daily Habits</span>
                </div>
              </CardTitle>
              <Link to="/habits">
                <Button variant="ghost" size="sm" className="gap-1">
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {habits.length > 0 ? (
                <>
                  <div className="text-sm mb-4 text-muted-foreground">
                    {completedHabits} of {habits.length} habits completed today
                  </div>
                  <HabitsList limit={3} />
                </>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-muted-foreground">You haven't created any habits yet</p>
                  <Link to="/habits">
                    <Button>
                      <Check className="mr-2 h-4 w-4" />
                      Create Habits
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Quick Access Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="md:col-span-2"
        >
          <Card className="border border-serene-100">
            <CardHeader>
              <CardTitle className="text-xl">Quick Access Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="breathe" className="w-full">
                <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
                  <TabsTrigger value="breathe" className="flex gap-2 items-center">
                    <Clock className="h-4 w-4" />
                    <span>Breathe</span>
                  </TabsTrigger>
                  <TabsTrigger value="timer" className="flex gap-2 items-center">
                    <Clock className="h-4 w-4" />
                    <span>Focus Timer</span>
                  </TabsTrigger>
                  <TabsTrigger value="coach" className="flex gap-2 items-center">
                    <MessageSquare className="h-4 w-4" />
                    <span>AI Coach</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="breathe">
                  <BreathingExercise />
                </TabsContent>
                
                <TabsContent value="timer">
                  <StudyTimer />
                </TabsContent>
                
                <TabsContent value="coach">
                  <div className="flex flex-col items-center gap-4 py-4">
                    <p className="text-muted-foreground text-center">
                      Chat with your AI wellness coach for personalized advice and support
                    </p>
                    <Link to="/coach">
                      <Button>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Open Coach
                      </Button>
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Today;
