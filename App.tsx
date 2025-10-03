import React, { useState, createContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Event, Role, Notification } from './types';
import { USERS, EVENTS } from './constants';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './components/dashboard/Dashboard';
import { EventList } from './components/events/EventList';
import { ParticipantManager } from './components/participants/ParticipantManager';
import { CreateEvent } from './components/events/CreateEvent';
import { EditEvent } from './components/events/EditEvent';
import { PublicEventPage } from './components/events/PublicEventPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { NotificationsPage } from './components/notifications/NotificationsPage';

interface IAppContext {
  currentUser: User | null;
  users: User[];
  events: Event[];
  notifications: Notification[];
  login: (email: string, password_sent: string) => User;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'role'>) => User;
  updateEvent: (updatedEvent: Event) => void;
  addEvent: (eventData: Omit<Event, 'id' | 'publicToken' | 'participants' | 'creatorId'>) => Event;
  removeEvent: (eventId: string) => void;
  addUser: (userData: Omit<User, 'id'>) => User;
  updateUser: (updatedUser: User) => void;
  removeUser: (userId: string) => void;
  addNotification: (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
}

export const AppContext = createContext<IAppContext>({} as IAppContext);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : USERS;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('events');
    const initialEvents = savedEvents ? JSON.parse(savedEvents) : EVENTS;
    return initialEvents.map((e: Event) => ({ ...e, publicToken: e.publicToken || crypto.randomUUID() }));
  });
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const login = (email: string, password_sent: string): User => {
    const user = users.find(u => u.email === email && u.password === password_sent);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    throw new Error('Credenciales inválidas');
  };

  const logout = () => { setCurrentUser(null); };

  const register = (userData: Omit<User, 'id' | 'role'>) => {
    if (users.some(u => u.email === userData.email)) {
      throw new Error('El email ya está registrado.');
    }
    const newUser = addUser({ ...userData, role: Role.User });
    
    // Notify admins of new user registration
    const admins = users.filter(u => u.role === Role.Admin);
    admins.forEach(admin => {
        addNotification({
            userId: admin.id,
            message: `Nuevo usuario registrado: ${newUser.name} (${newUser.email}).`,
            type: 'info',
        });
    });

    return newUser;
  };

  const updateEvent = (updatedEvent: Event) => {
    const oldEvent = events.find(e => e.id === updatedEvent.id);
    if (oldEvent && oldEvent.participants.length < updatedEvent.participants.length) {
        const newParticipant = updatedEvent.participants.find(p => !oldEvent.participants.some(op => op.id === p.id));
        if (newParticipant) {
             addNotification({
                userId: updatedEvent.creatorId,
                message: `${newParticipant.name} se registró en tu evento: "${updatedEvent.title}".`,
                type: 'success',
            });
        }
        
        const totalCapacity = updatedEvent.schedules.reduce((acc, s) => acc + s.capacity, 0);
        const confirmedParticipants = updatedEvent.participants.filter(p => p.status === 'CONFIRMADO').length;
        if (confirmedParticipants >= totalCapacity && oldEvent.participants.filter(p => p.status === 'CONFIRMADO').length < totalCapacity) {
             addNotification({
                userId: updatedEvent.creatorId,
                message: `¡Tu evento "${updatedEvent.title}" ha alcanzado su capacidad máxima!`,
                type: 'info',
            });
        }
    }
    setEvents(prevEvents => prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'publicToken' | 'participants' | 'creatorId'>) => {
    if (!currentUser) throw new Error("User must be logged in to create an event.");
    const newEvent: Event = {
      ...eventData,
      id: `evt-${crypto.randomUUID()}`,
      publicToken: crypto.randomUUID(),
      participants: [],
      creatorId: currentUser.id,
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
    
    const admins = users.filter(u => u.role === Role.Admin);
    admins.forEach(admin => {
        addNotification({
            userId: admin.id,
            message: `Nuevo evento creado por ${currentUser.name}: "${newEvent.title}".`,
            type: 'info',
        });
    });
    return newEvent;
  };
  
  const removeEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };
  
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = { ...userData, id: `user-${crypto.randomUUID()}` };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };
  
  const contextValue = {
    currentUser, users, events, notifications,
    login, logout, register, updateEvent, addEvent, removeEvent,
    addUser, updateUser, removeUser, addNotification,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event/public/:publicToken" element={<PublicEventPage />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="events" element={<EventList />} />
            <Route path="event/:eventId/manage" element={<ParticipantManager />} />
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="event/:eventId/edit" element={<EditEvent />} />
            <Route path="users" element={<AdminPanel />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="stats" element={<div>Estadísticas (Próximamente)</div>} />
            <Route path="settings" element={<div>Configuración (Próximamente)</div>} />
          </Route>
           <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} replace />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
