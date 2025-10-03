import React, { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { Event, Role } from '../../types';
import { Edit, Trash2, Users, Share2, MapPin } from '../ui/Icons';
import { Modal } from '../ui/Modal';

const EventCard: React.FC<{ event: Event; onDelete: (event: Event) => void; }> = ({ event, onDelete }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AppContext);
  const totalParticipants = event.participants.length;
  const totalCapacity = event.schedules.reduce((acc, s) => acc + s.capacity, 0);

  const handleShare = () => {
      const shareUrl = `${window.location.origin}${window.location.pathname}#/event/public/${event.publicToken}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
          alert('¡Enlace para compartir copiado al portapapeles!');
      }, (err) => {
          console.error('No se pudo copiar el enlace: ', err);
          alert('No se pudo copiar el enlace.');
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <img src={event.imageUrl || `https://placehold.co/600x400/FFFFFF/000000?text=${encodeURIComponent(event.title)}`} alt={event.title} className="w-full h-40 object-cover rounded-t-lg" />
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm line-clamp-2 h-[40px]">{event.description}</p>
        
        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">{totalParticipants}</span> Inscritos</p>
            </div>
             <div>
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">{totalCapacity}</span> Cupos</p>
            </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex justify-end items-center space-x-2 rounded-b-lg">
          <button onClick={handleShare} title="Compartir Evento" className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors">
              <Share2 className="w-5 h-5" />
          </button>
          <button onClick={() => navigate(`/event/${event.id}/manage`)} title="Gestionar Participantes" className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <Users className="w-5 h-5" />
          </button>
          {(currentUser?.role === Role.Admin || currentUser?.id === event.creatorId) && (
            <>
              <button onClick={() => navigate(`/event/${event.id}/edit`)} title="Editar Evento" className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors">
                  <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => onDelete(event)} title="Eliminar Evento" className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
                  <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
      </div>
    </div>
  );
};


export const EventList: React.FC = () => {
    const { events, currentUser, removeEvent } = useContext(AppContext);
    const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

    const userEvents = useMemo(() => {
        if (!currentUser) return [];
        if (currentUser.role === Role.Admin) return events;
        return events.filter(event => event.creatorId === currentUser.id);
    }, [events, currentUser]);
    
    const handleDeleteConfirm = () => {
        if(deletingEvent) {
            removeEvent(deletingEvent.id);
            setDeletingEvent(null);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentUser?.role === Role.Admin ? 'Todos los Eventos' : 'Mis Eventos'}
                </h1>
                <Link to="/create-event" className="inline-flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Crear Evento
                </Link>
            </div>
            {userEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userEvents.map(event => (
                        <EventCard key={event.id} event={event} onDelete={setDeletingEvent} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No has creado ningún evento todavía.</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">¡Empieza creando tu primer evento ahora!</p>
                    <Link to="/create-event" className="mt-6 inline-flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Crear mi primer evento
                    </Link>
                </div>
            )}
            
            <Modal isOpen={!!deletingEvent} onClose={() => setDeletingEvent(null)} title="Confirmar Eliminación" size="sm">
                <div>
                    <p className="text-gray-600 dark:text-gray-300">
                        ¿Estás seguro de que deseas eliminar el evento <strong className="font-semibold">{deletingEvent?.title}</strong>? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setDeletingEvent(null)} className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            Cancelar
                        </button>
                        <button onClick={handleDeleteConfirm} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-red-900">
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};