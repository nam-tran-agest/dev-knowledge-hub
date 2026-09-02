'use client';

import React, { useState, useEffect } from 'react';
import { usePlannerStore } from '@/features/planner/store/usePlannerStore';
import { PlannerNavHeader } from './planner-nav-header';
import { TaskItem } from './task-item';
import { getTodayDateStr, formatDateStr } from '../utils/date';
import { 
    Inbox, 
    Plus, 
    Search, 
    CheckCircle2, 
    ArrowRight,
    Sparkles,
    CalendarPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const SomedayView: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const addTask = usePlannerStore(state => state.addTask);
    const moveTask = usePlannerStore(state => state.moveTask);
    const getSomedayTasks = usePlannerStore(state => state.getSomedayTasks);
    const loadServerTasks = usePlannerStore(state => state.loadServerTasks);

    useEffect(() => {
        setIsMounted(true);
        loadServerTasks('someday');
    }, [loadServerTasks]);

    if (!isMounted) return null;

    const somedayTasks = getSomedayTasks();
    const filteredTasks = somedayTasks.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const completedCount = somedayTasks.filter(t => t.status === 'done').length;

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        addTask(newTaskTitle.trim(), 'someday');
        setNewTaskTitle('');
    };

    const handleScheduleToday = (taskId: string) => {
        const todayStr = getTodayDateStr();
        moveTask(taskId, todayStr, undefined);
    };

    const handleScheduleTomorrow = (taskId: string) => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const tomorrowStr = formatDateStr(d);
        moveTask(taskId, tomorrowStr, undefined);
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto min-h-[85vh] pt-24 pb-12 px-4 sm:px-6 font-mono text-white">
            {/* View Selector Header */}
            <PlannerNavHeader />

            {/* Backlog Banner & Metrics */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-surface-deep/90 border border-primary/20 cyber-clip backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 border border-primary/30 cyber-clip-button text-primary">
                        <Inbox className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
                            SOMEDAY // BACKLOG & IDEA VAULT
                        </h2>
                        <p className="text-[11px] text-primary/60 uppercase">
                            // Unscheduled tasks and future ideas. Schedule into any day with 1 click.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-primary/80 bg-primary/10 border border-primary/30 px-3 py-1.5 cyber-clip-button">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>VAULT: {somedayTasks.length} ITEMS</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 cyber-clip-button">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>DONE: {completedCount}/{somedayTasks.length}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Quick Add & Info */}
                <div className="space-y-6">
                    <Card className="border-primary/30 p-5 bg-surface-deep/90">
                        <CardHeader className="p-0 pb-4 border-b border-primary/20">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                                <Plus className="w-4 h-4" />
                                ADD TO SOMEDAY VAULT
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-300">
                                Capture ideas instantly without worrying about scheduling dates.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-0 pt-4">
                            <form onSubmit={handleAddTask} className="space-y-3">
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="Enter idea or task..."
                                    className="w-full bg-surface border border-primary/30 cyber-clip-button px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-primary/40 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                                />

                                <button
                                    type="submit"
                                    disabled={!newTaskTitle.trim()}
                                    className="w-full py-2.5 bg-primary hover:bg-primary/90 text-black font-bold uppercase tracking-wider cyber-clip-button text-xs transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_15px_var(--color-primary)]"
                                >
                                    [ + SAVE_TO_SOMEDAY ]
                                </button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Quick Guide Card */}
                    <Card className="border-primary/20 p-5 bg-surface-deep/60">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <CalendarPlus className="w-3.5 h-3.5" />
                            WORKFLOW HINT
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                            Use the <b>SCHEDULE TODAY</b> button next to any task to immediately transfer it to your active timeline and time-blocking queue.
                        </p>
                    </Card>
                </div>

                {/* Right Column: Filterable Task List */}
                <div className="lg:col-span-2">
                    <Card className="border-primary/30 p-5 bg-surface-deep/90 min-h-[500px] flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/20 pb-4 mb-4">
                            <h3 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-2">
                                <Inbox className="w-4 h-4 text-primary" />
                                BACKLOG ITEMS ({filteredTasks.length})
                            </h3>

                            {/* Search Filter */}
                            <div className="relative w-full sm:w-64">
                                <Search className="w-3.5 h-3.5 text-primary/50 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter tasks..."
                                    className="w-full bg-surface border border-primary/25 cyber-clip-button pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-primary/40 focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 max-h-[60vh] pr-1">
                            {filteredTasks.map((task, index) => (
                                <div key={task.id} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-[#040712]/60 p-1 border border-primary/15 cyber-clip hover:border-primary/40 transition-colors">
                                    <div className="flex-1">
                                        <TaskItem task={task} index={index} />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 pb-2 sm:pb-0 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleScheduleToday(task.id)}
                                            className="px-2.5 py-1 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/30 cyber-clip-button text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1"
                                            title="Schedule for Today"
                                        >
                                            <span>TODAY</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleScheduleTomorrow(task.id)}
                                            className="px-2.5 py-1 bg-primary/5 hover:bg-primary/20 text-primary/80 hover:text-white border border-primary/20 cyber-clip-button text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                                            title="Schedule for Tomorrow"
                                        >
                                            TOMORROW
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredTasks.length === 0 && (
                                <div className="h-56 flex flex-col items-center justify-center text-primary/40 gap-3 border border-dashed border-primary/20 cyber-clip p-6 text-center">
                                    <Inbox className="w-8 h-8 text-primary/50" />
                                    <p className="text-xs uppercase tracking-widest text-primary/60">
                                        [ SOMEDAY VAULT EMPTY ]
                                    </p>
                                    <p className="text-[10px] text-slate-400 max-w-xs">
                                        No unscheduled tasks found. Add future ideas or backlog items using the panel on the left.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};
