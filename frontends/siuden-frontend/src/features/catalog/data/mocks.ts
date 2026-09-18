import { CreditCard, Heart, ShieldCheck, Truck } from "lucide-react";

export const HERO_IMAGE = "/images/tenants/rubi/hero/coleccion-rubi.webp";
export const GOLD_IMAGE = "/images/tenants/rubi/products/joyas-oro.webp";
export const SILVER_IMAGE = "/images/tenants/rubi/products/plata-y-reloj.webp";

export type Category = { name: string; slug: string; image: string };
export type Product = {
  id: string;
  name: string;
  material: string;
  price: number;
  image: string;
  stock: "Disponible" | "Últimas unidades" | "Sin stock";
  isNew?: boolean;
};

// Después reemplazá estos arrays por consultas con TanStack Query.
export const categories: Category[] = [
  { name: "General", slug: "general", image: GOLD_IMAGE },
  { name: "Oro 18kt", slug: "oro-18kt", image: GOLD_IMAGE },
  { name: "Plata", slug: "plata", image: SILVER_IMAGE },
  { name: "Acero", slug: "acero", image: SILVER_IMAGE },
  { name: "Relojes", slug: "relojes", image: SILVER_IMAGE },
];

export const benefits = [
  {
    icon: Heart,
    title: "Atención personalizada",
    description: "Te acompañamos a elegir.",
  },
  {
    icon: Truck,
    title: "Retiro en San Miguel",
    description: "Coordiná tu retiro en la ciudad.",
  },
  {
    icon: CreditCard,
    title: "Consultá financiación",
    description: "Opciones para cada compra.",
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    description: "Cuidamos cada detalle.",
  },
];

export const products: Product[] = [
  {
    id: "ag-1-7",
    name: "AG1,7 (A) Roseta",
    material: "Oro 18K",
    price: 605000,
    image: GOLD_IMAGE,
    stock: "Disponible",
  },
  {
    id: "as-13",
    name: "AS13",
    material: "Plata",
    price: 20000,
    image: SILVER_IMAGE,
    stock: "Disponible",
  },
  {
    id: "as-24",
    name: "AS24",
    material: "Plata",
    price: 36000,
    image: SILVER_IMAGE,
    stock: "Sin stock",
  },
  {
    id: "pg-5-9",
    name: "PG5.9 (Roca)",
    material: "Oro 18K",
    price: 2000000,
    image: GOLD_IMAGE,
    stock: "Últimas unidades",
  },
  {
    id: "dg-05",
    name: "DG0,5 (ACC)",
    material: "Oro 18K",
    price: 175000,
    image: HERO_IMAGE,
    stock: "Disponible",
    isNew: true,
  },
  {
    id: "dg-03",
    name: "DG0,3 (MZ)",
    material: "Oro 18K",
    price: 110000,
    image: HERO_IMAGE,
    stock: "Últimas unidades",
    isNew: true,
  },
  {
    id: "hg-11",
    name: "HG1,1 (GA)",
    material: "Oro 18K",
    price: 385000,
    image: HERO_IMAGE,
    stock: "Disponible",
    isNew: true,
  },
  {
    id: "pg-18",
    name: "PG1,8 (D)",
    material: "Oro 18K",
    price: 630000,
    image: GOLD_IMAGE,
    stock: "Disponible",
  },
];
