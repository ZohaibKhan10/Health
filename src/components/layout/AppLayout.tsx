
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "@/services/dataService";
import { useToast } from "@/components/ui/use-toast";
import UserMenu from "./UserMenu";

// Motion component with proper typing for main element
const motion = {
  div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`${className} animate-fade-in`} {...props}>{children}</div>
  ),
  main: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <main className={`${className} animate-fade-in`} {...props}>{children}</main>
  )
};

export const AppLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      setIsAuthenticated(false);
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        {/* Background containers for gradient effect */}
        <div className="fixed inset-0 bg-background z-0" />
        
        <div className="relative flex flex-1 z-10 w-full">
          <Sidebar />
          <motion.main
            className="flex-1 p-4 md:p-6 overflow-auto max-h-screen"
          >
            <div className="flex justify-end mb-2">
              <UserMenu />
            </div>
            <Outlet />
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
