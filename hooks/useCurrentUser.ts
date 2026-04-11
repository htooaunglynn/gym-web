"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/useApi";
import { getMe } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

/** Fetches and syncs the authenticated user from /auth/me */
export function useCurrentUser() {
    const { isAuthenticated, setAuth, token } = useAuth();

    return useQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: async () => {
            const user = await getMe();
            if (token) {
                setAuth(user, token);
            }
            return user;
        },
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
    });
}
