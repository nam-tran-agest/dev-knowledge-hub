import { format } from 'date-fns';

export function getTodayDateStr(): string {
    return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateStr(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}
