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
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA5CAYAAABa2P9DAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRFNjk0M0E3NzcyNzExRTNBMzREQkEzQUM4QjA3NEQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRFNjk0M0E4NzcyNzExRTNBMzREQkEzQUM4QjA3NEQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEU2OTQzQTU3NzI3MTFFM0EzNERCQTNBQzhCMDc0RDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEU2OTQzQTY3NzI3MTFFM0EzNERCQTNBQzhCMDc0RDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6dM03SAAACo0lEQVR42uyc25GDIBAFbf9L2j/SbtLu0f5ND0EGIQRWkGzMvKz3iAAY8/F4/f6T5ziP/z0E/iCeywR+4nku8F7wPAQeEA9m0qMuwv/g6fT083p6ev0+fX39/n49Pj6+n39/v87u7u7/Lq+v/++6n5+fz86Hn/a3s7s7P513l8/nfWvP+3x8PN+dX1//52X0x/n8+Pj4eTo9/Xwe+Gf/8t7b8+k89oT3p/P+9a+v3//72Z2dD6dHe+/9/f336e/vp7+n99F5353Pz8/n6fT08/F4PO/Pz+fnw8/7dHZ3d2/Po5/P+3d8fHz8+nj6eX/v1d8fH6dP75/z4+Pn4/n5/P16/f7++vX0eXp7f/81PT6+n87P+fX19fX+ff5+PT3/PX3/e/p+ff98/X41//4v++t7b8/n5+fn4/PDz/v3+/no9PT39/fn+/nr6fX59fX38+vj4eH+9n3/f1x+ff58+v3+/nr/PT/8f+f/n6+n1+fb++vr+9v+fn8+Pj5/z5+v36+fnw8/3+fDzeX9/enx8fD/8fP89Pd+fz8+n/w99+nj8eXp8fD++nx7Pz2/v+fnp/X17f/9+vX4+/z19ff9+vT/++fn0/PP0+fn59P7+ffr8+Pj4fr3++vX0+vT0+Ph4e3++/v16f398Pz3dP/98//n7/PT3dv97//X9+en99/z38/Pz+/n1+f/9+ffp4PDze3v/72d2d97fnw8/j/f3w8/r9ev58/3p6+/r5+v5+/n5/P/x6en69f37+e3p8/Xt8fX19/nx+f/96Pz3e3v76fPr5+v16ff/+/nz/Pj/+/v56+/r0fnw9/X5+vX8ePz3//fr9/fT09v76/Pj+8/j3dHZ3px+PDw/++X56e39/PT0+Ps7Pb++nx9vb+fnp6fT8+v56e3++/v309P7+ev96enx8/X49/3p/e/r5+v16+/r5+v1+fHt/fX56ff95/P369/b0fnr8fPj5+v38+fn5+fj+8/T1+fb+/vv0fnr/PHz/Pfw+n/Y/PT3/PPrP89Pj8Tz+P341z/vj4+f89Tz+n9efw3w/Pz+fn5/3j+N8fPzz9vT09v77+v37+fn++Tze35/P+9s/j+cAAAAAAAAAAAD4M/8LMADsW9+D4dK0AAAAAElFTkSuQmCC"
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