import React, { useState, useEffect } from 'react';
import { Task } from './types';
import { TaskList } from './components/TaskList';
import { AddTask } from './components/AddTask';
import { Calendar } from './components/Calendar';
import { Statistics } from './components/Statistics';
import { Trophy, Calendar as CalendarIcon, Moon, Sun, LayoutDashboard, BarChart } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'statistics'>('dashboard');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      streak: 0,
      lastCompleted: null,
      completedDates: [],
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const isTaskCompletedOnDate = (taskId: string, date: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;
    return task.completedDates.includes(date);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id !== taskId) return task;

      const isCompleted = task.completedDates.includes(selectedDate);
      let newCompletedDates: string[];
      let newStreak: number;
      let newLastCompleted: string | null;

      if (isCompleted) {
        newCompletedDates = task.completedDates.filter(date => date !== selectedDate);
        newStreak = task.streak > 0 ? task.streak - 1 : 0;
        newLastCompleted = task.lastCompleted;
      } else {
        newCompletedDates = [...task.completedDates, selectedDate].sort();
        
        const yesterday = new Date(selectedDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (task.lastCompleted === yesterdayStr) {
          newStreak = task.streak + 1;
        } else {
          newStreak = 1;
        }
        newLastCompleted = selectedDate;
      }

      return {
        ...task,
        completedDates: newCompletedDates,
        streak: newStreak,
        lastCompleted: newLastCompleted,
      };
    }));
  };

  const totalStreaks = tasks.reduce((sum, task) => sum + task.streak, 0);
  const isCurrentDate = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className={`rounded-lg shadow-lg p-6 mb-8 transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h1 className={`text-3xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Daily Streak Tracker
            </h1>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <CalendarIcon className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </button>
              {isDatePickerOpen && (
                <div className="absolute top-24 right-4 z-50">
                  <Calendar
                    tasks={[]}
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setIsDatePickerOpen(false);
                    }}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'
              }`}>
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className={`font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Total Streaks: {totalStreaks}
                </span>
              </div>
            </div>
          </div>
          
          <AddTask onAddTask={addTask} isDarkMode={isDarkMode} />

          <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mt-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'dashboard'
                  ? isDarkMode
                    ? 'text-blue-400'
                    : 'text-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </div>
              {activeTab === 'dashboard' && (
                <div className={`absolute bottom-0 left-0 w-full h-0.5 ${
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                }`} />
              )}
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'calendar'
                  ? isDarkMode
                    ? 'text-blue-400'
                    : 'text-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Calendar</span>
              </div>
              {activeTab === 'calendar' && (
                <div className={`absolute bottom-0 left-0 w-full h-0.5 ${
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                }`} />
              )}
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'statistics'
                  ? isDarkMode
                    ? 'text-blue-400'
                    : 'text-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart className="w-5 h-5" />
                <span>Statistics</span>
              </div>
              {activeTab === 'statistics' && (
                <div className={`absolute bottom-0 left-0 w-full h-0.5 ${
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                }`} />
              )}
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div>
            {tasks.length > 0 ? (
              <TaskList
                tasks={tasks}
                onToggleCompletion={toggleTaskCompletion}
                onDeleteTask={deleteTask}
                isTaskCompletedToday={(taskId) => isTaskCompletedOnDate(taskId, selectedDate)}
                onShowCalendar={setSelectedTaskId}
                selectedTaskId={selectedTaskId}
                isDarkMode={isDarkMode}
              />
            ) : (
              <div className={`text-center mt-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className="text-lg">No tasks added yet. Add your first task to start building streaks!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className={`rounded-lg shadow-lg p-6 transition-colors ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Calendar
              tasks={tasks}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {activeTab === 'statistics' && (
          <Statistics tasks={tasks} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
}

export default App;