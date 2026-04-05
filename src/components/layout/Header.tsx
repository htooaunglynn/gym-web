import { Search, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Header() {
    return (
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
            {/* Search */}
            <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search anything..."
                    className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
                />
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
                </button>

                {/* User */}
                <div className="flex items-center gap-2.5">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                        <AvatarFallback>DL</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-semibold text-foreground leading-none mb-0.5">Davis Levin</p>
                        <p className="text-xs text-muted-foreground leading-none">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
