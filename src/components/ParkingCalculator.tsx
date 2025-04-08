import React, { useState, useEffect } from "react";
import { DateTimePicker } from "./DateTimePicker";
import { 
  calculateParkingFee, 
  formatCurrency, 
  ParkingType,
  ParkingCalculationResult 
} from "@/utils/parkingCalculator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Calendar, Car, Warehouse, Umbrella, UmbrellaOff } from "lucide-react";
import { motion } from "framer-motion";
import { CopyQuoteButton } from "./CopyQuoteButton";

interface ResultCardProps {
  title: string;
  result: ParkingCalculationResult;
  className?: string;
  delay: number;
  icon: React.ReactNode;
}

const ResultCard = ({ title, result, className, delay, icon }: ResultCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: delay * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Card className={`result-card overflow-hidden shadow-md hover:shadow-card-hover border-t-4 border-t-primary/70 ${className}`}>
        <div className="card-header px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                {icon}
              </div>
              <h3 className="font-medium">{title}</h3>
            </div>
            <Badge 
              variant={result.isPromotional ? "outline" : "secondary"} 
              className={`font-medium ${result.isPromotional ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50' : ''}`}
            >
              {result.isPromotional ? "Promocional" : "Normal"}
            </Badge>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 dark:bg-muted/20 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Diária</p>
                <p className="text-lg font-medium">{formatCurrency(result.dailyRate)}</p>
              </div>
              <div className="bg-muted/50 dark:bg-muted/20 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Dias</p>
                <p className="text-lg font-medium">{result.days}</p>
              </div>
            </div>
            
            <div className="space-y-2 p-3 border border-border/50 dark:border-border/30 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm">Valor das diárias</span>
                <span className="font-medium">{formatCurrency(result.dailyFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Horas extras ({result.hours}h)</span>
                <span className="font-medium">{formatCurrency(result.extraHoursFee)}</span>
              </div>
              {result.discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span className="text-sm">Desconto</span>
                  <span className="font-medium">-{formatCurrency(result.discount)}</span>
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t dark:border-border/30">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(result.totalFee)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const ParkingCalculator = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [entryDate, setEntryDate] = useState<Date>(now);
  const [exitDate, setExitDate] = useState<Date>(tomorrow);
  
  const [results, setResults] = useState<Record<ParkingType, ParkingCalculationResult | null>>({
    warehouse: null,
    covered: null,
    uncovered: null
  });

  useEffect(() => {
    if (exitDate <= entryDate) {
      return;
    }
    
    const warehouseResult = calculateParkingFee('warehouse', entryDate, exitDate);
    const coveredResult = calculateParkingFee('covered', entryDate, exitDate);
    const uncoveredResult = calculateParkingFee('uncovered', entryDate, exitDate);
    
    setResults({
      warehouse: warehouseResult,
      covered: coveredResult,
      uncovered: uncoveredResult
    });
  }, [entryDate, exitDate]);

  const isInvalidDateRange = exitDate <= entryDate;

  const getDaysAndHours = () => {
    if (!results.warehouse) return { days: 0, hours: 0 };
    return {
      days: results.warehouse.days,
      hours: results.warehouse.hours
    };
  };

  const { days, hours } = getDaysAndHours();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
          AeroPark Confins
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Calculadora de Estacionamento
        </p>
      </motion.div>

      <div className="mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 bg-card/90 dark:bg-card/40 backdrop-blur-sm rounded-xl border shadow-md hover:shadow-glow"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <DateTimePicker 
              date={entryDate} 
              setDate={setEntryDate} 
              label="Data e Hora de Entrada" 
            />
            
            <DateTimePicker 
              date={exitDate} 
              setDate={setExitDate} 
              label="Data e Hora de Saída" 
            />
          </div>

          {isInvalidDateRange && (
            <div className="mt-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                A data de saída deve ser posterior à data de entrada.
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 dark:bg-muted/20 p-3 rounded-lg">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4 text-primary" />
              <span>
                {results.warehouse?.days || 0} {results.warehouse?.days === 1 ? 'dia' : 'dias'}
              </span>
            </div>
            <ArrowRight className="h-3 w-3" />
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-primary" />
              <span>
                {results.warehouse?.hours || 0} {results.warehouse?.hours === 1 ? 'hora' : 'horas'}
              </span>
            </div>
          </div>
          
          {!isInvalidDateRange && results.warehouse && results.covered && results.uncovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-6 border-t pt-6 border-border/30"
            >
              <CopyQuoteButton
                warehouseResult={results.warehouse}
                coveredResult={results.covered}
                uncoveredResult={results.uncovered}
                days={days}
                hours={hours}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {!isInvalidDateRange && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Resultados por Tipo de Vaga</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {results.warehouse && (
              <ResultCard 
                title="Galpão" 
                result={results.warehouse}
                delay={1}
                icon={<Warehouse className="h-4 w-4 text-primary" />}
              />
            )}
            
            {results.covered && (
              <ResultCard 
                title="Coberta" 
                result={results.covered}
                delay={2}
                icon={<Umbrella className="h-4 w-4 text-primary" />}
              />
            )}
            
            {results.uncovered && (
              <ResultCard 
                title="Descoberta" 
                result={results.uncovered}
                delay={3}
                icon={<UmbrellaOff className="h-4 w-4 text-primary" />}
              />
            )}
          </div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-muted-foreground bg-muted/30 dark:bg-muted/10 p-4 rounded-lg border border-border/50"
      >
      </motion.div>
    </div>
  );
};
