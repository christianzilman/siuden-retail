import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToHash = () => {
  const { hash, key, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    const scrollToElement = () => {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
      return Boolean(element);
    };

    if (scrollToElement()) return;

    const timeout = window.setTimeout(scrollToElement, 100);
    return () => window.clearTimeout(timeout);
  }, [hash, key, pathname]);

  return null;
};
