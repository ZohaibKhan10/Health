import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "@/components/ui/motion";

const Login = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - in real app would connect to backend
    setTimeout(() => {
      // Store user info in localStorage for demo purposes
      // In a real app, you would use proper auth tokens
      localStorage.setItem("user", JSON.stringify({ 
        email,
        name: email.split("@")[0],
        isLoggedIn: true 
      }));
      
      toast({
        title: "Login successful",
        description: "Welcome back to Serene Flow!",
      });
      
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      // Store user info in localStorage for demo purposes
      localStorage.setItem("user", JSON.stringify({ 
        email,
        name,
        isLoggedIn: true 
      }));
      
      toast({
        title: "Registration successful",
        description: "Welcome to Serene Flow! Your wellness journey begins now.",
      });
      
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/d3aceacc-ff01-444a-91c9-68a5c848485e.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md relative z-10">
        <motion.div 
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 2, 0, -2, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut" 
              }}
            >
              <Heart className="text-white h-8 w-8 drop-shadow-lg" />
            </motion.div>
            <h1 className="text-3xl font-serif font-medium bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
              Serene Flow
            </h1>
          </div>
          <p className="text-white/90 text-center drop-shadow-md">
            Your personal wellness companion
          </p>
        </motion.div>
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="border-serene-100 backdrop-blur-md bg-white/80">
            <CardHeader>
              <CardTitle className="text-center">Welcome</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" onValueChange={(value) => setActiveTab(value as "login" | "register")}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="hello@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        className="bg-white/90"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" className="p-0 h-auto text-xs">
                          Forgot password?
                        </Button>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="bg-white/90"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                        className="bg-white/90"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-register">Email</Label>
                      <Input 
                        id="email-register" 
                        type="email" 
                        placeholder="hello@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        className="bg-white/90"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-register">Password</Label>
                      <Input 
                        id="password-register" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="bg-white/90"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-xs text-center text-muted-foreground">
                By continuing, you agree to Serene Flow's Terms of Service and Privacy Policy.
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
