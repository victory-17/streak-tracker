import React from 'react';
import { Task } from '../types';
import { CheckCircle2, XCircle, Flame } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleCompletion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  isTaskCompletedToday: (taskId: string) => boolean;
  onShowCalendar: (taskId: string | null) => void;
  selectedTaskId: string | null;
  isDarkMode: boolean;
}

export function TaskList({ 
  tasks, 
  onToggleCompletion, 
  onDeleteTask, 
  isTaskCompletedToday,
  onShowCalendar,
  selectedTaskId,
  isDarkMode
}: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded-lg shadow-md transition-colors ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onToggleCompletion(task.id)}
                className="focus:outline-none"
              >
                {isTaskCompletedToday(task.id) ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`} />
                )}
              </button>
              <div>
                <span className={`text-lg font-medium transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {task.title}
                </span>
                {task.description && (
                  <p className={`mt-1 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className={`font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {task.streak}
                </span>
              </div>
              <button
                onClick={() => onDeleteTask(task.id)}
                className={`text-red-500 hover:text-red-700 transition-colors ${
                  isDarkMode ? 'hover:text-red-400' : ''
                }`}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}