import React, { useState, useEffect } from 'react';
import { Participant, Schedule, ParticipantStatus } from '../../types';

interface ParticipantFormProps {
  participant?: Participant | null;
  schedules: Schedule[];
  onSubmit: (participant: Omit<Participant, 'id' | 'registrationDate'>) => void;
  onClose: () => void;
}

export const ParticipantForm: React.FC<ParticipantFormProps> = ({ participant, schedules, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    scheduleId: '',
    status: ParticipantStatus.Confirmed, // Default to Confirmed
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        scheduleId: participant.scheduleId,
        status: participant.status,
        notes: participant.notes || '',
      });
    } else {
        // Set default schedule if available
        if(schedules.length > 0) {
            setFormData(prev => ({...prev, scheduleId: schedules[0].id}));
        }
    }
  }, [participant, schedules]);

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido.';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El email no es válido.';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido.';
    if (!formData.scheduleId) newErrors.scheduleId = 'Debe seleccionar un horario.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre Completo</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>
       <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Teléfono</label>
        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={!participant ? 'col-span-2' : ''}>
            <label htmlFor="scheduleId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Horario</label>
            <select name="scheduleId" id="scheduleId" value={formData.scheduleId} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                <option value="">Seleccionar...</option>
                {schedules.map(s => <option key={s.id} value={s.id}>{s.startTime} - {s.endTime}</option>)}
            </select>
             {errors.scheduleId && <p className="mt-1 text-xs text-red-500">{errors.scheduleId}</p>}
        </div>
        {participant && (
            <div>
                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                    {Object.values(ParticipantStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        )}
      </div>
      <div>
        <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notas</label>
        <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            Cancelar
        </button>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          {participant ? 'Actualizar' : 'Agregar'} Participante
        </button>
      </div>
    </form>
  );
};