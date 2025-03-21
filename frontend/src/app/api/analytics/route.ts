import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface ChartData {
  label: string;
  value: number;
}

interface SettlementType {
  type: string;
  percentage: number;
  count: number;
}

interface AnalyticsData {
  stats: StatCard[];
  monthlyData: ChartData[];
  settlementTypes: SettlementType[];
  totalSettlements: number;
}

// Mock analytics data
const analyticsData: AnalyticsData = {
  stats: [
    {
      title: 'Total Settlements',
      value: '245',
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Active Clients',
      value: '1,423',
      change: '+5.2%',
      trend: 'up'
    },
    {
      title: 'Settlement Value',
      value: '$2.4M',
      change: '+18.3%',
      trend: 'up'
    },
    {
      title: 'Processing Time',
      value: '4.2 days',
      change: '-8.1%',
      trend: 'down'
    }
  ],
  monthlyData: [
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 38 },
    { label: 'Apr', value: 55 },
    { label: 'May', value: 48 },
    { label: 'Jun', value: 62 }
  ],
  settlementTypes: [
    {
      type: 'Residential',
      percentage: 45,
      count: 540
    },
    {
      type: 'Commercial',
      percentage: 30,
      count: 360
    },
    {
      type: 'Industrial',
      percentage: 25,
      count: 300
    }
  ],
  totalSettlements: 1200
};

// GET analytics data
export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const metric = searchParams.get('metric');

  // Return specific metric if requested
  if (metric === 'stats') {
    return NextResponse.json(analyticsData.stats);
  } else if (metric === 'monthly') {
    return NextResponse.json(analyticsData.monthlyData);
  } else if (metric === 'types') {
    return NextResponse.json({
      types: analyticsData.settlementTypes,
      total: analyticsData.totalSettlements
    });
  }

  // Return all analytics data
  return NextResponse.json(analyticsData);
}

// POST custom date range analytics
export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await request.json(); // We acknowledge the date range but don't use it in mock data
    
    // In a real application, you would query your database for this date range
    // For now, we'll return mock data
    return NextResponse.json({
      periodStats: {
        totalSettlements: 85,
        averageProcessingTime: '3.8 days',
        totalValue: '$850K',
        successRate: '94%'
      },
      dailyData: [
        { date: '2024-03-01', settlements: 12, value: 145000 },
        { date: '2024-03-02', settlements: 15, value: 180000 },
        { date: '2024-03-03', settlements: 8, value: 95000 }
      ]
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate custom report' },
      { status: 500 }
    );
  }
} 