export interface TaskInterface {
    title: string;
    id: number;
    description: string;
    prio: string;
    date: string | Date;
    category: string;
    taskCategory: string;
    subtasks: any[];
    contacts: any[];
    user: string;
}