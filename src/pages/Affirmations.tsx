
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useStore } from "@/services/dataService";
import AffirmationCard from "@/components/affirmations/AffirmationCard";

const Affirmations = () => {
  const { affirmations, addAffirmation } = useStore();
  const [newAffirmation, setNewAffirmation] = useState("");

  const handleAddAffirmation = () => {
    if (newAffirmation.trim()) {
      addAffirmation({
        text: newAffirmation.trim()
      });
      setNewAffirmation("");
    }
  };

  const favoriteAffirmations = affirmations.filter(a => a.isFavorite);
  const otherAffirmations = affirmations.filter(a => !a.isFavorite);

  return (
    <div className="container max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-serif">Affirmations</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add a new affirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newAffirmation}
              onChange={(e) => setNewAffirmation(e.target.value)}
              placeholder="I am calm and centered in every situation"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddAffirmation();
                }
              }}
            />
            <Button onClick={handleAddAffirmation} disabled={!newAffirmation.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {favoriteAffirmations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-medium">Favorites</h2>
          <div className="grid grid-cols-1 gap-4">
            {favoriteAffirmations.map((affirmation) => (
              <AffirmationCard key={affirmation.id} affirmation={affirmation} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-xl font-medium">{favoriteAffirmations.length > 0 ? "All Affirmations" : "Affirmations"}</h2>
        <div className="grid grid-cols-1 gap-4">
          {otherAffirmations.map((affirmation) => (
            <AffirmationCard key={affirmation.id} affirmation={affirmation} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Affirmations;
