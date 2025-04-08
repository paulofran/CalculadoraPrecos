interface ParkingRates {
  regular: {
    warehouse: number; // Galpão
    covered: number;   // Coberta
    uncovered: number; // Descoberta
  };
  promotional: {
    warehouse: number;
    covered: number;
    uncovered: number;
  };
  hourlyRate: number;
  minimumFee: number;
  maxHoursBeforeFullDay: number;
}

export type ParkingType = 'warehouse' | 'covered' | 'uncovered';

export const PARKING_RATES: ParkingRates = {
  regular: {
    warehouse: 30.00,  // Galpão: R$ 30,00 por dia
    covered: 27.90,    // Coberta: R$ 27,90 por dia
    uncovered: 20.00   // Descoberta: R$ 18,00 por dia
  },
  promotional: {
    warehouse: 25.00,  // Galpão: R$ 25,00 por dia
    covered: 18.00,    // Coberta: R$ 18,00 por dia
    uncovered: 17.00   // Descoberta: R$ 17,00 por dia
  },
  hourlyRate: 2.00,    // R$ 2,00 por hora adicional
  minimumFee: 30.00,   // Mínimo de R$ 30,00 para menos de 2 dias
  maxHoursBeforeFullDay: 12  // Mais de 12 horas = 1 dia completo
};

export interface ParkingCalculationResult {
  days: number;
  hours: number;
  dailyRate: number;
  dailyFee: number;
  extraHoursFee: number;
  discount: number;
  totalFee: number;
  isPromotional: boolean;
}

/**
 * Calculates the time difference between entry and exit in days and hours
 */
export function calculateDuration(entryDate: Date, exitDate: Date): { days: number; hours: number } {
  const diffMs = exitDate.getTime() - entryDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  const days = Math.floor(diffHours / 24);
  const hours = Math.floor(diffHours % 24);
  
  return { days, hours };
}

/**
 * Calculates the parking fee based on the parking type and duration
 */
export function calculateParkingFee(
  parkingType: ParkingType,
  entryDate: Date,
  exitDate: Date
): ParkingCalculationResult {
  // Calculate duration
  const { days, hours } = calculateDuration(entryDate, exitDate);
  
  // Calculate extra day if hours exceed max hours threshold
  const extraDayForHours = hours >= PARKING_RATES.maxHoursBeforeFullDay ? 1 : 0;
  const effectiveDays = days + extraDayForHours;
  
  // Determine if it's a promotional rate (7+ days)
  const isPromotional = effectiveDays >= 7;
  
  // Get the appropriate daily rate
  const dailyRate = isPromotional 
    ? PARKING_RATES.promotional[parkingType]
    : PARKING_RATES.regular[parkingType];
  
  // Calculate hours fee (only if not adding an extra day)
  const effectiveHours = extraDayForHours ? 0 : hours;
  const extraHoursFee = effectiveHours * PARKING_RATES.hourlyRate;
  
  // Calculate daily fee
  const dailyFee = effectiveDays * dailyRate;
  
  // Calculate total fee
  let totalFee = dailyFee + extraHoursFee;
  
  // Apply minimum fee for short stays (less than 2 days)
  if (days < 2 && totalFee < PARKING_RATES.minimumFee) {
    totalFee = PARKING_RATES.minimumFee;
  }
  
  // Calculate discount (difference between regular and promotional rate)
  const discount = isPromotional
    ? effectiveDays * (PARKING_RATES.regular[parkingType] - PARKING_RATES.promotional[parkingType])
    : 0;
  
  return {
    days: effectiveDays,
    hours: effectiveHours,
    dailyRate,
    dailyFee,
    extraHoursFee,
    discount,
    totalFee,
    isPromotional
  };
}

// Format currency in Brazilian Real (R$)
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
