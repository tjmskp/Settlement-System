import { useState, useCallback } from 'react';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '@/lib/api';

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'virtual' | 'in-person';
  status: 'scheduled' | 'pending' | 'cancelled';
  with: string;
}

interface AppointmentsState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

export function useAppointments() {
  const [state, setState] = useState<AppointmentsState>({
    appointments: [] as Appointment[],
    loading: true,
    error: null
  });

  const fetchAppointments = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const response = await getAppointments();

    if (response.data) {
      setState({
        appointments: response.data as Appointment[],
        loading: false,
        error: null
      });
    } else {
      setState({
        appointments: [] as Appointment[],
        loading: false,
        error: response.error
      });
    }
  }, []);

  const handleCreate = async (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await createAppointment(appointmentData);

    if (response.data) {
      setState(prevState => ({
        appointments: [...prevState.appointments, response.data as Appointment],
        loading: false,
        error: null
      }));
      return true;
    } else {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: response.error
      }));
      return false;
    }
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<Appointment, 'id'>>
  ) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await updateAppointment(id, data);

    if (response.data) {
      setState(prevState => ({
        appointments: prevState.appointments.map(apt =>
          apt.id === id ? { ...apt, ...response.data as Appointment } : apt
        ),
        loading: false,
        error: null
      }));
      return true;
    } else {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: response.error
      }));
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    setState(prevState => ({ ...prevState, loading: true }));

    const response = await deleteAppointment(id);

    if (response.error === null) {
      setState(prevState => ({
        appointments: prevState.appointments.filter(apt => apt.id !== id),
        loading: false,
        error: null
      }));
      return true;
    } else {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: response.error
      }));
      return false;
    }
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return state.appointments
      .filter(apt => {
        const aptDate = new Date(`${apt.date} ${apt.time}`);
        return aptDate > now && apt.status !== 'cancelled';
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
  };

  const getAppointmentById = (id: string) => {
    return state.appointments.find(apt => apt.id === id);
  };

  return {
    ...state,
    fetchAppointments,
    createAppointment: handleCreate,
    updateAppointment: handleUpdate,
    deleteAppointment: handleDelete,
    getUpcomingAppointments,
    getAppointmentById
  };
} 