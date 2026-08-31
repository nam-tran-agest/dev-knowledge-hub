'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePlannerStore } from '@/features/planner/store/usePlannerStore';
import type { DBPlannerTask } from '@/features/planner/services/planner';

export function usePlannerRealtime() {
    const [isConnected, setIsConnected] = useState(false);
    const handleRealtimeEvent = usePlannerStore(state => state.handleRealtimeEvent);

    useEffect(() => {
        const supabase = createClient();
        if (!supabase) return;

        const channel = supabase
            .channel('planner_tasks_realtime_sync')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'planner_tasks'
                },
                (payload) => {
                    const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
                    const record = (eventType === 'DELETE' ? payload.old : payload.new) as DBPlannerTask | { id: string };
                    if (record && 'id' in record) {
                        handleRealtimeEvent(eventType, record);
                    }
                }
            )
            .subscribe((status) => {
                setIsConnected(status === 'SUBSCRIBED');
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [handleRealtimeEvent]);

    return { isConnected };
}
