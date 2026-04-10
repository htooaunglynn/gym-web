import { Navigate, useParams } from 'react-router'

export default function LegacyMemberDetailRedirect() {
    const { id } = useParams()

    if (!id) {
        return <Navigate to="/admin/members" replace />
    }

    return <Navigate to={`/admin/members/${id}`} replace />
}
