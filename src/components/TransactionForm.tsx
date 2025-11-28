import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PlusCircle } from "lucide-react";

import { Transaction, TransactionType, PaymentMethod, ExpenseCategory, IncomeCategory } from "../types";

import {
  obtenerCategoriasGastos,
  obtenerCategoriasIngresos,
} from "../services/categoriasService";

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  // CATEGORÍAS DINÁMICAS DESDE BACKEND
  const [expenseCategories, setExpenseCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [incomeCategories, setIncomeCategories] = useState<
    { value: string; label: string }[]
  >([]);

  // MÉTODOS DE PAGO (LOCAL)
  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: "cash", label: "💵 Efectivo" },
    { value: "card", label: "💳 Tarjeta" },
    { value: "transfer", label: "🏦 Transferencia" },
    { value: "other", label: "📱 Otro" },
  ];

  // Cargar categorías desde backend
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const gastos = await obtenerCategoriasGastos();
        const ingresos = await obtenerCategoriasIngresos();

        setExpenseCategories(
          gastos.map((c: any) => ({
            value: c.nombre,
            label: `${c.icono} ${c.nombre}`,
          }))
        );

        setIncomeCategories(
          ingresos.map((c: any) => ({
            value: c.nombre,
            label: `${c.icono} ${c.nombre}`,
          }))
        );
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };

    cargarCategorias();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !amount || parseFloat(amount) <= 0) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const recurringDay = isRecurring ? new Date(date).getDate() : undefined;

    onSubmit({
      type,
      category: category as ExpenseCategory | IncomeCategory,
      amount: parseFloat(amount),
      date,
      paymentMethod,
      description,
      isRecurring,
      recurringDay,
    });

    // Reset form
    setCategory("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setPaymentMethod("cash");
    setDescription("");
    setIsRecurring(false);
  };

  return (
    <Card className="bg-white/80 backdrop-blur border-emerald-200">
      <CardHeader>
        <CardTitle className="text-emerald-800">Agregar Transacción</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs
            value={type}
            onValueChange={(v) => {
              setType(v as TransactionType);
              setCategory("");
            }}
          >
            <TabsList className="grid w-full grid-cols-2 bg-emerald-100">
              <TabsTrigger
                value="expense"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Gasto
              </TabsTrigger>
              <TabsTrigger
                value="income"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              >
                Ingreso
              </TabsTrigger>
            </TabsList>

            {/* GASTOS */}
            <TabsContent value="expense" className="space-y-4 mt-4">
              <Label>Categoría *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-emerald-300 focus:ring-emerald-500">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>

            {/* INGRESOS */}
            <TabsContent value="income" className="space-y-4 mt-4">
              <Label>Categoría *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-emerald-300 focus:ring-emerald-500">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {incomeCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
          </Tabs>

          {/* CAMPOS COMUNES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Monto *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Fecha *</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* MÉTODO DE PAGO */}
          <div className="space-y-2">
            <Label>Método de Pago</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Añade una nota (opcional)"
              rows={3}
            />
          </div>

          {/* GASTO RECURRENTE */}
          {type === "expense" && (
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div>
                <Label className="text-emerald-800">Gasto recurrente</Label>
                <p className="text-sm text-emerald-600">
                  Se repetirá cada mes en la misma fecha
                </p>
              </div>
              <Switch
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>
          )}

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            <PlusCircle className="size-4 mr-2" />
            Agregar {type === "expense" ? "Gasto" : "Ingreso"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
