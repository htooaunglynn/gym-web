import { http, HttpResponse } from "msw";
import { buildMember, buildMemberList } from "@/mocks/factories";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const memberHandlers = [
    http.get(`${BASE}/members`, () => {
        return HttpResponse.json(buildMemberList());
    }),

    http.get(`${BASE}/members/:id`, ({ params }) => {
        return HttpResponse.json(buildMember({ id: params.id as string }));
    }),

    http.post(`${BASE}/members`, async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json(
            buildMember({
                id: "new-member-id",
                email: body.email as string,
                firstName: body.firstName as string,
                lastName: body.lastName as string,
            }),
            { status: 201 }
        );
    }),

    http.patch(`${BASE}/members/:id`, async ({ params, request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json(
            buildMember({ id: params.id as string, ...body })
        );
    }),

    http.delete(`${BASE}/members/:id`, () => {
        return new HttpResponse(null, { status: 204 });
    }),
];
