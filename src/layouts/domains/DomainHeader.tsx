import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Input } from '@/components/Input/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/avatar'
import { getRoleDashboardPath, roleLabels, setCurrentRole, type UserRole } from '@/utils/role'

interface DomainHeaderProps {
    role: UserRole
}

export default function DomainHeader({ role }: DomainHeaderProps) {
    const navigate = useNavigate()

    const handleRoleChange = (nextRole: string) => {
        if (!(nextRole in roleLabels)) {
            return
        }

        const typedRole = nextRole as UserRole
        setCurrentRole(typedRole)
        navigate(getRoleDashboardPath(typedRole), { replace: true })
    }

    return (
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder={`Search ${roleLabels[role].toLowerCase()} workspace`}
                    className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
                />
            </div>

            <div className="flex items-center gap-3">
                <Select value={role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="trainer">Trainer</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2.5">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} />
                        <AvatarFallback>{roleLabels[role].slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-semibold text-foreground leading-none mb-0.5">{roleLabels[role]} View</p>
                        <p className="text-xs text-muted-foreground leading-none">Role domain</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
