
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useStore, Affirmation } from "@/services/dataService";
import { cn } from "@/lib/utils";

interface AffirmationCardProps {
  affirmation: Affirmation;
  className?: string;
}

const AffirmationCard = ({ affirmation, className }: AffirmationCardProps) => {
  const { toggleFavoriteAffirmation } = useStore();
  
  return (
    <Card className={cn("watercolor-card overflow-hidden", className)}>
      <CardContent className="p-6 flex items-center justify-between">
        <p className="font-medium text-lg font-serif">{affirmation.text}</p>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => toggleFavoriteAffirmation(affirmation.id)}
          className="text-gray-500 hover:text-glow-500"
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-all", 
              affirmation.isFavorite && "fill-glow-500 text-glow-500"
            )} 
          />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AffirmationCard;
