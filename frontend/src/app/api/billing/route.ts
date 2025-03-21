import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

// Mock payment methods database
const paymentMethods: PaymentMethod[] = [
  {
    id: 'card-1',
    type: 'Visa',
    last4: '4242',
    expiry: '12/25',
    isDefault: true
  },
  {
    id: 'card-2',
    type: 'Mastercard',
    last4: '8888',
    expiry: '09/24',
    isDefault: false
  }
];

// Mock invoices database
const invoices: Invoice[] = [
  {
    id: 'INV-001',
    date: '2024-03-15',
    amount: 1500.00,
    status: 'paid',
    description: 'Settlement Processing Fee'
  },
  {
    id: 'INV-002',
    date: '2024-03-01',
    amount: 750.00,
    status: 'paid',
    description: 'Document Review Service'
  },
  {
    id: 'INV-003',
    date: '2024-02-15',
    amount: 2000.00,
    status: 'pending',
    description: 'Legal Consultation Fee'
  }
];

// GET payment methods and invoices
export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'payment-methods') {
    return NextResponse.json(paymentMethods);
  } else if (type === 'invoices') {
    return NextResponse.json(invoices);
  }

  return NextResponse.json({
    paymentMethods,
    invoices
  });
}

// POST new payment method
export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newPaymentMethod: PaymentMethod = {
      id: `card-${paymentMethods.length + 1}`,
      type: data.type,
      last4: data.last4,
      expiry: data.expiry,
      isDefault: data.isDefault || false
    };

    if (newPaymentMethod.isDefault) {
      // Update other payment methods to non-default
      paymentMethods.forEach(pm => {
        pm.isDefault = false;
      });
    }

    paymentMethods.push(newPaymentMethod);
    return NextResponse.json(newPaymentMethod, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to add payment method' },
      { status: 500 }
    );
  }
}

// PUT update payment method
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
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    const paymentMethod = paymentMethods.find(pm => pm.id === id);
    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    if (data.isDefault) {
      // Update other payment methods to non-default
      paymentMethods.forEach(pm => {
        pm.isDefault = pm.id === id;
      });
    }

    Object.assign(paymentMethod, data);
    return NextResponse.json(paymentMethod);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update payment method' },
      { status: 500 }
    );
  }
}

// DELETE payment method
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
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    const paymentMethodIndex = paymentMethods.findIndex(pm => pm.id === id);
    if (paymentMethodIndex === -1) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    if (paymentMethods[paymentMethodIndex].isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete default payment method' },
        { status: 400 }
      );
    }

    paymentMethods.splice(paymentMethodIndex, 1);
    return NextResponse.json({ message: 'Payment method deleted' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
} 