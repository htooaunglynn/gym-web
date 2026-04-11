import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4">
            <Card variant="elevated" className="max-w-md w-full text-center space-y-4">
                <p className="text-label-md text-on-surface-variant">404</p>
                <h1 className="headline-sm text-on-surface">Page not found</h1>
                <p className="text-body-md text-on-surface-variant">
                    The page you are looking for does not exist or was moved.
                </p>
                <div className="flex items-center justify-center gap-2">
                    <Link href="/dashboard">
                        <Button variant="primary">Go to dashboard</Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="secondary">Go to login</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
