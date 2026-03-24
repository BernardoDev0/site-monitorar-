import { PropsWithChildren } from "react";
import { useIntersectionOnce } from "@/hooks/use-intersection-once";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface RevealProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delayMs?: number;
}

export function Reveal({ as = "div", className = "", delayMs = 0, children }: PropsWithChildren<RevealProps>) {
  const { ref, isVisible } = useIntersectionOnce<HTMLDivElement>({ threshold: 0.15 });
  const reduced = usePrefersReducedMotion();
  const Tag: any = as;

  return (
    <Tag
      ref={ref}
      className={`will-change-auto transition-opacity duration-700 ease-out ${
        isVisible || reduced ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${className}`}
      style={{ transitionDelay: reduced ? undefined : `${delayMs}ms` }}
    >
      {children}
    </Tag>
  );
}


