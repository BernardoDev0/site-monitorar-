import { useEffect, useRef, useState } from "react";
import { useIntersectionOnce } from "@/hooks/use-intersection-once";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface CountUpProps {
  end: number;
  durationMs?: number;
  formatter?: Intl.NumberFormatOptions;
  className?: string;
}

export function CountUp({ end, durationMs = 1100, formatter, className = "" }: CountUpProps) {
  const { ref, isVisible } = useIntersectionOnce<HTMLSpanElement>({ threshold: 0.4 });
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const frame = useRef<number>();
  const startTs = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;
    if (reduced) {
      setValue(end);
      return;
    }
    const step = (ts: number) => {
      if (startTs.current == null) startTs.current = ts;
      const progress = Math.min((ts - startTs.current) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => frame.current && cancelAnimationFrame(frame.current);
  }, [isVisible, reduced, end, durationMs]);

  const numberFormatter = new Intl.NumberFormat("pt-BR", formatter);
  return (
    <span ref={ref} className={className}>{numberFormatter.format(value)}</span>
  );
}


