import React from 'react';
import { Task } from '../types';
import { Trophy, Target, Calendar, Flame, Award } from 'lucide-react';

interface StatisticsProps {
  tasks: Task[];
  isDarkMode: boolean;
}

export function Statistics({ tasks, isDarkMode }: StatisticsProps) {
  const calculateTaskStats = (task: Task) => {
    const totalDays = task.completedDates.length;
    const firstDate = task.completedDates[0];
    const lastDate = task.completedDates[task.completedDates.length - 1];
    
    let daysBetween = 0;
    if (firstDate && lastDate) {
      const start = new Date(firstDate);
      const end = new Date(lastDate);
      daysBetween = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    
    const completionRate = daysBetween ? ((totalDays / daysBetween) * 100).toFixed(1) : '0';
    const maxStreak = task.completedDates.reduce((max, date, index) => {
      if (index === 0) return 1;
      
      const prevDate = new Date(task.completedDates[index - 1]);
      const currentDate = new Date(date);
      const diffDays = Math.ceil((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return max + 1;
      }
      return max;
    }, 0);

    return {
      totalDays,
      completionRate,
      maxStreak,
      currentStreak: task.streak
    };
  };

  const overallStats = {
    totalTasks: tasks.length,
    activeTasks: tasks.filter(task => task.streak > 0).length,
    totalCompletions: tasks.reduce((sum, task) => sum + task.completedDates.length, 0),
    totalStreaks: tasks.reduce((sum, task) => sum + task.streak, 0),
  };

  return (
    <div className="space-y-8">
      <div className={`rounded-lg shadow-lg p-6 transition-colors ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Overall Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
          }`}>
            <div className="flex items-center space-x-3">
              <Target className={`w-6 h-6 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Total Tasks</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{overallStats.totalTasks}</p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-green-50'
          }`}>
            <div className="flex items-center space-x-3">
              <Award className={`w-6 h-6 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Active Tasks</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{overallStats.activeTasks}</p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
          }`}>
            <div className="flex items-center space-x-3">
              <Calendar className={`w-6 h-6 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Total Completions</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{overallStats.totalCompletions}</p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-orange-50'
          }`}>
            <div className="flex items-center space-x-3">
              <Flame className={`w-6 h-6 ${
                isDarkMode ? 'text-orange-400' : 'text-orange-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Total Active Streaks</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{overallStats.totalStreaks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-lg shadow-lg p-6 transition-colors ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Task Statistics
        </h2>
        <div className="space-y-6">
          {tasks.map(task => {
            const stats = calculateTaskStats(task);
            return (
              <div key={task.id} className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{task.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Total Days Completed</p>
                    <p className={`text-xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{stats.totalDays}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Completion Rate</p>
                    <p className={`text-xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{stats.completionRate}%</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Current Streak</p>
                    <p className={`text-xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{stats.currentStreak}</p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Longest Streak</p>
                    <p className={`text-xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{stats.maxStreak}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}