

export type StorefrontSession = {
  user: { id: string; email: string; displayName: string };
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    status: string;
  };
  tenant: { id: string; slug: string; name: string };
};

export type StorefrontRegisterInput = {
  tenantSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
};

export type StorefrontLoginInput = {
  tenantSlug: string;
  email: string;
  password: string;
};

export type AuthView = "register" | "login";
