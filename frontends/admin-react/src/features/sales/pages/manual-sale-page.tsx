import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCategoriesQuery } from "@/features/categories/hooks/use-categories";
import { useCustomersQuery } from "@/features/customers/hooks/use-customers";
import { CatalogFilters, CatalogPicker, SaleCart, type ComposerLine } from "@/features/sales/components/sale-composer";
import { SaleReceiptDialog } from "@/features/sales/components/sale-receipt";
import { useSaleMutations } from "@/features/sales/hooks/use-sales";
import { useSellableCatalog } from "@/features/sales/hooks/use-sellable-catalog";
import type { Sale } from "@/features/sales/types/sales";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export function ManualSalePage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [lines, setLines] = useState<ComposerLine[]>([]);
  const [receipt, setReceipt] = useState<Sale | null>(null);
  const categories = useCategoriesQuery();
  const customers = useCustomersQuery({ status: "ACTIVE", pageSize: 200 });
  const catalog = useSellableCatalog(search, categoryId);
  const actions = useSaleMutations();
  const quantities = useMemo(() => Object.fromEntries(lines.map((line) => [line.variantId, line.quantity])), [lines]);

  const add = (item: ReturnType<typeof useSellableCatalog>["items"][number]) => {
    if (item.price === null) return;
    const maxAvailable = item.trackInventory ? item.available : 9999;
    setLines((current) => {
      const existing = current.find((line) => line.variantId === item.variantId);
      if (existing) {
        if (existing.quantity >= maxAvailable) return current;
        return current.map((line) => line.variantId === item.variantId ? { ...line, quantity: line.quantity + 1 } : line);
      }
      if (maxAvailable < 1) return current;
      return [...current, { variantId: item.variantId, productName: item.productName, variantName: item.variantName, sku: item.sku, imageUrl: item.imageUrl, unitPrice: item.price as number, quantity: 1, maxAvailable }];
    });
  };

  const confirm = async () => {
    const result = await actions.confirm.mutateAsync({
      channel: "MANUAL",
      customerId,
      items: lines.map((line) => ({ productVariantId: line.variantId, quantity: line.quantity, unitPrice: line.unitPrice })),
    });
    setLines([]);
    setCustomerId(null);
    setReceipt(result.sale);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Nueva venta manual" description="Registrá una venta local con el mismo comando transaccional que usa el POS." actions={<Button variant="outline" asChild><Link to="/sales">Volver a ventas</Link></Button>} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Card><CardContent className="space-y-5 pt-5"><CatalogFilters search={search} onSearch={setSearch} categoryId={categoryId} onCategory={setCategoryId} categories={categories.data ?? []} /><CatalogPicker items={catalog.items} isPending={catalog.isPending} isError={catalog.isError} error={catalog.error} onRetry={catalog.refetch} quantities={quantities} onAdd={add} /></CardContent></Card>
        <div className="xl:sticky xl:top-20 xl:h-[calc(100vh-6.5rem)]"><SaleCart lines={lines} customers={customers.data?.items ?? []} customerId={customerId} onCustomer={setCustomerId} onQuantity={(variantId, quantity) => setLines((current) => current.map((line) => line.variantId === variantId && quantity >= 1 && quantity <= line.maxAvailable ? { ...line, quantity } : line))} onRemove={(variantId) => setLines((current) => current.filter((line) => line.variantId !== variantId))} onClear={() => { if (window.confirm("¿Vaciar la venta manual?")) setLines([]); }} onConfirm={confirm} confirming={actions.confirm.isPending} confirmLabel="Registrar venta" /></div>
      </div>
      <SaleReceiptDialog sale={receipt} open={Boolean(receipt)} onOpenChange={(open) => !open && setReceipt(null)} />
    </div>
  );
}
