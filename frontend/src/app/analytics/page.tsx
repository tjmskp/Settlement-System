'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

interface ChartData {
  label: string;
  value: number;
}

const mockStats: StatCard[] = [
  {
    title: 'Total Settlements',
    value: '245',
    change: '+12.5%',
    trend: 'up',
    icon: DocumentTextIcon
  },
  {
    title: 'Active Clients',
    value: '1,423',
    change: '+5.2%',
    trend: 'up',
    icon: UserGroupIcon
  },
  {
    title: 'Settlement Value',
    value: '$2.4M',
    change: '+18.3%',
    trend: 'up',
    icon: CurrencyDollarIcon
  },
  {
    title: 'Processing Time',
    value: '4.2 days',
    change: '-8.1%',
    trend: 'down',
    icon: ChartBarIcon
  }
];

const mockMonthlyData: ChartData[] = [
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 38 },
  { label: 'Apr', value: 55 },
  { label: 'May', value: 48 },
  { label: 'Jun', value: 62 }
];

export default function Analytics() {
  const [stats] = useState<StatCard[]>(mockStats);
  const [monthlyData] = useState<ChartData[]>(mockMonthlyData);

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Analytics Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-4 w-full">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 truncate">{stat.title}</p>
                  <div
                    className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      stat.trend === 'up'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
                <p className="mt-1 text-xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Settlements Chart */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Settlements</h3>
          <div className="h-64 flex items-end space-x-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-indigo-600 rounded-t"
                  style={{
                    height: `${(data.value / maxValue) * 200}px`
                  }}
                />
                <div className="text-sm text-gray-600 mt-2">{data.label}</div>
                <div className="text-xs font-medium text-gray-900">{data.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Settlement Types Distribution */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Settlement Types</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Residential</span>
                  <span className="text-sm font-medium text-gray-900">45%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Commercial</span>
                  <span className="text-sm font-medium text-gray-900">30%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Industrial</span>
                  <span className="text-sm font-medium text-gray-900">25%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-indigo-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">1.2K</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 