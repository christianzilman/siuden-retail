import { EmptyState, PageHeader, QueryState } from "@/components/shared";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCategoriesQuery } from "@/features/categories/hooks/use-categories";
import { FieldError } from "@/features/products/components/field-error";
import { usePriceAdjustmentMutations } from "@/features/products/hooks/use-products";
import type { BulkPriceAdjustmentInput } from "@/features/products/types/contracts";
import type { PriceAdjustmentValues } from "@/features/products/types/forms";
import { priceAdjustmentSchema } from "@/features/products/validations/products.schema";
import { formatCurrency } from "@/lib/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, DollarSign, LoaderCircle, Package, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export function PriceAdjustmentPage() {
  const categories = useCategoriesQuery();
  const mutations = usePriceAdjustmentMutations();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submittedInput, setSubmittedInput] = useState<BulkPriceAdjustmentInput | null>(null);
  const form = useForm<PriceAdjustmentValues>({
    resolver: zodResolver(priceAdjustmentSchema),
    defaultValues: { categoryId: "", percentage: 10, adjustPrice: true, adjustCompareAtPrice: false },
  });
  const clearPreview = () => {
    setSubmittedInput(null);
    mutations.preview.reset();
  };

  const toInput = (values: PriceAdjustmentValues): BulkPriceAdjustmentInput => ({
    filters: values.categoryId ? { categoryId: values.categoryId } : undefined,
    percentage: values.percentage,
    adjustPrice: values.adjustPrice,
    adjustCompareAtPrice: values.adjustCompareAtPrice,
  });
  const preview = form.handleSubmit(async (values) => {
    const input = toInput(values);
    setSubmittedInput(input);
    await mutations.preview.mutateAsync(input);
  });
  const apply = async () => {
    if (!submittedInput) return;
    await mutations.apply.mutateAsync(submittedInput);
    setConfirmOpen(false);
    mutations.preview.reset();
    setSubmittedInput(null);
  };
  const result = mutations.preview.data;

  return (
    <div className="page-shell">
      <PageHeader title="Actualización de precios" description="Aplicá un porcentaje a las variantes vendibles y revisá el resultado antes de confirmar." breadcrumbs={[{ label: "Productos", href: "/products" }, { label: "Actualización de precios" }]} actions={<Button variant="outline" asChild><Link to="/products"><ArrowLeft />Volver</Link></Button>} />
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader><CardTitle>Definir operación</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={preview}>
              <div className="space-y-2"><Label htmlFor="price-category">Alcance</Label><Select id="price-category" {...form.register("categoryId", { onChange: clearPreview })}><option value="">Todos los productos</option>{categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></div>
              <div className="space-y-2"><Label htmlFor="percentage">Porcentaje</Label><div className="relative"><Input id="percentage" type="number" step="0.1" className="pr-9" {...form.register("percentage", { valueAsNumber: true, onChange: clearPreview })} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span></div><FieldError message={form.formState.errors.percentage?.message} /><p className="text-xs text-muted-foreground">Usá un valor negativo para reducir precios.</p></div>
              <div className="space-y-3 rounded-lg border p-3"><label className="flex items-center gap-2 text-sm"><Checkbox {...form.register("adjustPrice", { onChange: clearPreview })} />Precio actual</label><label className="flex items-center gap-2 text-sm"><Checkbox {...form.register("adjustCompareAtPrice", { onChange: clearPreview })} />Precio anterior o de comparación</label><FieldError message={form.formState.errors.adjustPrice?.message} /></div>
              <Button type="submit" className="w-full" disabled={mutations.preview.isPending || categories.isPending}>{mutations.preview.isPending ? <LoaderCircle className="animate-spin" /> : <Sparkles />}{mutations.preview.isPending ? "Calculando…" : "Generar vista previa"}</Button>
            </form>
          </CardContent>
        </Card>

        <QueryState isLoading={false} isError={mutations.preview.isError} error={mutations.preview.error}>
          {!result ? (
            <EmptyState icon={DollarSign} title="Prepará una vista previa" description="Elegí el alcance y el porcentaje. Nada cambia hasta que confirmes expresamente." />
          ) : result.affectedVariants === 0 ? (
            <EmptyState icon={Package} title="No hay variantes afectadas" description="Cambiá la categoría, los campos o el porcentaje de la operación." />
          ) : (
            <Card className="overflow-hidden">
              <CardHeader className="flex-row items-start justify-between gap-4 space-y-0"><div><CardTitle>Vista previa</CardTitle><p className="mt-1 text-sm text-muted-foreground">{result.affectedProducts} productos · {result.affectedVariants} variantes</p></div><Badge variant={submittedInput && submittedInput.percentage < 0 ? "warning" : "success"}>{submittedInput && submittedInput.percentage < 0 ? "Reducción" : "Aumento"} {Math.abs(submittedInput?.percentage ?? 0)}%</Badge></CardHeader>
              <Table className="min-w-[720px]"><TableHeader><TableRow><TableHead>Producto / variante</TableHead><TableHead className="text-right">Precio anterior</TableHead><TableHead className="text-right">Precio nuevo</TableHead><TableHead className="text-right">Comparación</TableHead></TableRow></TableHeader><TableBody>{result.preview.map((item) => <TableRow key={item.variantId}><TableCell><p className="font-medium">{item.productName}</p><p className="text-xs text-muted-foreground">{item.variantName}</p></TableCell><TableCell className="text-right tabular-nums">{formatCurrency(item.previousPrice)}</TableCell><TableCell className="text-right font-semibold tabular-nums text-primary">{formatCurrency(item.nextPrice)}</TableCell><TableCell className="text-right tabular-nums">{formatCurrency(item.previousCompareAtPrice)} → {formatCurrency(item.nextCompareAtPrice)}</TableCell></TableRow>)}</TableBody></Table>
              <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted-foreground">Se muestran hasta 10 ejemplos. La operación incluye todas las variantes indicadas.</p><Button onClick={() => setConfirmOpen(true)} disabled={mutations.apply.isPending}><DollarSign />Aplicar actualización</Button></div>
            </Card>
          )}
        </QueryState>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Confirmar actualización masiva?</AlertDialogTitle><AlertDialogDescription>Se modificarán {result?.affectedVariants ?? 0} variantes de {result?.affectedProducts ?? 0} productos. Revisá la vista previa antes de continuar.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={mutations.apply.isPending}>Volver a revisar</AlertDialogCancel><AlertDialogAction disabled={mutations.apply.isPending} onClick={(event) => { event.preventDefault(); void apply(); }}>{mutations.apply.isPending ? "Actualizando…" : "Sí, actualizar precios"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
