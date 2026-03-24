import React, { useState } from 'react';

/**
 * Responsive layout component for mobile, tablet, and desktop
 * Automatically adapts sidebar, navigation, and content layout
 */
export const ResponsiveLayout = ({ children, header, sidebar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Navigation Toggle */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-2 left-2 z-50 p-2 bg-blue-500 text-white rounded-lg md:hidden"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar/Navigation */}
      {sidebar && (
        <div
          className={`
            fixed md:relative z-40 bg-white dark:bg-gray-800 shadow-lg
            w-64 h-screen transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            overflow-y-auto
          `}
        >
          {sidebar}
        </div>
      )}

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {header && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            {header}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-2 md:p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Responsive Grid Component
export const ResponsiveGrid = ({ children, cols = 3 }) => {
  return (
    <div
      className={`
        grid gap-3 md:gap-4 lg:gap-6
        grid-cols-1
        md:grid-cols-2
        ${cols === 3 ? 'lg:grid-cols-3' : cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}
      `}
    >
      {children}
    </div>
  );
};

// Mobile-friendly Card Component
export const ResponsiveCard = ({ title, children, action }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {title && (
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 p-3 md:p-4">
          <h3 className="font-bold text-white text-sm md:text-base">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-3 md:p-4">
        {children}
      </div>
    </div>
  );
};
