
'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getAllProducts, type Product } from '@/data/mock-products';
import { BarChart2, DollarSign, CalendarDays, PlusCircle } from 'lucide-react';

const saleFormSchema = z.object({
  productId: z.string().min(1, { message: 'Debe seleccionar un producto.' }),
  quantity: z.coerce.number().min(1, { message: 'La cantidad debe ser al menos 1.' }),
  salePrice: z.coerce.number().min(0, { message: 'El precio de venta no puede ser negativo.' }),
  saleDate: z.string().min(1, { message: 'Debe seleccionar una fecha.' }),
});

type SaleFormValues = z.infer<typeof saleFormSchema>;

interface RegisteredSale extends SaleFormValues {
  id: string;
  productName: string;
  costPrice: number;
  totalGain: number;
}

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
      saleDate: new Date().toISOString().split('T')[0], // Default to today
    },
  });

  useEffect(() => {
    const prods = getAllProducts();
    setProductsList(prods);
    if (prods.length > 0) {
      form.setValue('productId', prods[0].id);
      setSelectedProductCost(prods[0].price);
      form.setValue('salePrice', prods[0].price); // Default sale price to cost price
    }
  }, [form]);

  const watchedProductId = form.watch('productId');
  const watchedQuantity = form.watch('quantity');
  const watchedSalePrice = form.watch('salePrice');

  useEffect(() => {
    if (watchedProductId) {
      const product = productsList.find(p => p.id === watchedProductId);
      if (product) {
        setSelectedProductCost(product.price);
        // Optionally, uncomment to reset salePrice when product changes
        // if (form.getValues('salePrice') === 0 || form.getValues('salePrice') === selectedProductCost) {
        //   form.setValue('salePrice', product.price);
        // }
      }
    }
  }, [watchedProductId, productsList, form]);

  useEffect(() => {
    const gain = (watchedSalePrice - selectedProductCost) * watchedQuantity;
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
      id: Date.now().toString(), // Simple ID for demo
      productName: product.name,
      costPrice: product.price,
      totalGain: (data.salePrice - product.price) * data.quantity,
    };

    setSales(prevSales => [...prevSales, newSale]);
    toast({ title: "Venta Registrada", description: `${product.name} (x${data.quantity}) registrada.` });
    form.reset({
      productId: productsList.length > 0 ? productsList[0].id : '',
      quantity: 1,
      salePrice: productsList.length > 0 ? productsList[0].price : 0,
      saleDate: new Date().toISOString().split('T')[0],
    });
    if (productsList.length > 0) setSelectedProductCost(productsList[0].price);
    setCalculatedGain(0);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Ventas"
        description="Analiza el rendimiento de tus ventas y gestiona los pedidos."
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                  name="saleDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Venta</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormItem>
                  <FormLabel>Ganancia Total Calculada</FormLabel>
                  <Input type="number" value={calculatedGain.toFixed(2)} disabled className={cn(calculatedGain >= 0 ? 'text-green-600' : 'text-red-600', "font-semibold bg-muted")} />
                </FormItem>
              </div>
              <Button type="submit" className="mt-4">
                <DollarSign className="mr-2 h-4 w-4" />
                Registrar Venta
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {sales.length > 0 && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              Ventas Registradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Costo Unit.</TableHead>
                    <TableHead className="text-right">Venta Unit.</TableHead>
                    <TableHead className="text-right">Ganancia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                      <TableCell>{sale.productName}</TableCell>
                      <TableCell className="text-right">{sale.quantity}</TableCell>
                      <TableCell className="text-right">${sale.costPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${sale.salePrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold ${sale.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}">
                        ${sale.totalGain.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

