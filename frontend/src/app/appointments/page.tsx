'use client';

import { useState } from 'react';
import { CalendarIcon, ClockIcon, UserIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'in-person' | 'virtual';
  status: 'scheduled' | 'completed' | 'cancelled';
  with: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Settlement Review Meeting',
    date: '2024-03-25',
    time: '10:00 AM',
    type: 'virtual',
    status: 'scheduled',
    with: 'John Smith',
  },
  {
    id: '2',
    title: 'Document Signing',
    date: '2024-03-26',
    time: '2:30 PM',
    type: 'in-person',
    status: 'scheduled',
    with: 'Sarah Johnson',
  },
];

export default function Appointments() {
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [isBooking, setIsBooking] = useState(false);

  const handleBookAppointment = async () => {
    setIsBooking(true);
    try {
      // Here you would normally integrate with your booking system
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Appointments</h1>
            <p className="mt-2 text-sm text-gray-700">
              Schedule and manage your settlement appointments
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={handleBookAppointment}
              disabled={isBooking}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isBooking ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <div className="min-w-full divide-y divide-gray-300">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-white px-4 py-5 sm:px-6 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {appointment.type === 'virtual' ? (
                            <VideoCameraIcon className="h-6 w-6 text-gray-400" />
                          ) : (
                            <UserIcon className="h-6 w-6 text-gray-400" />
                          )}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {appointment.title}
                            </h3>
                            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="mr-1 h-4 w-4" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="mr-1 h-4 w-4" />
                                {appointment.time}
                              </div>
                              <div>with {appointment.with}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 