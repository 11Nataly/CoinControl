import { TrendingUp, Wallet } from 'lucide-react';
import { Card } from './ui/card';

interface HeaderProps {
  balance: number;
}

export function Header({ balance }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-emerald-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
              <TrendingUp className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-emerald-800">FinanceFlow</h1>
              <p className="text-sm text-emerald-600">Control inteligente de gastos</p>
            </div>
          </div>

          <Card className="px-6 py-3 bg-gradient-to-br from-emerald-500 to-teal-600 border-0">
            <div className="flex items-center gap-2">
              <Wallet className="size-5 text-white" />
              <div className="text-right">
                <p className="text-xs text-emerald-100">Saldo actual</p>
                <p className={`text-white ${balance < 0 ? 'text-red-100' : ''}`}>
                  ${balance.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </header>
  );
}
