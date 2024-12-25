import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useRealtimeLikes = (category?: string) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'likes'
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['photos', category] });
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    setupRealtimeSubscription();

    return () => {
      const cleanup = async () => {
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
      cleanup();
    };
  }, [queryClient, category]);
};