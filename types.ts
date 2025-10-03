export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Not used in frontend logic, but part of model
  role: Role;
}

export enum ParticipantStatus {
  Confirmed = 'CONFIRMADO',
  Pending = 'PENDIENTE',
  Cancelled = 'CANCELADO',
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  scheduleId: string;
  status: ParticipantStatus;
  notes?: string;
  registrationDate: string;
}

export interface Schedule {
  id: string;
  startTime: string;
  endTime: string;
  paymentPerHour: number;
  capacity: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
  schedules: Schedule[];
  participants: Participant[];
  creatorId: string;
  publicToken: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  isRead?: boolean;
}