'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePlannerStore } from '@/features/planner/store/usePlannerStore';
import type { DBPlannerTask } from '@/features/planner/services/planner';
import type { RealtimeChannel } from '@supabase/supabase-js';

let sharedChannel: RealtimeChannel | null = null;
let subscribersCount = 0;
let cleanupTimeout: NodeJS.Timeout | null = null;
let isChannelConnected = false;
const listeners = new Set<(connected: boolean) => void>();

function notifyListeners(status: boolean) {
    isChannelConnected = status;
    listeners.forEach(fn => fn(status));
}

export function usePlannerRealtime() {
    const [isConnected, setIsConnected] = useState<boolean>(isChannelConnected);
    const handleRealtimeEvent = usePlannerStore(state => state.handleRealtimeEvent);

    useEffect(() => {
        const handleStatus = (status: boolean) => setIsConnected(status);
        listeners.add(handleStatus);

        if (cleanupTimeout) {
            clearTimeout(cleanupTimeout);
            cleanupTimeout = null;
        }

        subscribersCount++;

        if (!sharedChannel) {
            const supabase = createClient();
            if (supabase) {
                sharedChannel = supabase
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
                        notifyListeners(status === 'SUBSCRIBED');
                    });
            }
        } else {
            setIsConnected(isChannelConnected);
        }

        return () => {
            listeners.delete(handleStatus);
            subscribersCount--;

            if (subscribersCount <= 0) {
                subscribersCount = 0;
                cleanupTimeout = setTimeout(() => {
                    if (subscribersCount === 0 && sharedChannel) {
                        const supabase = createClient();
                        if (supabase && sharedChannel) {
                            supabase.removeChannel(sharedChannel);
                        }
                        sharedChannel = null;
                        notifyListeners(false);
                    }
                }, 3000); // 3 second grace period for seamless tab transitions
            }
        };
    }, [handleRealtimeEvent]);

    return { isConnected };
}
