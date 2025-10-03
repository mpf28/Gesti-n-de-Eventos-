import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event, Schedule } from '../../types';
import { PlusCircle, Trash2 } from '../ui/Icons';

type ScheduleFormData = Omit<Schedule, 'id'> & { id?: string };

export interface EventFormData {
    title: string;
    description: string;
    location: string;
    imageUrl: string;
    schedules: ScheduleFormData[];
}

interface EventFormProps {
    event?: Event;
    onSubmit: (data: EventFormData) => void;
    onCancel: () => void;
    submitButtonText: string;
}

export const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, onCancel, submitButtonText }) => {
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        location: '',
        imageUrl: '',
        schedules: [{ startTime: '10:00', endTime: '12:00', paymentPerHour: 25, capacity: 50 }],
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                location: event.location,
                imageUrl: event.imageUrl || '',
                schedules: event.schedules,
            });
        }
    }, [event]);

    const handleScheduleChange = (index: number, field: keyof ScheduleFormData, value: string | number) => {
        const newSchedules = [...formData.schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setFormData(prev => ({ ...prev, schedules: newSchedules }));
    };

    const addSchedule = () => {
        setFormData(prev => ({
            ...prev,
            schedules: [...prev.schedules, { startTime: '12:00', endTime: '14:00', paymentPerHour: 25, capacity: 50 }]
        }));
    };

    const removeSchedule = (index: number) => {
        if (formData.schedules.length > 1) {
            setFormData(prev => ({
                ...prev,
                schedules: prev.schedules.filter((_, i) => i !== index)
            }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.title.trim()) newErrors.title = 'El título es requerido.';
        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida.';
        if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida.';
        formData.schedules.forEach((s, i) => {
            if (!s.startTime) newErrors[`schedule_start_${i}`] = 'La hora de inicio es requerida.';
            if (!s.endTime) newErrors[`schedule_end_${i}`] = 'La hora de fin es requerida.';
            if (s.capacity <= 0) newErrors[`schedule_capacity_${i}`] = 'La capacidad debe ser mayor a 0.';
            if (s.paymentPerHour < 0) newErrors[`schedule_payment_${i}`] = 'El costo no puede ser negativo.';
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Título del Evento</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>
            <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>
             <div>
                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ubicación del Evento</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder={'Ej: Av. Principal 123, Ciudad'} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
            </div>
             <div>
                <label htmlFor="imageUrl" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL de la Imagen de Portada</label>
                <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>

            <div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Horarios</h3>
                <div className="space-y-4">
                    {formData.schedules.map((schedule, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border dark:border-gray-700 rounded-lg">
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor={`startTime-${index}`} className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Hora Inicio</label>
                                    <input type="time" id={`startTime-${index}`} value={schedule.startTime} onChange={e => handleScheduleChange(index, 'startTime', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    {errors[`schedule_start_${index}`] && <p className="mt-1 text-xs text-red-500">{errors[`schedule_start_${index}`]}</p>}
                                </div>
                                <div>
                                    <label htmlFor={`endTime-${index}`} className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Hora Fin</label>
                                    <input type="time" id={`endTime-${index}`} value={schedule.endTime} onChange={e => handleScheduleChange(index, 'endTime', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    {errors[`schedule_end_${index}`] && <p className="mt-1 text-xs text-red-500">{errors[`schedule_end_${index}`]}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor={`payment-${index}`} className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Costo/hr ($)</label>
                                    <input type="number" id={`payment-${index}`} value={schedule.paymentPerHour} onChange={e => handleScheduleChange(index, 'paymentPerHour', parseFloat(e.target.value) || 0)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    {errors[`schedule_payment_${index}`] && <p className="mt-1 text-xs text-red-500">{errors[`schedule_payment_${index}`]}</p>}
                                </div>
                                <div>
                                    <label htmlFor={`capacity-${index}`} className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Capacidad</label>
                                    <input type="number" id={`capacity-${index}`} value={schedule.capacity} onChange={e => handleScheduleChange(index, 'capacity', parseInt(e.target.value, 10) || 0)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    {errors[`schedule_capacity_${index}`] && <p className="mt-1 text-xs text-red-500">{errors[`schedule_capacity_${index}`]}</p>}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={() => removeSchedule(index)} disabled={formData.schedules.length <= 1} className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Eliminar horario">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                 <button type="button" onClick={addSchedule} className="mt-4 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Añadir Horario
                </button>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700 mt-6">
                <button type="button" onClick={onCancel} className="py-2 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700">{submitButtonText}</button>
            </div>
        </form>
    );
};