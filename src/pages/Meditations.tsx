
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Play } from "lucide-react";
import { BreathingExercise } from "@/components/meditation/BreathingExercise";

interface MeditationCardProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  onClick: () => void;
}

const MeditationCard = ({ title, description, duration, level, onClick }: MeditationCardProps) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-40 bg-gradient-to-b from-serene-200 to-serene-50 flex items-center justify-center">
      <Clock className="h-12 w-12 text-serene-700" />
    </div>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Duration:</span>
        <span>{duration}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Level:</span>
        <span>{level}</span>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full" onClick={onClick}>
        <Play className="mr-2 h-4 w-4" />
        Start
      </Button>
    </CardFooter>
  </Card>
);

const Meditations = () => {
  const [selectedMeditation, setSelectedMeditation] = useState<string | null>(null);

  const handleStartMeditation = (title: string) => {
    setSelectedMeditation(title);
  };

  const handleBackToList = () => {
    setSelectedMeditation(null);
  };

  return (
    <div className="container max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif">Meditations</h1>
        <p className="text-muted-foreground mt-2">Find calm with guided practices</p>
      </div>

      {selectedMeditation ? (
        <Card className="p-6">
          <Button variant="outline" onClick={handleBackToList} className="mb-6">
            Back to meditations
          </Button>
          <h2 className="text-2xl font-medium mb-4">{selectedMeditation}</h2>
          
          {selectedMeditation === "Breathing Exercise" ? (
            <BreathingExercise />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                This meditation is currently under development and will be available soon.
              </p>
            </div>
          )}
        </Card>
      ) : (
        <Tabs defaultValue="breathing" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="guided">Guided</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>
          
          <TabsContent value="breathing">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MeditationCard 
                title="Breathing Exercise"
                description="4-7-8 breathing technique to reduce anxiety and help with sleep"
                duration="5 minutes"
                level="Beginner"
                onClick={() => handleStartMeditation("Breathing Exercise")}
              />
              <MeditationCard 
                title="Box Breathing"
                description="Equal breathing technique used by athletes and navy seals"
                duration="10 minutes"
                level="Intermediate"
                onClick={() => handleStartMeditation("Box Breathing")}
              />
              <MeditationCard 
                title="Alternate Nostril Breathing"
                description="Traditional yoga breathing practice for balance"
                duration="8 minutes"
                level="Intermediate"
                onClick={() => handleStartMeditation("Alternate Nostril Breathing")}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="guided">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MeditationCard 
                title="Body Scan Meditation"
                description="Guided practice to increase body awareness"
                duration="15 minutes"
                level="Beginner"
                onClick={() => handleStartMeditation("Body Scan Meditation")}
              />
              <MeditationCard 
                title="Loving-Kindness Meditation"
                description="Cultivate compassion for yourself and others"
                duration="10 minutes"
                level="All Levels"
                onClick={() => handleStartMeditation("Loving-Kindness Meditation")}
              />
              <MeditationCard 
                title="Mindful Awareness"
                description="Present moment awareness practice"
                duration="12 minutes"
                level="All Levels"
                onClick={() => handleStartMeditation("Mindful Awareness")}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="sleep">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MeditationCard 
                title="Sleep Wind Down"
                description="Gentle practice to prepare for restful sleep"
                duration="20 minutes"
                level="All Levels"
                onClick={() => handleStartMeditation("Sleep Wind Down")}
              />
              <MeditationCard 
                title="Bedtime Body Scan"
                description="Release tension before sleep"
                duration="15 minutes"
                level="Beginner"
                onClick={() => handleStartMeditation("Bedtime Body Scan")}
              />
              <MeditationCard 
                title="Sleep Sounds"
                description="Ambient sounds for deep sleep"
                duration="60 minutes"
                level="All Levels"
                onClick={() => handleStartMeditation("Sleep Sounds")}
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Meditations;
