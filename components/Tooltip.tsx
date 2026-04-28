"use client";

import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
    content: ReactNode;
    children: ReactNode;
};

export default function Tooltip({ content, children }: TooltipProps) {
    const [hovered, setHovered] = useState(false);
    const [rect, setRect] = useState<DOMRect | null>(null);

    const portalRoot =
        typeof window !== "undefined"
            ? document.getElementById("tooltip-root")
            : null;

    return (
        <>
            <div
                className="inline-block"
                onMouseEnter={(e) => {
                    setRect(e.currentTarget.getBoundingClientRect());
                    setHovered(true);
                }}
                onMouseLeave={() => setHovered(false)}
            >
                {children}
            </div>

            {hovered && rect && portalRoot &&
                createPortal(
                    <div
                        className="
                            fixed
                            z-[9999]
                            text-xs px-2 py-1 rounded shadow-lg
                            whitespace-nowrap
                            bg-white border border-gray-300
                            text-black
                        "
                        style={{
                            top: rect.top + rect.height / 2,
                            left: rect.right + 8,
                            transform: "translateY(-50%)"
                        }}
                    >
                        {content}
                    </div>,
                    portalRoot
                )}
        </>
    );
}