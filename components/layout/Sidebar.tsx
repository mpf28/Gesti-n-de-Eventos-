import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { Role } from '../../types';
import { Home, Calendar, PlusCircle, BarChart, LogOut, Users, Bell, Settings } from '../ui/Icons';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  setSidebarOpen?: (open: boolean) => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, setSidebarOpen }) => (
  <li>
    <NavLink
      to={to}
      onClick={() => setSidebarOpen && setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center p-2 rounded-lg group transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
        }`
      }
    >
      {icon}
      <span className="ml-3 flex-1 whitespace-nowrap">{label}</span>
    </NavLink>
  </li>
);

const adminNavLinks = [
  { to: '/', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/events', icon: <Calendar className="w-5 h-5" />, label: 'Lista Eventos' },
  { to: '/create-event', icon: <PlusCircle className="w-5 h-5" />, label: 'Crear Evento' },
  { to: '/stats', icon: <BarChart className="w-5 h-5" />, label: 'Estadísticas' },
  { to: '/users', icon: <Users className="w-5 h-5" />, label: 'Panel Admin' },
];

const userNavLinks = [
  { to: '/', icon: <Home className="w-5 h-5" />, label: 'Resumen' },
  { to: '/events', icon: <Calendar className="w-5 h-5" />, label: 'Mis Eventos' },
  { to: '/create-event', icon: <PlusCircle className="w-5 h-5" />, label: 'Crear Evento' },
  { to: '/notifications', icon: <Bell className="w-5 h-5" />, label: 'Notificaciones' },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const { currentUser, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navLinks = currentUser?.role === Role.Admin ? adminNavLinks : userNavLinks;

  return (
    <>
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col">
          <div className="flex items-center pl-2.5 mb-5">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">GestorEventos</span>
          </div>
          <ul className="space-y-2 font-medium flex-grow">
            {navLinks.map((link) => (
              <NavItem key={link.to} {...link} setSidebarOpen={setSidebarOpen} />
            ))}
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
             <li className="px-2.5 pb-2">
                <img 
                  src="/UI/logo_desarrollo.png"
                  alt="Developer Logo" 
                  className="h-10 w-auto mx-auto" 
                />
             </li>
             <NavItem to="/settings" icon={<Settings className="w-5 h-5" />} label="Configuración" setSidebarOpen={setSidebarOpen} />
             <li>
                <button
                onClick={handleLogout}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full"
                >
                <LogOut className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">Salir</span>
                </button>
            </li>
          </ul>
        </div>
      </aside>
       {isSidebarOpen && (
        <div 
          className="bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};