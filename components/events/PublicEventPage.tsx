import React, { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../App';
import { ParticipantStatus } from '../../types';
import { MapPin } from '../ui/Icons';

export const PublicEventPage: React.FC = () => {
    const { publicToken } = useParams<{ publicToken: string }>();
    const { events, updateEvent } = useContext(AppContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const event = useMemo(() => events.find(e => e.publicToken === publicToken), [events, publicToken]);

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Evento no encontrado</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">El enlace puede ser incorrecto o el evento ha sido eliminado.</p>
                </div>
            </div>
        );
    }

    const handleRsvp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!name.trim() || !email.trim() || !selectedSchedule) {
            setError('Por favor, completa tu nombre, email y selecciona un horario.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('El formato del email no es válido.');
            return;
        }

        const newParticipant = {
            id: `part-${crypto.randomUUID()}`,
            name,
            email,
            phone,
            scheduleId: selectedSchedule,
            status: ParticipantStatus.Confirmed,
            registrationDate: new Date().toISOString(),
        };

        const updatedEvent = {
            ...event,
            participants: [...event.participants, newParticipant],
        };

        updateEvent(updatedEvent);
        setSuccessMessage(`¡Gracias por registrarte, ${name}! Tu asistencia ha sido confirmada.`);
        setName('');
        setEmail('');
        setPhone('');
        setSelectedSchedule('');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover"/>}
                <div className="p-8">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                         <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{event.title}</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{event.description}</p>
                </div>
                
                <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50">
                    {successMessage ? (
                         <div className="text-center p-8 bg-green-50 dark:bg-green-900/50 rounded-lg">
                            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-300">¡Registro Exitoso!</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">{successMessage}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleRsvp} className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Confirma tu asistencia</h2>
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
                                <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono (Opcional)</label>
                                    <input type="tel" name="phone" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selecciona un horario</label>
                                <select id="schedule" name="schedule" value={selectedSchedule} onChange={e => setSelectedSchedule(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                    <option value="" disabled>Elige una opción...</option>
                                    {event.schedules.map(s => {
                                        const registered = event.participants.filter(p => p.scheduleId === s.id && p.status === ParticipantStatus.Confirmed).length;
                                        const remaining = s.capacity - registered;
                                        return <option key={s.id} value={s.id} disabled={remaining <= 0}>
                                            {s.startTime} - {s.endTime} (${s.paymentPerHour}/hr) - {remaining > 0 ? `${remaining} cupos restantes` : 'Agotado'}
                                        </option>
                                    })}
                                </select>
                            </div>
                             {error && <p className="text-sm text-red-500">{error}</p>}
                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Registrarme
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};