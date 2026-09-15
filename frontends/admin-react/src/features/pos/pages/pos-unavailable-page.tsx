import { ShoppingBasket } from "lucide-react";

export function PosUnavailablePage() {
  return <div className="grid min-h-[60vh] place-items-center"><div className="text-center"><ShoppingBasket className="mx-auto size-9 text-muted-foreground" /><h1 className="mt-3 text-xl font-semibold">Punto de venta no disponible</h1></div></div>;
}
