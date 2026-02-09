"use client";

import { Task, TaskStatus } from '@/types/working';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, PlayCircle, PauseCircle, AlertCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";

interface TaskListProps {
    tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
    const t = useTranslations('working.list');

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300">{t('emptyTitle')}</h3>
                <p className="text-slate-500 max-w-sm mt-2">{t('emptyDesc')}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {tasks.map((task) => (
                <Card key={task.id} className="group relative bg-[#111114] border-white/5 hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <StatusIcon status={task.status} />
                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {task.title}
                                    </h3>
                                    <Badge variant="outline" className={cnPriority(task.priority)}>
                                        {task.priority}
                                    </Badge>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                                    {task.description}
                                </p>
                                <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(task.created_at || "").toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/5">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-slate-200">
                                    <DropdownMenuItem className="gap-2 focus:bg-white/10 focus:text-white cursor-pointer">
                                        <Edit2 className="w-4 h-4" /> {t('actions.edit')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                                        <Trash2 className="w-4 h-4" /> {t('actions.delete')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>

                    {/* Progress Bar / Indicator (Visual Polish) */}
                    <div className={cnStatusBorder(task.status)} />
                </Card>
            ))}
        </div>
    );
}

function StatusIcon({ status }: { status: TaskStatus }) {
    switch (status) {
        case 'active': return <PlayCircle className="w-5 h-5 text-blue-500" />;
        case 'paused': return <PauseCircle className="w-5 h-5 text-yellow-500" />;
        case 'blocked': return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
}

function cnPriority(priority: string) {
    return cn(
        "font-bold",
        priority === 'high' && "bg-red-500/10 text-red-400 border-red-500/20",
        priority === 'medium' && "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        priority === 'low' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    );
}

function cnStatusBorder(status: TaskStatus) {
    return cn(
        "absolute left-0 top-0 bottom-0 w-1",
        status === 'active' && "bg-blue-500",
        status === 'paused' && "bg-yellow-500",
        status === 'blocked' && "bg-red-500"
    );
}
