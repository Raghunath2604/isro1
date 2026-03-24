import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        px-3 py-2 rounded-lg transition-all duration-300
        ${isDark
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isDark ? 'focus:ring-blue-500' : 'focus:ring-blue-400'}
      `}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {/* Sun icon */}
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a1 1 0 00-1.414 0l-.707.707-1.414-1.414.707-.707a1 1 0 000-1.414l-2.12-2.121a1 1 0 00-1.414 1.414l2.12 2.121a1 1 0 001.414 0l.707-.707 1.414 1.414-.707.707a1 1 0 000 1.414l2.12 2.121a1 1 0 001.414-1.414zM17 11a1 1 0 100-2h-2a1 1 0 100 2h2zm2-7a1 1 0 01-2 0V3a1 1 0 012 0v2zm-3 11a1 1 0 11-2 0v-2a1 1 0 112 0v2z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {/* Moon icon */}
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
      <span className="ml-2 text-sm font-medium">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};
