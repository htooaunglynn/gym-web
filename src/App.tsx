import { BrowserRouter } from 'react-router'
import AppRouter from '@/routes'

export default function App() {
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    )
}
