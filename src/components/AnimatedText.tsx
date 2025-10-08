import { useEffect, useMemo, useRef } from "react";
import { useIntersectionOnce } from "@/hooks/use-intersection-once";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface AnimatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  wordDelayMs?: number; // delay entre palavras
}

export function AnimatedText({ text, as = "h1", className = "", wordDelayMs = 40 }: AnimatedTextProps) {
  const { ref, isVisible } = useIntersectionOnce<HTMLHeadingElement>({ threshold: 0.2 });
  const reduced = usePrefersReducedMotion();
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  const Tag: any = as;
  const cleanupTimeouts = useRef<number[]>([]);

  useEffect(() => () => cleanupTimeouts.current.forEach((id) => window.clearTimeout(id)), []);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const isSpace = /\s+/.test(w);
        if (isSpace) return <span key={i} aria-hidden="true">{w}</span>;
        const delay = i * wordDelayMs;
        return (
          <span
            key={i}
            className={`inline-block will-change-transform ${
              isVisible && !reduced ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transition: reduced ? undefined : `transform .5s ${0.2 + i * 0.02}s cubic-bezier(.2,.9,.3,1), opacity .5s ${0.2 + i * 0.02}s` }}
          >
            {w}
          </span>
        );
      })}
    </Tag>
  );
}


