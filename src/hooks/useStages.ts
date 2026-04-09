import { useState, useEffect, useCallback } from 'react';
import { supabaseCompetitionService, supabaseStageService } from '@/services/cibc.service';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/config/environment';
import type { Stage } from '@/lib/supabase';

/**
 * Hook to fetch visible stages for the landing page timeline.
 * Reads from the `stages` table (same source as countdown timer).
 * Falls back to hardcoded timeline data if Supabase is unavailable.
 *
 * Features real-time subscription so admin changes reflect immediately.
 */
export function useStages() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStages = useCallback(async () => {
    try {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      const competition = await supabaseCompetitionService.getCompetition();
      if (competition) {
        // Get visible stages (public, respects RLS)
        const visibleStages = await supabaseStageService.getVisible(competition.id);
        setStages(visibleStages);
      }
    } catch (e) {
      console.warn('[useStages] Failed to fetch stages from Supabase:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    loadStages();
  }, [loadStages]);

  // Subscribe to real-time changes on stages table
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    const channel = supabase
      .channel('landing-stages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stages',
        },
        () => {
          loadStages();
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadStages]);

  return { stages, loading };
}
