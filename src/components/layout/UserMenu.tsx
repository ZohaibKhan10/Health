
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const UserMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    
    toast({
      title: "Logged out successfully",
      description: "We hope to see you again soon!",
    });
    
    // Redirect to login page
    navigate("/login");
  };

  if (!userInfo) {
    return null;
  }

  const userInitials = userInfo.name
    ? userInfo.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full flex items-center justify-center p-0 focus-visible:ring-offset-0"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt={userInfo.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium">{userInfo.name || "User"}</p>
          <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer text-red-500 focus:text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
