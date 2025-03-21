import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Mock appointments database
let appointments = [
  {
    id: '1',
    title: 'Settlement Review Meeting',
    date: '2024-03-25',
    time: '10:00 AM',
    type: 'virtual',
    status: 'scheduled',
    with: 'John Smith',
    userId: '1'
  },
  {
    id: '2',
    title: 'Document Signing',
    date: '2024-03-26',
    time: '2:30 PM',
    type: 'in-person',
    status: 'pending',
    with: 'Sarah Johnson',
    userId: '1'
  }
];

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newAppointment = {
      id: String(appointments.length + 1),
      title: data.title,
      date: data.date,
      time: data.time,
      type: data.type,
      status: 'pending',
      with: data.with,
      userId: '1' // In a real app, this would come from the session
    };

    appointments.push(newAppointment);
    return NextResponse.json(newAppointment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const appointmentIndex = appointments.findIndex(apt => apt.id === id);
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...data,
      id // Preserve the original ID
    };

    return NextResponse.json(appointments[appointmentIndex]);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const appointmentIndex = appointments.findIndex(apt => apt.id === id);
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    appointments = appointments.filter(apt => apt.id !== id);
    return NextResponse.json({ message: 'Appointment deleted' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
} 