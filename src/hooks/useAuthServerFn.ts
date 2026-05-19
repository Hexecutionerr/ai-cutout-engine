import { useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";

/** Wraps a server function and attaches the current Supabase access token. */
export function useAuthServerFn<T extends (opts?: { data?: unknown; headers?: HeadersInit }) => Promise<unknown>>(
  fn: T,
) {
  const serverFn = useServerFn(fn);
  const { session } = useAuth();

  return useCallback(
    async (data?: unknown) => {
      const token = session?.access_token;
      if (!token) throw new Error("You must be signed in.");

      const opts = {
        ...(data !== undefined ? { data } : {}),
        headers: { Authorization: `Bearer ${token}` },
      };

      return serverFn(opts as Parameters<typeof serverFn>[0]);
    },
    [serverFn, session?.access_token],
  );
}
