import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { useSessionQuery } from "@/features/auth/hooks/use-auth";
import { useCategoriesQuery } from "@/features/categories/hooks/use-categories";
import { useCustomersQuery } from "@/features/customers/hooks/use-customers";
import { usePosStore } from "@/features/pos/store/pos-store";
import { CatalogFilters, CatalogPicker, SaleCart } from "@/features/sales/components/sale-composer";
import { SaleReceiptDialog } from "@/features/sales/components/sale-receipt";
import { useSaleMutations } from "@/features/sales/hooks/use-sales";
import { useSellableCatalog } from "@/features/sales/hooks/use-sellable-catalog";
import type { Sale } from "@/features/sales/types/sales";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function PosPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [receipt, setReceipt] = useState<Sale | null>(null);
  const { data: session } = useSessionQuery();
  const categories = useCategoriesQuery();
  const customers = useCustomersQuery({ status: "ACTIVE", pageSize: 200 });
  const catalog = useSellableCatalog(search, categoryId);
  const sales = useSaleMutations();
  const draft = usePosStore();

  useEffect(() => {
    if (session?.tenant.id) draft.initialize(session.tenant.id);
  }, [draft, session?.tenant.id]);

  const quantities = useMemo(
    () => Object.fromEntries(draft.lines.map((line) => [line.variantId, line.quantity])),
    [draft.lines],
  );

  const confirm = async () => {
    if (!draft.lines.length) return;
    const result = await sales.confirm.mutateAsync({
      channel: "POS",
      customerId: draft.customerId,
      items: draft.lines.map((line) => ({
        productVariantId: line.variantId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      })),
    });
    draft.clear(session?.tenant.id);
    setReceipt(result.sale);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Punto de venta"
        description="Armá una venta rápida. El stock se descuenta recién al confirmar."
        actions={<span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground"><Sparkles className="size-3.5 text-primary" />Modo demostración</span>}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Card>
          <CardContent className="space-y-5 pt-5">
            <CatalogFilters search={search} onSearch={setSearch} categoryId={categoryId} onCategory={setCategoryId} categories={categories.data ?? []} />
            <CatalogPicker
              items={catalog.items}
              isPending={catalog.isPending}
              isError={catalog.isError}
              error={catalog.error}
              onRetry={catalog.refetch}
              quantities={quantities}
              onAdd={(item) => {
                if (item.price === null || !session) return;
                draft.addLine(session.tenant.id, {
                  variantId: item.variantId,
                  productName: item.productName,
                  variantName: item.variantName,
                  sku: item.sku,
                  imageUrl: item.imageUrl,
                  unitPrice: item.price,
                  maxAvailable: item.trackInventory ? item.available : 9999,
                });
              }}
            />
          </CardContent>
        </Card>
        <div className="xl:sticky xl:top-20 xl:h-[calc(100vh-6.5rem)]">
          <SaleCart
            lines={draft.lines}
            customers={customers.data?.items ?? []}
            customerId={draft.customerId}
            onCustomer={draft.setCustomer}
            onQuantity={draft.setQuantity}
            onRemove={draft.removeLine}
            onClear={() => {
              if (draft.lines.length && window.confirm("¿Vaciar el comprobante actual?")) draft.clear(session?.tenant.id);
            }}
            onConfirm={confirm}
            confirming={sales.confirm.isPending}
          />
        </div>
      </div>
      <SaleReceiptDialog sale={receipt} open={Boolean(receipt)} onOpenChange={(open) => !open && setReceipt(null)} />
    </div>
  );
}
