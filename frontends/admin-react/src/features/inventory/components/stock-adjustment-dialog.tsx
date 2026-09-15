import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInventoryAdjustmentMutation } from "@/features/inventory/hooks/use-inventory";
import type { AdjustmentValues } from "@/features/inventory/types/forms";
import type { InventoryItem } from "@/features/inventory/types/inventory";
import { quantityDelta } from "@/features/inventory/utils/inventory-helpers";
import { adjustmentSchema } from "@/features/inventory/validations/inventory.schema";
import { formatNumber } from "@/lib/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

export function StockAdjustmentDialog({
  item,
  open,
  onOpenChange,
}: {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const adjustment = useInventoryAdjustmentMutation();
  const form = useForm<AdjustmentValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: { type: "ADJUSTMENT", amount: 1, reason: "", lowStockThreshold: "" },
  });

  useEffect(() => {
    if (open && item) {
      form.reset({
        type: "ADJUSTMENT",
        amount: 1,
        reason: "",
        lowStockThreshold: item.lowStockThreshold ?? "",
      });
    }
  }, [form, item, open]);

  const type = useWatch({ control: form.control, name: "type" });
  const amount = Number(useWatch({ control: form.control, name: "amount" })) || 0;
  const delta = quantityDelta(type, amount);
  const resulting = (item?.onHand ?? 0) + delta;

  const submit = form.handleSubmit(async (raw) => {
    if (!item) return;
    const values = adjustmentSchema.parse(raw);
    await adjustment.mutateAsync({
      stockLocationId: item.stockLocationId,
      type: values.type,
      reason: values.reason,
      items: [
        {
          productVariantId: item.variantId,
          quantityDelta: quantityDelta(values.type, values.amount),
          lowStockThreshold:
            values.lowStockThreshold === "" || values.lowStockThreshold === undefined
              ? null
              : values.lowStockThreshold,
        },
      ],
    });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={(next) => !adjustment.isPending && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustar stock</DialogTitle>
          <DialogDescription>
            {item ? `${item.productName} · ${item.variantName}` : "Seleccioná una variante."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="movement-type">Tipo de movimiento</Label>
              <Select id="movement-type" {...form.register("type")}>
                <option value="ADJUSTMENT">Ajuste de diferencia</option>
                <option value="MANUAL_IN">Ingreso manual</option>
                <option value="MANUAL_OUT">Salida manual</option>
                <option value="CUSTOMER_RETURN">Devolución de cliente</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="movement-amount">{type === "ADJUSTMENT" ? "Diferencia (+ / -)" : "Cantidad"}</Label>
              <Input id="movement-amount" type="number" step="1" {...form.register("amount")} />
              {form.formState.errors.amount && <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/40 p-3 text-center text-sm">
            <div><p className="text-xs text-muted-foreground">Actual</p><p className="mt-1 font-semibold">{formatNumber(item?.onHand)}</p></div>
            <div><p className="text-xs text-muted-foreground">Cambio</p><p className={delta >= 0 ? "mt-1 font-semibold text-emerald-600" : "mt-1 font-semibold text-red-600"}>{delta > 0 ? "+" : ""}{formatNumber(delta)}</p></div>
            <div><p className="text-xs text-muted-foreground">Resultante</p><p className={resulting < 0 ? "mt-1 font-semibold text-red-600" : "mt-1 font-semibold"}>{formatNumber(resulting)}</p></div>
          </div>
          {resulting < 0 && <p className="text-sm text-destructive" role="alert">El movimiento dejaría el stock en negativo.</p>}
          <div className="space-y-2">
            <Label htmlFor="threshold">Umbral de stock bajo</Label>
            <Input id="threshold" type="number" min="0" step="1" placeholder="Sin umbral" {...form.register("lowStockThreshold")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="movement-reason">Motivo</Label>
            <Textarea id="movement-reason" placeholder="Ej.: conteo físico del local" {...form.register("reason")} />
            {form.formState.errors.reason && <p className="text-xs text-destructive">{form.formState.errors.reason.message}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={adjustment.isPending}>Cancelar</Button>
            <Button type="submit" disabled={adjustment.isPending || resulting < 0}>
              {adjustment.isPending ? "Registrando…" : "Registrar movimiento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
