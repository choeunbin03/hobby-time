import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Session } from "@/types/class";

export function useSessions(classId: string) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        setIsLoading(true);
        const supabase = createClient();
        
        // Fetch sessions for this class that are in the future
        const { data, error } = await supabase
          .from("class_sessions")
          .select("*")
          .eq("class_id", classId)
          .gte("start_at", new Date().toISOString())
          .order("start_at", { ascending: true });

        if (error) {
          throw error;
        }

        setSessions(data || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch sessions"));
      } finally {
        setIsLoading(false);
      }
    }

    if (classId) {
      fetchSessions();
    }
  }, [classId]);

  return { sessions, isLoading, error };
}
