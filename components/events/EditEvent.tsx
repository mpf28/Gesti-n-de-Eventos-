import React, { useContext, useMemo } from 'react';
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { EventForm, EventFormData } from './EventForm';
import { Role } from '../../types';

export const EditEvent: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const { events, updateEvent, currentUser } = useContext(AppContext);
    const navigate = useNavigate();

    const event = useMemo(() => events.find(e => e.id === eventId), [events, eventId]);

    if (!event) {
        return <div className="p-8 text-center text-gray-500">Evento no encontrado. <Link to="/events" className="text-blue-500">Volver a la lista.</Link></div>;
    }

    if (currentUser?.role !== Role.Admin && currentUser?.id !== event.creatorId) {
        return <Navigate to="/events" replace />;
    }

    const handleSubmit = (data: EventFormData) => {
        const updatedSchedules = data.schedules.map(s => ({
            ...s,
            id: s.id || `sch-${crypto.randomUUID()}`
        }));

        const updatedEvent = {
            ...event,
            ...data,
            schedules: updatedSchedules,
        };

        updateEvent(updatedEvent);
        navigate('/events');
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Editar Evento</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <EventForm
                    event={event}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/events')}
                    submitButtonText="Guardar Cambios"
                />
            </div>
        </div>
    );
};
