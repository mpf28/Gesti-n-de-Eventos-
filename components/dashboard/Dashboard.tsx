
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { Role, ParticipantStatus } from '../../types';
import { Link } from 'react-router-dom';
import { Calendar, Users, BarChart } from '../ui/Icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; linkTo?: string }> = ({ title, value, icon, linkTo }) => {
    const content = (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
            </div>
        </div>
    );
    return linkTo ? <Link to={linkTo}>{content}</Link> : <div>{content}</div>;
};

const AdminDashboard: React.FC = () => {
    const { events, users } = useContext(AppContext);

    const totalEvents = events.length;
    const totalParticipants = events.reduce((acc, event) => acc + event.participants.length, 0);
    const confirmedParticipants = events.reduce((acc, event) => acc + event.participants.filter(p => p.status === ParticipantStatus.Confirmed).length, 0);
    const totalUsers = users.length;
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard de Administrador</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Resumen general del sistema.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Eventos Totales" value={totalEvents} icon={<Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />} linkTo="/events"/>
                <StatCard title="Participantes Totales" value={totalParticipants} icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />} />
                <StatCard title="Inscritos Confirmados" value={confirmedParticipants} icon={<Users className="w-6 h-6 text-green-600 dark:text-green-400" />} />
                <StatCard title="Usuarios Registrados" value={totalUsers} icon={<Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />} />
            </div>
            {/* Here you could add charts or recent activity logs */}
        </div>
    );
};

const UserDashboard: React.FC = () => {
    const { events, currentUser } = useContext(AppContext);
    
    const myEvents = events.filter(e => e.creatorId === currentUser?.id);
    const totalMyEvents = myEvents.length;
    const totalMyParticipants = myEvents.reduce((acc, event) => acc + event.participants.length, 0);
    const myNextEvent = myEvents.length > 0 ? myEvents[0] : null;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bienvenido, {currentUser?.name}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Resumen de tus actividades.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard title="Mis Eventos" value={totalMyEvents} icon={<Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />} linkTo="/events"/>
                 <StatCard title="Participantes en mis eventos" value={totalMyParticipants} icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />} />
                 <StatCard title="Próximo Evento" value={myNextEvent ? myNextEvent.title : "N/A"} icon={<BarChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />} />
            </div>
        </div>
    );
};

export const Dashboard: React.FC = () => {
    const { currentUser } = useContext(AppContext);

    return (
        <div className="p-4 md:p-8">
            {currentUser?.role === Role.Admin ? <AdminDashboard /> : <UserDashboard />}
        </div>
    );
};
