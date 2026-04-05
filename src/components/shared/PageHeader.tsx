import { cn } from '@/lib/utils'

interface PageHeaderProps {
    title: string
    breadcrumb?: string
    children?: React.ReactNode
    className?: string
}

export default function PageHeader({ title, breadcrumb, children, className }: PageHeaderProps) {
    return (
        <div className={cn('flex items-center justify-between mb-6', className)}>
            <div>
                {breadcrumb && (
                    <p className="text-xs text-muted-foreground mb-0.5">{breadcrumb}</p>
                )}
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    )
}
