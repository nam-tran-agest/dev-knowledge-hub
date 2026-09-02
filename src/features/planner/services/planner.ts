'use server';

import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';

export interface DBPlannerTask {
    id: string;
    user_id: string;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    date: string;
    time_block_id?: string | null;
    created_at: string;
    updated_at: string;
}

export async function getPlannerTasks(date?: string, endDate?: string): Promise<DBPlannerTask[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    let query = supabase
        .from('planner_tasks')
        .select('*')
        .eq('user_id', user.id);

    if (date && endDate) {
        query = query.gte('date', date).lte('date', endDate);
    } else if (date) {
        query = query.eq('date', date);
    } else {
        const today = format(new Date(), 'yyyy-MM-dd');
        query = query.eq('date', today);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
        if (error.code === '42P01') {
            return [];
        }
        console.error('Error fetching planner tasks:', error);
        return [];
    }

    return (data || []) as DBPlannerTask[];
}

export async function addPlannerTask(title: string, date?: string, timeBlockId?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User authentication required');

    const targetDate = date || format(new Date(), 'yyyy-MM-dd');

    const { data, error } = await supabase
        .from('planner_tasks')
        .insert({
            user_id: user.id,
            title,
            status: 'todo',
            date: targetDate,
            time_block_id: timeBlockId || null
        })
        .select()
        .single();

    if (error) {
        if (error.code === '42P01') return null;
        console.error('Error adding planner task:', error);
        throw new Error('Failed to add task');
    }

    return data as DBPlannerTask;
}

export async function updatePlannerTask(
    id: string, 
    updates: { 
        status?: 'todo' | 'in-progress' | 'done'; 
        time_block_id?: string | null; 
        date?: string;
        title?: string;
    }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
        .from('planner_tasks')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        if (error.code === '42P01') return;
        console.error('Error updating planner task:', error);
    }
}

export async function deletePlannerTask(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
        .from('planner_tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        if (error.code === '42P01') return;
        console.error('Error deleting planner task:', error);
    }
}
