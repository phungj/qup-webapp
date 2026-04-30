type QUPYellowProps = {
    children: React.ReactNode
}

export default function QUPYellow({children}: QUPYellowProps) {
    return <span className="text-yellow-300 font-bold">{children}</span>;
}