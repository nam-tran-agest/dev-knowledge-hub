import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface PlannerTask {
    id: string;
    title: string;
    status: TaskStatus;
    createdAt: string; // ISO date string
    timeBlockId?: string; // If assigned to a specific time block
}

export interface DaySchedule {
    date: string; // ISO date string
    tasks: string[]; // Task IDs
}

interface PlannerState {
    tasks: Record<string, PlannerTask>;
    schedules: Record<string, DaySchedule>; // date -> DaySchedule

    // Actions
    addTask: (title: string, date?: string, timeBlockId?: string) => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => void;
    deleteTask: (taskId: string) => void;
    moveTask: (taskId: string, newDate?: string, newTimeBlockId?: string) => void;

    // Getters
    getTasksForDate: (date: string) => PlannerTask[];
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
    // Dummy data to start with
    tasks: {
        'task-1': {
            id: 'task-1',
            title: 'Review PRs',
            status: 'todo',
            createdAt: new Date().toISOString(),
        },
        'task-2': {
            id: 'task-2',
            title: 'Write Planner Store',
            status: 'in-progress',
            createdAt: new Date().toISOString(),
            timeBlockId: '09:00',
        },
        'task-3': {
            id: 'task-3',
            title: 'Update documentation',
            status: 'done',
            createdAt: new Date().toISOString(),
        },
    },
    schedules: {
        // Current date will be initialized dynamically in components or we can use a helper
        [new Date().toISOString().split('T')[0]]: {
            date: new Date().toISOString().split('T')[0],
            tasks: ['task-1', 'task-2', 'task-3'],
        }
    },

    addTask: (title, date = new Date().toISOString().split('T')[0], timeBlockId) => set((state) => {
        const newTask: PlannerTask = {
            id: uuidv4(),
            title,
            status: 'todo',
            createdAt: new Date().toISOString(),
            timeBlockId,
        };

        const currentSchedule = state.schedules[date] || { date, tasks: [] };

        return {
            tasks: { ...state.tasks, [newTask.id]: newTask },
            schedules: {
                ...state.schedules,
                [date]: {
                    ...currentSchedule,
                    tasks: [...currentSchedule.tasks, newTask.id],
                },
            },
        };
    }),

    updateTaskStatus: (taskId, status) => set((state) => ({
        tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], status },
        }
    })),

    deleteTask: (taskId) => set((state) => {
        const newTasks = { ...state.tasks };
        delete newTasks[taskId];

        // Remove from schedules
        const newSchedules = { ...state.schedules };
        Object.keys(newSchedules).forEach(date => {
            newSchedules[date].tasks = newSchedules[date].tasks.filter(id => id !== taskId);
        });

        return { tasks: newTasks, schedules: newSchedules };
    }),

    moveTask: (taskId, newDate, newTimeBlockId) => set((state) => {
        const task = state.tasks[taskId];
        if (!task) return state;

        // Update the task itself
        const updatedTask = { ...task, timeBlockId: newTimeBlockId };
        const newTasks = { ...state.tasks, [taskId]: updatedTask };

        const newSchedules = { ...state.schedules };

        if (newDate) {
            // Find old schedule and remove
            Object.entries(newSchedules).forEach(([d, sched]) => {
                if (sched.tasks.includes(taskId)) {
                    newSchedules[d] = {
                        ...sched,
                        tasks: sched.tasks.filter(id => id !== taskId)
                    };
                }
            });

            // Add to new schedule
            const targetSchedule = newSchedules[newDate] || { date: newDate, tasks: [] };
            newSchedules[newDate] = {
                ...targetSchedule,
                tasks: [...targetSchedule.tasks, taskId]
            };
        }

        return { tasks: newTasks, schedules: newSchedules };
    }),

    getTasksForDate: (date: string) => {
        const state = get();
        const schedule = state.schedules[date];
        if (!schedule) return [];
        return schedule.tasks.map(id => state.tasks[id]).filter(Boolean);
    }
}));
