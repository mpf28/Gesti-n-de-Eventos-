import React, { useState, useMemo, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { Participant, Event, Schedule, ParticipantStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { ParticipantForm } from './ParticipantForm';
import { PlusCircle, Download, Edit, Trash2 } from '../ui/Icons';

const statusColors: { [key in ParticipantStatus]: string } = {
  [ParticipantStatus.Confirmed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [ParticipantStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [ParticipantStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const StatCard: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
);

const ParticipantRow: React.FC<{ participant: Participant; scheduleTime: string; onEdit: (p: Participant) => void; onDelete: (p: Participant) => void; }> = ({ participant, scheduleTime, onEdit, onDelete }) => (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{participant.name}</td>
        <td className="px-6 py-4">{participant.email}</td>
        <td className="px-6 py-4">{scheduleTime}</td>
        <td className="px-6 py-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[participant.status]}`}>
                {participant.status}
            </span>
        </td>
        <td className="px-6 py-4 text-right space-x-2">
            <button onClick={() => onEdit(participant)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"><Edit className="w-5 h-5 inline" /></button>
            <button onClick={() => onDelete(participant)} className="font-medium text-red-600 dark:text-red-500 hover:underline"><Trash2 className="w-5 h-5 inline" /></button>
        </td>
    </tr>
);

export const ParticipantManager: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const { events, updateEvent } = useContext(AppContext);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
    const [deletingParticipant, setDeletingParticipant] = useState<Participant | null>(null);
    const [filterSchedule, setFilterSchedule] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const event = useMemo(() => events.find(e => e.id === eventId), [events, eventId]);

    const filteredParticipants = useMemo(() => {
        if (!event) return [];
        return event.participants.filter(p => {
            const scheduleMatch = filterSchedule === 'all' || p.scheduleId === filterSchedule;
            const statusMatch = filterStatus === 'all' || p.status === filterStatus;
            return scheduleMatch && statusMatch;
        });
    }, [event, filterSchedule, filterStatus]);

    if (!event) {
        return <div className="p-8 text-center text-gray-500">Evento no encontrado. <Link to="/" className="text-blue-500">Volver al inicio.</Link></div>;
    }

    const totalCapacity = event.schedules.reduce((acc, s) => acc + s.capacity, 0);
    const totalConfirmedParticipants = event.participants.filter(p => p.status === ParticipantStatus.Confirmed).length;
    const occupancy = totalCapacity > 0 ? ((totalConfirmedParticipants / totalCapacity) * 100).toFixed(1) : 0;
    const isEventFull = totalConfirmedParticipants >= totalCapacity;

    const handleOpenModal = (participant: Participant | null = null) => {
        setEditingParticipant(participant);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingParticipant(null);
    };

    const handleFormSubmit = (participantData: Omit<Participant, 'id' | 'registrationDate'>) => {
        let updatedParticipants: Participant[];
        if (editingParticipant) {
            updatedParticipants = event.participants.map(p =>
                p.id === editingParticipant.id ? { ...editingParticipant, ...participantData } : p
            );
        } else {
             if (isEventFull && participantData.status === ParticipantStatus.Confirmed) {
                alert("No se puede agregar al participante confirmado. El evento ha alcanzado su capacidad máxima.");
                return;
            }
            const newParticipant: Participant = {
                ...participantData,
                id: `part-${Date.now()}`,
                registrationDate: new Date().toISOString(),
            };
            updatedParticipants = [...event.participants, newParticipant];
        }
        updateEvent({ ...event, participants: updatedParticipants });
        handleCloseModal();
    };

    const handleDelete = (participant: Participant) => {
        const updatedParticipants = event.participants.filter(p => p.id !== participant.id);
        updateEvent({ ...event, participants: updatedParticipants });
        setDeletingParticipant(null);
    };
    
    const exportToCSV = () => {
        const headers = ["Nombre", "Email", "Teléfono", "Horario", "Estado", "Notas", "Fecha de Registro"];
        const rows = filteredParticipants.map(p => {
            const schedule = event.schedules.find(s => s.id === p.scheduleId);
            return [
                p.name,
                p.email,
                p.phone,
                schedule ? `${schedule.startTime} - ${schedule.endTime}` : 'N/A',
                p.status,
                p.notes || '',
                new Date(p.registrationDate).toLocaleString()
            ].map(val => `"${val.replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${event.title.replace(/\s/g, '_')}_participantes.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Gestión de Participantes</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Inscritos" value={totalConfirmedParticipants} description="Participantes confirmados" />
                <StatCard title="Capacidad Total" value={totalCapacity} description="Cupos disponibles en todos los horarios" />
                <StatCard title="Ocupación" value={`${occupancy}%`} description="Porcentaje de cupos llenos" />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                         <select onChange={(e) => setFilterSchedule(e.target.value)} value={filterSchedule} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="all">Todos los Horarios</option>
                            {event.schedules.map(s => <option key={s.id} value={s.id}>{s.startTime} - {s.endTime}</option>)}
                        </select>
                         <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="all">Todos los Estados</option>
                            {Object.values(ParticipantStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:items-center md:space-x-3">
                        <button onClick={exportToCSV} className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </button>
                        <button 
                            onClick={() => handleOpenModal()} 
                            disabled={isEventFull}
                            title={isEventFull ? 'El evento ha alcanzado su capacidad máxima' : 'Agregar nuevo participante'}
                            className="w-full md:w-auto flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Agregar Participante
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Horario</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Editar</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParticipants.map(p => {
                            const schedule = event.schedules.find(s => s.id === p.scheduleId);
                            return <ParticipantRow key={p.id} participant={p} scheduleTime={schedule ? `${schedule.startTime} - ${schedule.endTime}` : 'N/A'} onEdit={handleOpenModal} onDelete={setDeletingParticipant} />;
                        })}
                         {filteredParticipants.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No hay participantes que coincidan con los filtros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingParticipant ? 'Editar Participante' : 'Agregar Participante'}>
                <ParticipantForm
                    participant={editingParticipant}
                    schedules={event.schedules}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                />
            </Modal>
            
            <Modal isOpen={!!deletingParticipant} onClose={() => setDeletingParticipant(null)} title="Confirmar Eliminación" size="sm">
                <div>
                    <p className="text-gray-600 dark:text-gray-300">
                        ¿Estás seguro de que deseas eliminar a <strong className="font-semibold">{deletingParticipant?.name}</strong>? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setDeletingParticipant(null)} className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            Cancelar
                        </button>
                        <button onClick={() => deletingParticipant && handleDelete(deletingParticipant)} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-red-900">
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};