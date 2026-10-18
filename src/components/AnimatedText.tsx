import { createElement } from "react";
interface AnimatedTextProps { text: string; as?: keyof JSX.IntrinsicElements; className?: string; wordDelayMs?: number }
export function AnimatedText({text, as = "h1", className = ""}: AnimatedTextProps) { return createElement(as, {className}, text); }
