import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface AddTaskProps {
  onAddTask: (title: string, description?: string) => void;
  isDarkMode: boolean;
}

export function AddTask({ onAddTask, isDarkMode }: AddTaskProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
              : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
          }`}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description (optional)..."
        rows={2}
        className={`w-full px-4 py-2 rounded-lg border transition-colors ${
          isDarkMode
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
            : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
        }`}
      />
    </form>
  );
}