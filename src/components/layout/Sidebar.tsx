import { 
  Calendar, 
  Heart, 
  Home, 
  MessageSquare, 
  Settings, 
  Clock, 
  Smile, 
  Compass,
  User,
  BookOpen,
  Activity
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    title: "Mood Tracker",
    path: "/mood",
    icon: Smile,
    subItems: [
      { title: "Daily Check-in", path: "/mood" },
      { title: "Mood Analytics", path: "/mood/analytics" }
    ]
  },
  {
    title: "Habit Tracker",
    path: "/habits",
    icon: Calendar,
  },
  {
    title: "Affirmations",
    path: "/affirmations",
    icon: Heart,
  },
  {
    title: "Meditations",
    path: "/meditations",
    icon: Clock,
  },
  {
    title: "Wellness",
    path: "/wellness",
    icon: Activity,
  },
  {
    title: "Wellness Coach",
    path: "/coach",
    icon: MessageSquare,
  },
  {
    title: "Document Reader",
    path: "/documents",
    icon: BookOpen,
  },
  {
    title: "Explore",
    path: "/explore",
    icon: Compass,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  }
];

export const Sidebar = () => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isActiveSubRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="px-3 py-4 flex items-center">
          <SidebarTrigger className="p-0 mr-2 h-9 w-9"/>
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="text-purple-500 h-6 w-6" />
            <span className="font-serif text-2xl font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Serene Flow
            </span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActiveRoute(item.path)}
                  >
                    <Link to={item.path} className="flex items-center space-x-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  
                  {item.subItems && isActiveRoute(item.path) && (
                    <SidebarMenuSub>
                      {item.subItems.map(subItem => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActiveSubRoute(subItem.path)}
                          >
                            <Link to={subItem.path}>
                              {subItem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4 px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/profile" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
};
