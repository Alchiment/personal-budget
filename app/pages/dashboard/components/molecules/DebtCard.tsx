import React, { useState } from 'react';
import { Card } from '@/app/components/atoms/Card';
import { Button } from '@/app/components/atoms/Button';
import { Icon } from '@/app/components/atoms/Icon';
import { Input } from '@/app/components/atoms/Input';
import { CurrencyInput } from '@/app/components/molecules/CurrencyInput';
import { DebtCardDTO, DebtItemDTO } from '../../dtos/dashboard.dto';
import { formatCurrency } from '@/app/lib/format';
import { cn } from '@/app/lib/utils';

interface DebtCardProps {
  debt: DebtCardDTO;
  onAddDetail?: (debtId: string) => void;
  onRemoveDetail?: (debtId: string, detailId: string) => void;
  onUpdateDetail?: (debtId: string, detailId: string, updates: Partial<DebtItemDTO>) => void;
  onUpdateDebt?: (debtId: string, updates: Partial<DebtCardDTO>) => void;
}

export function DebtCard({
  debt,
  onAddDetail,
  onRemoveDetail,
  onUpdateDetail,
  onUpdateDebt
}: DebtCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Card 
      className={cn(
        "border-l-4", 
        debt.color === 'purple' ? "border-purple-500" : "border-blue-600"
      )}
      noPadding
    >
      <div className="p-4">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="space-y-1 flex-1 mr-4">
            {isEditing && onUpdateDebt ? (
              <>
                  <Input 
                      value={debt.name} 
                      onChange={(e) => onUpdateDebt(debt.id, { name: e.target.value })}
                      className="font-medium h-7 w-full"
                      placeholder="Nombre Tarjeta"
                  />
                  <Input 
                      value={debt.subtitle} 
                      onChange={(e) => onUpdateDebt(debt.id, { subtitle: e.target.value })}
                      className="text-xs text-slate-500 h-6 w-full"
                      placeholder="Subtítulo"
                  />
              </>
            ) : (
              <>
                  <h3 className="font-medium">{debt.name}</h3>
                  <p className="text-xs text-slate-500">{debt.subtitle}</p>
              </>
            )}
          </div>
          
          <div className="text-right">
             <span className={cn(
               "font-mono font-bold block", 
               debt.amount === 0 ? "text-slate-400" : "text-red-500"
             )}>
               {formatCurrency(debt.amount)}
             </span>
          </div>
        </div>
            
        {/* Details Section */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Detalle Deudas</span>
              
              <div className="flex gap-2">
                {isEditing && onAddDetail && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onAddDetail(debt.id)}
                        className="h-6 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 px-2 text-slate-600 dark:text-slate-300 rounded-lg"
                    >
                        + Agregar
                    </Button>
                )}
                
                {onUpdateDebt && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-6 w-6 rounded-full transition-colors",
                            isEditing ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-slate-400 hover:text-slate-600"
                        )}
                        onClick={toggleEdit}
                        title={isEditing ? "Finalizar edición" : "Editar tarjeta"}
                    >
                        <Icon name={isEditing ? "check" : "edit"} className="text-sm" />
                    </Button>
                )}
              </div>
            </div>
            
            {(debt.details && debt.details.length > 0) ? (
              <div className="space-y-2">
                  {debt.details.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm gap-2 group">
                      {isEditing && onUpdateDetail ? (
                          <Input 
                              value={item.name} 
                              onChange={(e) => onUpdateDetail(debt.id, item.id, { name: e.target.value })}
                              className="h-7 text-slate-600 dark:text-slate-400 flex-1"
                              placeholder="Concepto"
                          />
                      ) : (
                          <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                      )}
                      
                      <div className="flex items-center gap-2">
                          {isEditing && onUpdateDetail ? (
                              <CurrencyInput 
                                  value={item.amount} 
                                  onChange={(val) => onUpdateDetail(debt.id, item.id, { amount: val })}
                                  className="w-24 h-7 font-mono text-right"
                              />
                          ) : (
                              <span className="font-mono">{formatCurrency(item.amount)}</span>
                          )}
                          
                          {isEditing && onRemoveDetail && (
                              <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => onRemoveDetail(debt.id, item.id)}
                              >
                                  <Icon name="delete" className="text-base" />
                              </Button>
                          )}
                      </div>
                  </div>
                  ))}
              </div>
            ) : (
                <div className="text-xs text-slate-400 italic text-center py-2">
                    {isEditing ? "Agrega detalles para calcular el total" : "Sin detalles"}
                </div>
            )}
          </div>
      </div>
    </Card>
  );
}
