
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),rgba(0,0,0,0))]" />
      
      <div className="text-center z-10 space-y-8">
        <h1 className="text-[150px] font-bold text-primary animate-pulse relative">
          <span className="absolute inset-0 text-accent blur-sm animate-pulse">404</span>
          404
        </h1>
        <p className="text-2xl text-foreground mb-8 animate-fade-in">
          Oops! Looks like you've ventured into the void...
        </p>
        <br></br>
        <Link to="/">
          <Button className="glass hover:bg-primary/20 transition-all duration-300 group">
            <Home className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Return to Safety
          </Button>
        </Link>
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px] [mask-image:radial-gradient(white,transparent_85%)]" />
      </div>
    </div>
  );
};

export default NotFound;
