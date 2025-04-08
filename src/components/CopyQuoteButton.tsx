import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { ParkingCalculationResult } from "@/utils/parkingCalculator";

interface CopyQuoteButtonProps {
  warehouseResult: ParkingCalculationResult;
  coveredResult: ParkingCalculationResult;
  uncoveredResult: ParkingCalculationResult;
  days: number;
  hours: number;
}

export const CopyQuoteButton = ({
  warehouseResult,
  coveredResult,
  uncoveredResult,
  days,
  hours,
}: CopyQuoteButtonProps) => {
  const [copied, setCopied] = useState(false);

  const generateQuoteMessage = () => {
    return `💰 ${days} diária(s), ${hours} hora(s) excedente(s)

✅ Vaga em galpão: ${warehouseResult.totalFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
✅ Vaga coberta: ${coveredResult.totalFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
✅ Vaga descoberta: ${uncoveredResult.totalFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}

📌 Obs.: Os valores podem variar conforme o horário de entrada e saída.
⏳ Hora excedente: R$2,00

🚐 Diferenciais:
✔ Translado gratuito e imediato
✔ Apenas 5 minutos do aeroporto
✔ Estacionamento segurado pela Porto Seguro

🔹 Serviços opcionais:
🧼 Lavagem externa: R$30,00
🧽 Lavagem completa: R$60,00

Qualquer dúvida, estou à disposição!`;
  };

  const copyToClipboard = async () => {
    const text = generateQuoteMessage();
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Orçamento copiado para a área de transferência!");
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Não foi possível copiar o orçamento");
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-muted-foreground mb-3 text-center">
        Compartilhe este orçamento com seus clientes
      </p>
      <Button 
        onClick={copyToClipboard} 
        variant="default" 
        size="lg"
        className="w-full md:w-auto btn-enhanced pulse-animation flex items-center justify-center gap-2 px-6 py-5 shadow-md bg-primary hover:bg-primary/90 dark:shadow-primary/20"
      >
        {copied ? (
          <>
            <Check className="h-5 w-5" />
            <span className="font-medium">Copiado com sucesso!</span>
          </>
        ) : (
          <>
            <Share2 className="h-5 w-5" />
            <span className="font-medium">Copiar orçamento completo</span>
          </>
        )}
      </Button>
    </div>
  );
};
