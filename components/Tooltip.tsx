import { ReactNode, useState } from "react";

type TooltipProps = {
    content: ReactNode;
    children: ReactNode;
};

export default function Tooltip({ content, children }: TooltipProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && (
                <div
                    className="
                        absolute left-full top-1/2 -translate-y-1/2 ml-2
                        text-xs px-2 py-1 rounded shadow-lg
                        whitespace-nowrap z-50
                        bg-white border border-gray-300
                    "
                >
                    {content}
                </div>
            )}

            {children}
        </div>
    );
}