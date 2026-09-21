import { useEffect, type ReactNode } from "react";
import { refreshSession } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export function AuthSessionInitializer({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setAnonymous = useAuthStore((state) => state.setAnonymous);

  useEffect(() => {
    if (status !== "checking") return;

    let active = true;
    refreshSession()
      .then((result) => {
        if (active) setAuthenticated(result);
      })
      .catch(() => {
        if (active) setAnonymous();
      });

    return () => {
      active = false;
    };
  }, [setAnonymous, setAuthenticated, status]);

  return children;
}
