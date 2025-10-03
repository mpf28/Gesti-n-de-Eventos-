import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import { Bell, UserCheck, PlusCircle } from '../ui/Icons';

const iconMap = {
    success: <UserCheck className="w-5 h-5 text-green-500" />,
    info: <PlusCircle className="w-5 h-5 text-blue-500" />,
    warning: <Bell className="w-5 h-5 text-yellow-500" />,
    error: <Bell className="w-5 h-5 text-red-500" />,
};

export const NotificationsPage: React.FC = () => {
    const { currentUser, notifications } = useContext(AppContext);
    
    const myNotifications = useMemo(() => {
        if (!currentUser) return [];
        return notifications.filter(n => n.userId === currentUser.id);
    }, [currentUser, notifications]);

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Notificaciones</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                {myNotifications.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {myNotifications.map(n => (
                            <li key={n.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">
                                    {iconMap[n.type]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(n.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                        <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold">No tienes notificaciones</h3>
                        <p>Las nuevas notificaciones aparecerán aquí.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
