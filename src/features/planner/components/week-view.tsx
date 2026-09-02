'use client';

import React, { useState, useEffect } from 'react';
import { usePlannerStore } from '@/features/planner/store/usePlannerStore';
import { PlannerNavHeader } from './planner-nav-header';
import { TaskItem } from './task-item';
import { getTodayDateStr, formatDateStr } from '../utils/date';
import { 
    ChevronLeft, 
    ChevronRight, 
    RotateCcw, 
    Plus, 
    Calendar, 
    CheckCircle2,
    Clock,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from '@/i18n/routing';

// Helper to get start of week (Monday)
const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date;
};

export const WeekView: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const tasks = usePlannerStore(state => state.tasks);
    const schedules = usePlannerStore(state => state.schedules);
    const addTask = usePlannerStore(state => state.addTask);
    const loadServerTasks = usePlannerStore(state => state.loadServerTasks);
    const setSelectedDate = usePlannerStore(state => state.setSelectedDate);

    const [currentMonday, setCurrentMonday] = useState<Date>(() => getMonday(new Date()));
    const [addingDayStr, setAddingDayStr] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');

    const todayStr = getTodayDateStr();

    // Generate 7 days of the week
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(currentMonday);
        d.setDate(d.getDate() + i);
        const dateStr = formatDateStr(d);
        return {
            dateObj: d,
            dateStr,
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            isToday: dateStr === todayStr
        };
    });

    const startDateStr = weekDays[0].dateStr;
    const endDateStr = weekDays[6].dateStr;

    useEffect(() => {
        setIsMounted(true);
        loadServerTasks(startDateStr, endDateStr);
    }, [startDateStr, endDateStr, loadServerTasks]);

    if (!isMounted) return null;

    const navigateWeek = (offset: number) => {
        const nextMonday = new Date(currentMonday);
        nextMonday.setDate(nextMonday.getDate() + (offset * 7));
        setCurrentMonday(nextMonday);
    };

    const jumpToCurrentWeek = () => {
        setCurrentMonday(getMonday(new Date()));
    };

    const handleAddTask = (dateStr: string) => {
        if (!newTitle.trim()) {
            setAddingDayStr(null);
            return;
        }
        addTask(newTitle.trim(), dateStr);
        setNewTitle('');
        setAddingDayStr(null);
    };

    const totalWeekTasks = weekDays.reduce((acc, day) => {
        const dayTaskIds = schedules[day.dateStr]?.tasks || [];
        return acc + dayTaskIds.length;
    }, 0);

    const totalWeekDone = weekDays.reduce((acc, day) => {
        const dayTaskIds = schedules[day.dateStr]?.tasks || [];
        const done = dayTaskIds.filter(id => tasks[id]?.status === 'done').length;
        return acc + done;
    }, 0);

    return (
        <div className="w-full max-w-[1700px] mx-auto min-h-[85vh] pt-24 pb-12 px-4 sm:px-6 font-mono text-white">
            {/* View Selector Header */}
            <PlannerNavHeader />

            {/* Week Navigation & Summary Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-surface-deep/90 border border-primary/20 cyber-clip backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigateWeek(-1)}
                        className="p-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary cyber-clip-button cursor-pointer transition-colors"
                        title="Previous Week"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 px-3.5 py-1.5 bg-surface border border-primary/40 cyber-clip-button">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                            WEEK // {weekDays[0].displayDate} — {weekDays[6].displayDate}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigateWeek(1)}
                        className="p-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary cyber-clip-button cursor-pointer transition-colors"
                        title="Next Week"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={jumpToCurrentWeek}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/15 hover:bg-primary text-primary hover:text-black border border-primary/40 cyber-clip-button text-xs transition-colors cursor-pointer ml-2"
                    >
                        <RotateCcw className="w-3 h-3" />
                        <span>THIS_WEEK</span>
                    </button>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-primary/80 bg-primary/10 border border-primary/30 px-3 py-1.5 cyber-clip-button">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>WEEK_TOTAL: {totalWeekTasks} TASKS</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 cyber-clip-button">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PROGRESS: {totalWeekDone}/{totalWeekTasks}</span>
                    </div>
                </div>
            </div>

            {/* 7-Column Week Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 min-h-[70vh]">
                {weekDays.map((day) => {
                    const dayTaskIds = schedules[day.dateStr]?.tasks || [];
                    const dayTasks = dayTaskIds.map(id => tasks[id]).filter(Boolean);
                    const completed = dayTasks.filter(t => t.status === 'done').length;
                    const isAdding = addingDayStr === day.dateStr;

                    return (
                        <Card 
                            key={day.dateStr}
                            className={cn(
                                "flex flex-col border transition-all duration-200 min-h-[380px]",
                                day.isToday
                                    ? "border-primary shadow-[0_0_20px_rgba(0,240,255,0.2)] bg-surface-deep/95"
                                    : "border-primary/20 bg-surface-deep/80 hover:border-primary/40"
                            )}
                        >
                            {/* Day Header */}
                            <CardHeader className="p-3 pb-2 border-b border-primary/15 relative">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className={cn(
                                            "text-xs font-bold uppercase",
                                            day.isToday ? "text-primary text-glow-cyan font-extrabold" : "text-white"
                                        )}>
                                            {day.dayName}
                                        </span>
                                        <span className="text-[10px] text-primary/60">
                                            {day.displayDate}
                                        </span>
                                    </div>

                                    {day.isToday ? (
                                        <span className="text-[9px] bg-primary text-black font-bold px-1.5 py-0.5 cyber-clip-button">
                                            TODAY
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-primary/50 font-mono">
                                            {completed}/{dayTasks.length}
                                        </span>
                                    )}
                                </div>

                                {/* Link to Day Timeline */}
                                <div className="mt-1 flex justify-between items-center">
                                    <Link
                                        href="/planner/today"
                                        onClick={() => setSelectedDate(day.dateStr)}
                                        className="text-[9px] text-primary/50 hover:text-primary flex items-center gap-0.5 uppercase tracking-wider transition-colors"
                                        title="Open Day Timeline"
                                    >
                                        <span>TIMELINE</span>
                                        <ArrowUpRight className="w-2.5 h-2.5" />
                                    </Link>
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddingDayStr(day.dateStr);
                                            setNewTitle('');
                                        }}
                                        className="text-[9px] text-primary hover:text-white flex items-center gap-0.5 px-1.5 py-0.5 bg-primary/10 hover:bg-primary/30 cyber-clip-button transition-colors cursor-pointer"
                                    >
                                        <Plus className="w-2.5 h-2.5" />
                                        <span>ADD</span>
                                    </button>
                                </div>
                            </CardHeader>

                            {/* Task List */}
                            <CardContent className="p-2 flex-1 flex flex-col overflow-y-auto custom-scrollbar max-h-[60vh]">
                                {isAdding && (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleAddTask(day.dateStr);
                                        }}
                                        className="mb-2 p-1.5 bg-surface border border-primary cyber-clip animate-in fade-in"
                                    >
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Escape') setAddingDayStr(null);
                                            }}
                                            placeholder="Task title..."
                                            className="w-full bg-transparent px-1.5 py-1 text-xs font-mono text-white focus:outline-none placeholder:text-primary/40"
                                        />
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <button
                                                type="button"
                                                onClick={() => setAddingDayStr(null)}
                                                className="px-2 py-0.5 text-[9px] text-primary/60 hover:text-white"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={!newTitle.trim()}
                                                className="px-2 py-0.5 bg-primary text-black text-[9px] font-bold cyber-clip-button"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-1.5 flex-1">
                                    {dayTasks.map((task, index) => (
                                        <TaskItem key={task.id} task={task} index={index} />
                                    ))}

                                    {dayTasks.length === 0 && !isAdding && (
                                        <div className="h-32 flex flex-col items-center justify-center text-primary/30 text-[10px] uppercase text-center border border-dashed border-primary/10 cyber-clip p-2">
                                            <span>// NO_TASKS</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
