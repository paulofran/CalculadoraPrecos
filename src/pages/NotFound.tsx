
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30">
      <div className="text-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-8xl font-bold mb-4">404</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-xl text-muted-foreground mb-8">
            Página não encontrada
          </p>
          <Link to="/">
            <Button className="mt-2" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o início
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
