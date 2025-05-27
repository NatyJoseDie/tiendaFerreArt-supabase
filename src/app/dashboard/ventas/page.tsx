
'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Asegúrate de que Label esté importado
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getAllProducts, type Product } from '@/data/mock-products';
import { BarChart2, DollarSign, CalendarDays, PlusCircle, User, CreditCard, FileSpreadsheet, FileText, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const saleFormSchema = z.object({
  productId: z.string().min(1, { message: 'Debe seleccionar un producto.' }),
  quantity: z.coerce.number().min(1, { message: 'La cantidad debe ser al menos 1.' }),
  salePrice: z.coerce.number().min(0, { message: 'El precio de venta no puede ser negativo.' }),
  saleDate: z.string().min(1, { message: 'Debe seleccionar una fecha.' }),
  buyerName: z.string().min(1, { message: 'El nombre del comprador es requerido.' }).max(100),
  paymentMethod: z.string().min(1, { message: 'Debe seleccionar un método de pago.' }),
});

type SaleFormValues = z.infer<typeof saleFormSchema>;

interface RegisteredSale extends SaleFormValues {
  id: string;
  productName: string;
  costPrice: number;
  totalGain: number;
}

const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'tarjeta_credito', label: 'Tarjeta de Crédito' },
  { value: 'tarjeta_debito', label: 'Tarjeta de Débito' },
  { value: 'mercado_pago', label: 'Mercado Pago' },
];

export default function VentasPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [sales, setSales] = useState<RegisteredSale[]>([]);
  const [selectedProductCost, setSelectedProductCost] = useState<number>(0);
  const [calculatedGain, setCalculatedGain] = useState<number>(0);

  const { toast } = useToast();

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
      salePrice: 0,
      saleDate: new Date().toISOString().split('T')[0],
      buyerName: '',
      paymentMethod: '',
    },
  });

  useEffect(() => {
    const prods = getAllProducts();
    setProductsList(prods);
    if (prods.length > 0 && !form.getValues('productId')) {
      // No pre-seleccionar para que el usuario elija
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const watchedProductId = form.watch('productId');
  const watchedQuantity = form.watch('quantity');
  const watchedSalePrice = form.watch('salePrice');

  useEffect(() => {
    if (watchedProductId) {
      const product = productsList.find(p => p.id === watchedProductId);
      if (product) {
        setSelectedProductCost(product.price);
        if (form.getValues('salePrice') === 0 || form.getValues('salePrice') === selectedProductCost && selectedProductCost !== product.price) {
           form.setValue('salePrice', product.price); 
        }
      } else {
        setSelectedProductCost(0); 
      }
    } else {
        setSelectedProductCost(0); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedProductId, productsList]); 


  useEffect(() => {
    const quantity = Number(watchedQuantity) || 0;
    const salePrice = Number(watchedSalePrice) || 0;
    const cost = Number(selectedProductCost) || 0;
    
    const gain = (salePrice - cost) * quantity;
    setCalculatedGain(isNaN(gain) ? 0 : gain);
  }, [watchedSalePrice, selectedProductCost, watchedQuantity]);


  const onSubmit: SubmitHandler<SaleFormValues> = (data) => {
    const product = productsList.find(p => p.id === data.productId);
    if (!product) {
      toast({ title: "Error", description: "Producto no encontrado.", variant: "destructive" });
      return;
    }

    const newSale: RegisteredSale = {
      ...data,
      id: Date.now().toString(), 
      productName: product.name,
      costPrice: product.price,
      totalGain: (data.salePrice - product.price) * data.quantity,
    };

    setSales(prevSales => [...prevSales, newSale]);
    toast({ title: "Venta Registrada", description: `${product.name} (x${data.quantity}) registrada para ${data.buyerName}.` });
    
    form.reset({
      productId: '',
      quantity: 1,
      salePrice: 0,
      saleDate: new Date().toISOString().split('T')[0],
      buyerName: '',
      paymentMethod: '',
    });
    setSelectedProductCost(0);
    setCalculatedGain(0);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Ventas"
        description="Registra nuevas ventas y visualiza el historial."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5 text-primary" />
            Registrar Nueva Venta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Producto</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedProd = productsList.find(p => p.id === value);
                          if (selectedProd) {
                            setSelectedProductCost(selectedProd.price);
                          } else {
                            setSelectedProductCost(0);
                          }
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productsList.map(p => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value,10) || 1)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Costo Unitario</FormLabel>
                  <Input type="number" value={selectedProductCost.toFixed(2)} disabled className="bg-muted" />
                </FormItem>
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio Venta Unitario</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="buyerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><User className="mr-1 h-4 w-4 text-muted-foreground" />Nombre del Comprador</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><CreditCard className="mr-1 h-4 w-4 text-muted-foreground" />Método de Pago</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar método" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map(method => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="saleDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><CalendarDays className="mr-1 h-4 w-4 text-muted-foreground" />Fecha de Venta</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormItem>
                  <FormLabel>Ganancia Total Calculada</FormLabel>
                  <Input type="number" value={calculatedGain.toFixed(2)} disabled className={cn(calculatedGain >= 0 ? 'text-green-600' : 'text-red-600', "font-semibold bg-muted text-lg")} />
                </FormItem>
              </div>
              <Button type="submit" className="mt-4" size="lg">
                <DollarSign className="mr-2 h-4 w-4" />
                Registrar Venta
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-primary" />
            Ventas Registradas ({sales.length})
          </CardTitle>
           <CardDescription>
            Aquí puedes ver las ventas que has registrado. Las opciones de importación y exportación aparecerán debajo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => toast({ title: 'Próximamente', description: 'Funcionalidad para descargar Excel pendiente.' })}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Descargar Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: 'Próximamente', description: 'Funcionalidad para descargar PDF pendiente.' })}>
              <FileText className="mr-2 h-4 w-4" /> Descargar PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: 'Próximamente', description: 'Funcionalidad para importar desde Excel pendiente.' })}>
              <Upload className="mr-2 h-4 w-4" /> Importar desde Excel
            </Button>
          </div>

          {sales.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Comprador</TableHead>
                    <TableHead>Método Pago</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Costo Unit.</TableHead>
                    <TableHead className="text-right">Venta Unit.</TableHead>
                    <TableHead className="text-right">Ganancia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{new Date(sale.saleDate + 'T00:00:00').toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{sale.productName}</TableCell>
                      <TableCell>{sale.buyerName}</TableCell>
                      <TableCell>{paymentMethods.find(pm => pm.value === sale.paymentMethod)?.label || sale.paymentMethod}</TableCell>
                      <TableCell className="text-right">{sale.quantity}</TableCell>
                      <TableCell className="text-right">${sale.costPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${sale.salePrice.toFixed(2)}</TableCell>
                      <TableCell className={cn("text-right font-semibold", sale.totalGain >= 0 ? 'text-green-600' : 'text-red-600')}>
                        ${sale.totalGain.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-4">No hay ventas registradas todavía.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
