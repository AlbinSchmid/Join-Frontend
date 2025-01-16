export interface TaskInterface {
    title: string;
    id: number;
    description: string;
    prio: string;
    date: string;
    category: string;
    taskCategory: string;
    subtasks: string[];
    contacts: string[];
    user: string;
}