import { headers } from "next/headers";
import { LoginForm } from "./LoginForm";
import { notFound } from "next/navigation";

export default async function LoginPage() {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug");

  if (!slug) return notFound();

  // Fetch gym name
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tenant/tenant/public/${slug}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Gym Suspended</h1>
          <p className="text-gray-500 mt-2">
            This gym portal is currently inactive. Contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  const envelope = await res.json();
  const gymName = envelope.data?.name || "Gym Portal";

  return <LoginForm gymName={gymName} />;
}
