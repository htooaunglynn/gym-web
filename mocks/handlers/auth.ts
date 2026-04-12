import { http, HttpResponse } from "msw";
import { buildAuthResponse, buildUser } from "@/mocks/factories";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const authHandlers = [
    http.post(`${BASE}/auth/login`, () => {
        return HttpResponse.json(buildAuthResponse());
    }),

    http.post(`${BASE}/auth/register/member`, () => {
        return HttpResponse.json(buildAuthResponse());
    }),

    http.get(`${BASE}/auth/me`, () => {
        return HttpResponse.json(buildUser());
    }),
];
