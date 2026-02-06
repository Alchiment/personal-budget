import React from 'react';
import { Card } from '@/app/components/atoms/Card';
import { Badge } from '@/app/components/atoms/Badge';
import { SectionHeader } from '@/app/components/molecules/SectionHeader';
import { MovementDTO } from '../../dtos/dashboard.dto';
import { formatCurrency } from '@/lib/format';

interface MovementsTableProps {
  movements: MovementDTO[];
}

export function MovementsTable({ movements }: MovementsTableProps) {
  return (
    <section>
      <SectionHeader 
        title="MOVIMIENTOS / INGRESOS" 
        icon="trending_up" 
        action={{ label: "Agregar" }} 
      />
      <Card noPadding>
        <table className="w-full text-left border-collapse">
          <tbody>
            {movements.map((movement, index) => (
              <tr 
                key={movement.id} 
                className={index < movements.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}
              >
                <td className="p-4">{movement.name}</td>
                <td className="p-4 text-right">
                  <Badge 
                    variant={movement.amount > 0 ? 'income' : 'neutral'}
                    className={movement.amount < 0 ? "text-red-500 bg-transparent" : ""}
                  >
                     {formatCurrency(movement.amount)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
