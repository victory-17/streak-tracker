export interface Task {
  id: string;
  title: string;
  description?: string;
  streak: number;
  lastCompleted: string | null;
  completedDates: string[];
}

export interface CompletionStatus {
  [date: string]: {
    [taskId: string]: boolean;
  };
}