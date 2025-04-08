import { ParkingCalculator } from "@/components/ParkingCalculator";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Aplicar o tema escuro por padrão
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      return newTheme;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-page">
      <header className="py-4 border-b bg-background/50 backdrop-blur-sm shadow-sm border-b-primary/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-1"></div>
          <div className="flex justify-center flex-1">
            <img 
              src="/logo.png" 
              alt="AeroPark Confins" 
              className="h-10 w-auto"
              onError={(e) => {
                // Fallback se a imagem não existir
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                
                // Criar um elemento de texto como fallback
                const parent = target.parentElement;
                if (parent) {
                  const textElement = document.createElement('div');
                  textElement.className = 'text-xl font-bold text-primary';
                  textElement.textContent = 'AeroPark Confins';
                  parent.appendChild(textElement);
                }
              }}
            />
          </div>
          <div className="flex justify-end flex-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Alternar tema"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 container py-12">
        <ParkingCalculator />
      </div>
      
      <footer className="py-6 border-t bg-background/50 backdrop-blur-sm border-t-primary/20">
        <div className="container mx-auto">
          <div className="flex justify-center items-center">
            <div className="text-sm text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} AeroPark Confins. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
