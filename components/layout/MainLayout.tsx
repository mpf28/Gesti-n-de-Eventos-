
import React, { useState, useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AppContext } from '../../App';
import { Menu, Bell, UserCheck } from '../ui/Icons';

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { currentUser } = useContext(AppContext);
    return (
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center min-w-0">
                        <button onClick={onMenuClick} className="mr-3 text-gray-600 dark:text-gray-300 sm:hidden" aria-label="Abrir menú">
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800 dark:text-white truncate">Panel</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white" aria-label="Notificaciones">
                            <Bell className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-2">
                             <UserCheck className="w-6 h-6 text-gray-500" />
                             <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{currentUser?.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};


export const MainLayout: React.FC = () => {
    const { currentUser } = useContext(AppContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="sm:ml-64">
                 <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};