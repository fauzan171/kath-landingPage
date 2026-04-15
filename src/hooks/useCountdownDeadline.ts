import { useState, useEffect, useCallback } from 'react';
import { supabaseCompetitionService, supabaseStageService } from '@/services/cibc.service';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/config/environment';
import { nowWIB, toWIB } from '@/utils/timezone';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Shared hook to fetch countdown deadline from Supabase.
 * Prioritizes competition.registration_end for "Registration closes in" countdown.
 * Falls back to active stage's end_date, then configurable default.
 * Returns both the deadline date string and computed timeLeft.
 *
 * Features real-time Supabase subscription so admin changes
 * to competition or stages are reflected immediately on the landing page.
 */
export function useCountdownDeadline(fallbackDaysFromNow: number = 30) {
  const [deadline, setDeadline] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const loadDeadline = useCallback(async () => {
    try {
      // 1. Get the competition first - check registration_end
      const competition = await supabaseCompetitionService.getCompetition();
      if (competition?.registration_end) {
        setDeadline(competition.registration_end);
        setLoading(false);
        return;
      }

      if (competition) {
        // 2. Try active stages first (works for admin/authenticated users)
        const allStages = await supabaseStageService.getByCompetition(competition.id);
        const activeStages = allStages.filter((s) => s.is_active);
        if (activeStages.length > 0 && activeStages[0].end_date) {
          setDeadline(activeStages[0].end_date);
          setLoading(false);
          return;
        }

        // 3. Try visible stages (works for anonymous/public users via RLS policy)
        const visibleStages = await supabaseStageService.getVisible(competition.id);
        // First check for active visible stages
        const activeVisible = visibleStages.filter((s) => s.is_active);
        if (activeVisible.length > 0 && activeVisible[0].end_date) {
          setDeadline(activeVisible[0].end_date);
          setLoading(false);
          return;
        }
        // Then check any visible stage with an end_date
        const stageWithDate = visibleStages.find((s) => s.end_date);
        if (stageWithDate?.end_date) {
          setDeadline(stageWithDate.end_date);
          setLoading(false);
          return;
        }
      }

      // 4. Fallback: N days from now
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + fallbackDaysFromNow);
      setDeadline(fallback.toISOString());
    } catch (e) {
      console.warn('[useCountdownDeadline] Failed to fetch deadline from Supabase, using fallback:', e);
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + fallbackDaysFromNow);
      setDeadline(fallback.toISOString());
    } finally {
      setLoading(false);
    }
  }, [fallbackDaysFromNow]);

  // Fetch deadline on mount
  useEffect(() => {
    loadDeadline();
  }, [loadDeadline]);

  // Subscribe to real-time changes on stages table
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    const channel = supabase
      .channel('countdown-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'competitions',
        },
        () => {
          loadDeadline();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stages',
        },
        () => {
          loadDeadline();
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadDeadline]);

  // Compute timeLeft from deadline
  useEffect(() => {
    if (!deadline) return;

    const targetDate = toWIB(deadline);

    const calculateTimeLeft = () => {
      const now = nowWIB();
      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return { deadline, loading, timeLeft };
}
