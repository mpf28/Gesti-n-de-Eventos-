import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { EventForm, EventFormData } from './EventForm';

export const CreateEvent: React.FC = () => {
    const { addEvent } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = (data: EventFormData) => {
        const finalSchedules = data.schedules.map(s => ({
            ...s,
            id: `sch-${crypto.randomUUID()}`
        }));

        addEvent({
            title: data.title,
            description: data.description,
            location: data.location,
            imageUrl: data.imageUrl,
            schedules: finalSchedules,
        });
        navigate('/events');
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Crear Nuevo Evento</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <EventForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/events')}
                    submitButtonText="Crear Evento"
                />
            </div>
        </div>
    );
};