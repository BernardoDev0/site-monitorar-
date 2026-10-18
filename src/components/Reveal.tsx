import { createElement, type PropsWithChildren } from "react";
interface RevealProps { as?: keyof JSX.IntrinsicElements; className?: string; delayMs?: number }
export function Reveal({as = "div", className = "", children}: PropsWithChildren<RevealProps>) { return createElement(as, {className}, children); }
