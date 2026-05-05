import Link from "next/link";

interface GridLink {
    label: string;
    href: string;
}

interface LinkGridSectionProps {
    title: string;
    description: string;
    links: GridLink[];
    emptyMessage: string;
}

export function LinkGridSection({
    title,
    description,
    links,
    emptyMessage,
}: LinkGridSectionProps) {
    return (
        <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8 space-y-6">
            <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {title}
                </h1>
                <p className="text-gray-600 text-base lg:text-lg max-w-2xl mb-6">
                    {description}
                </p>
                {links.length === 0 ? (
                    <p className="text-sm text-gray-500">{emptyMessage}</p>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {links.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-2xl border border-gray-200 p-5 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                <p className="text-base font-semibold text-gray-900">
                                    {item.label}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Open {item.label.toLowerCase()} management
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
