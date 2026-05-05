import { headers, cookies } from "next/headers";
import type { Tenant } from "@gym/types";

export async function getTenantFromHeaders(): Promise<Tenant> {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug");

  if (!slug) {
    throw new Error("No tenant slug found in headers");
  }

  const cookiesList = await cookies();
  const token = cookiesList.get("tenant_refresh_token")?.value;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const res = await fetch(`${apiUrl}/api/tenant/tenant/me`, {
    headers: {
      "x-tenant-id": slug,
      ...(token ? { Cookie: `tenant_refresh_token=${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tenant");
  }

  const envelope = await res.json();
  const tenant = envelope.data as Tenant;

  if (!tenant.isActive) {
    throw new Error("Tenant is suspended");
  }

  return tenant;
}
