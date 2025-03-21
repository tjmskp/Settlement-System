'use client';

import { useState } from 'react';
import { CreditCardIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const mockInvoices: Invoice[] = [
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

const mockPaymentMethods: PaymentMethod[] = [
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

export default function Billing() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-700 bg-green-50';
      case 'pending':
        return 'text-yellow-700 bg-yellow-50';
      case 'overdue':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Downloading invoice:', invoiceId);
    // Here you would implement the actual download functionality
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Billing & Payments</h1>

      {/* Payment Methods Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="border rounded-lg p-4 flex items-center justify-between bg-white"
            >
              <div className="flex items-center space-x-4">
                <CreditCardIcon className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {method.type} ending in {method.last4}
                  </p>
                  <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                </div>
              </div>
              {method.isDefault && (
                <span className="text-sm text-indigo-600 font-medium">Default</span>
              )}
            </div>
          ))}
          <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <span className="text-gray-600">+ Add new payment method</span>
          </button>
        </div>
      </div>

      {/* Invoices Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice History</h2>
        <div className="bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  Invoice
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="relative py-3.5 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                    <div className="font-medium text-gray-900">{invoice.id}</div>
                    <div className="text-gray-500">{invoice.description}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 