import { User, Role, Event, Participant, ParticipantStatus, Schedule } from './types';

export const USERS: User[] = [
  { id: 'user-1', name: 'Admin', email: 'admin@example.com', password: 'admin', role: Role.Admin },
  { id: 'user-2', name: 'Usuario Demo', email: 'user@example.com', password: 'user', role: Role.User },
];

const generateSchedules = (): Schedule[] => [
    { id: `sch-${crypto.randomUUID()}`, startTime: '10:00 AM', endTime: '12:00 PM', paymentPerHour: 20, capacity: 25 },
    { id: `sch-${crypto.randomUUID()}`, startTime: '02:00 PM', endTime: '04:00 PM', paymentPerHour: 20, capacity: 25 },
    { id: `sch-${crypto.randomUUID()}`, startTime: '06:00 PM', endTime: '07:00 PM', paymentPerHour: 35, capacity: 20 },
];

const generateParticipants = (schedules: Schedule[], count: number): Participant[] => {
    const participants: Participant[] = [];
    for(let i=1; i <= count; i++) {
        const schedule = schedules[i % schedules.length];
        participants.push({
            id: `part-${crypto.randomUUID()}`,
            name: `Participante ${i}`,
            email: `participante${i}@email.com`,
            phone: `555-010${i}`,
            scheduleId: schedule.id,
            status: Object.values(ParticipantStatus)[i % 3],
            registrationDate: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
            notes: 'Sin notas adicionales.'
        });
    }
    return participants;
};

const schedules1 = generateSchedules();
const schedules3 = generateSchedules();


export const EVENTS: Event[] = [
  {
    id: 'event-1',
    publicToken: crypto.randomUUID(),
    title: 'Conferencia Anual de Tecnología',
    description: 'Un evento para explorar las últimas tendencias en desarrollo de software, IA y computación en la nube.',
    location: 'Centro de Convenciones Metropolitano',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
    schedules: schedules1,
    participants: generateParticipants(schedules1, 30),
    creatorId: 'user-1', // Admin
  },
  {
    id: 'event-3',
    publicToken: crypto.randomUUID(),
    title: 'Meetup de React Avanzado',
    description: 'Una reunión para desarrolladores de React para discutir patrones avanzados y gestión de estado.',
    location: 'Oficinas de Tech Solutions, Piso 12',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    schedules: schedules3,
    participants: generateParticipants(schedules3, 45),
    creatorId: 'user-2', // User
  },
];