import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  label: string;
}

export function DateTimePicker({ date, setDate, label }: DateTimePickerProps) {
  // Referência para o input de tempo
  const timeInputRef = React.useRef<HTMLInputElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  
  // Handle time inputs
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    const [hours, minutes] = newTime.split(':').map(Number);
    
    const newDate = new Date(date);
    newDate.setHours(hours || 0);
    newDate.setMinutes(minutes || 0);
    
    setDate(newDate);
  };

  // Função para focar no input de tempo quando o wrapper é clicado
  const handleTimeWrapperClick = () => {
    if (timeInputRef.current) {
      timeInputRef.current.focus();
      timeInputRef.current.showPicker();
    }
  };

  // Detectar se é um dispositivo móvel
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="grid gap-2">
      <Label htmlFor={`${label}-datetime`} className="text-sm font-medium flex items-center gap-1">
        {label === "Data e Hora de Entrada" ? (
          <CalendarIcon className="h-4 w-4 text-primary" />
        ) : (
          <Clock className="h-4 w-4 text-primary" />
        )}
        {label}
      </Label>
      <div className="flex gap-2">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              size="sm"
              className={cn(
                "justify-start text-left w-full font-normal shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-primary/30 focus:border-primary dark:bg-background/40 dark:hover:bg-background/60 date-time-field",
                !date && "text-muted-foreground",
                isCalendarOpen && "ring-2 ring-primary/30 border-primary"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {date ? format(date, "dd/MM/yyyy") : <span>Selecionar data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  const updatedDate = new Date(newDate);
                  updatedDate.setHours(date.getHours());
                  updatedDate.setMinutes(date.getMinutes());
                  setDate(updatedDate);
                  setIsCalendarOpen(false);
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto border rounded-md shadow-md"
            />
          </PopoverContent>
        </Popover>

        <div 
          className="relative flex items-center flex-1 cursor-pointer" 
          onClick={handleTimeWrapperClick}
        >
          <div className="absolute left-3 h-4 w-4 text-primary pointer-events-none z-10">
            <Clock className="h-4 w-4" />
          </div>
          <Input
            ref={timeInputRef}
            type="time"
            id={`${label}-time`}
            value={format(date, "HH:mm")}
            onChange={handleTimeChange}
            className="pl-10 shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-primary/30 focus:border-primary dark:bg-background/40 dark:hover:bg-background/60 cursor-pointer w-full date-time-field"
            onClick={(e) => {
              // Garantir que o evento de clique não se propague para o wrapper
              e.stopPropagation();
              if (timeInputRef.current) {
                timeInputRef.current.showPicker();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
