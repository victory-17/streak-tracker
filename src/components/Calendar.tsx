import React from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Task } from '../types';

interface CalendarProps {
  tasks: Task[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  isDarkMode: boolean;
}

export function Calendar({ tasks, selectedDate, onSelectDate, isDarkMode }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDate = (day: number): string => {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
  };

  const getCompletedTasksCount = (date: string): number => {
    return tasks.filter(task => 
      task.completedDates.includes(date)
    ).length;
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number): boolean => {
    return formatDate(day) === selectedDate;
  };

  const isFutureDate = (day: number): boolean => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const hasStreak = (date: string): boolean => {
    return tasks.some(task => {
      const dateIndex = task.completedDates.indexOf(date);
      if (dateIndex <= 0) return false;
      
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = prevDate.toISOString().split('T')[0];
      
      return task.completedDates.includes(prevDateStr);
    });
  };

  return (
    <div className={`rounded-lg shadow-lg p-6 transition-colors ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div 
            key={day} 
            className={`text-center text-sm font-medium py-2 transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-12" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = formatDate(day);
          const completedCount = getCompletedTasksCount(date);
          const future = isFutureDate(day);
          const streakDay = hasStreak(date);
          
          return (
            <button
              key={day}
              onClick={() => !future && onSelectDate(date)}
              disabled={future}
              className={`
                h-12 flex flex-col items-center justify-center relative
                transition-colors rounded-lg
                ${future 
                  ? isDarkMode 
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-blue-50'
                }
                ${isSelected(day) && !future
                  ? isDarkMode 
                    ? 'bg-blue-900' 
                    : 'bg-blue-100'
                  : ''
                }
              `}
            >
              <div className="relative">
                <span className={`
                  ${isToday(day) 
                    ? isDarkMode 
                      ? 'text-blue-400 font-bold' 
                      : 'text-blue-600 font-bold'
                    : isDarkMode
                      ? 'text-gray-300'
                      : 'text-gray-700'
                  }
                  ${future ? 'opacity-50' : ''}
                `}>
                  {day}
                </span>
                {streakDay && !future && (
                  <Flame className="absolute -top-3 -right-3 w-3 h-3 text-orange-500" />
                )}
              </div>
              {completedCount > 0 && !future && (
                <div className={`absolute bottom-1 w-4 h-1 rounded-full ${
                  isDarkMode ? 'bg-green-600' : 'bg-green-500'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}