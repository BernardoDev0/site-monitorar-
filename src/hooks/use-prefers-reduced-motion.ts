import { useEffect, useState } from "react";

// Permite override via query param ?motion=on|off e localStorage 'motion-preference-override'
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    // 1) Query param override
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("motion");
      if (q === "on") localStorage.setItem("motion-preference-override", "no-preference");
      if (q === "off") localStorage.setItem("motion-preference-override", "reduce");
    } catch {}

    // Sempre permitir animações por solicitação do cliente
    setReduced(false);
  }, []);

  return reduced;
}


