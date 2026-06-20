import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "superadmin" | "admin" | "convocador" | "asistente";

export const ROLE_LABEL: Record<AppRole, string> = {
  superadmin: "SuperAdmin",
  admin: "Admin",
  convocador: "Convocador de reunión",
  asistente: "Asistente",
};

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export function useProfile() {
  const { session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId!).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId!),
      ]);
      const role = (roles?.[0]?.role ?? "asistente") as AppRole;
      return {
        nombre: profile?.nombre ?? session?.user?.email?.split("@")[0] ?? "Usuario",
        email: profile?.email ?? session?.user?.email ?? "",
        area: profile?.area ?? "General",
        role,
      };
    },
  });
}

export async function signOut() {
  await supabase.auth.signOut();
}
