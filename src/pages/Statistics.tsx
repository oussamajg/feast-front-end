
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CalendarDays, DollarSign, TrendingUp, Users } from 'lucide-react';

// Fake data for charts
const topSellingDishes = [
  { name: 'Margherita Pizza', sold: 145 },
  { name: 'Classic Burger', sold: 120 },
  { name: 'Caesar Salad', sold: 95 },
  { name: 'Pasta Carbonara', sold: 85 },
  { name: 'Greek Salad', sold: 75 },
];

const ordersByDay = [
  { date: '2024-04-21', orders: 24 },
  { date: '2024-04-22', orders: 32 },
  { date: '2024-04-23', orders: 28 },
  { date: '2024-04-24', orders: 36 },
  { date: '2024-04-25', orders: 45 },
  { date: '2024-04-26', orders: 52 },
  { date: '2024-04-27', orders: 48 },
];

const ordersByCategory = [
  { name: 'Pizza', value: 35 },
  { name: 'Burger', value: 25 },
  { name: 'Salad', value: 20 },
  { name: 'Pasta', value: 15 },
  { name: 'Dessert', value: 5 },
];

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

const Statistics = () => {
  // Mock statistics
  const totalEarnings = 52849.99;
  const statistics = [
    { 
      label: 'Today\'s Orders',
      value: '48',
      icon: CalendarDays,
      description: '+12.5% from yesterday'
    },
    {
      label: 'This Week',
      value: '285',
      icon: TrendingUp,
      description: '+5.2% from last week'
    },
    {
      label: 'This Month',
      value: '1,247',
      icon: Users,
      description: '+8.1% from last month'
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(totalEarnings),
      icon: DollarSign,
      description: '+15.3% from last month'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Top Selling Dishes - Bar Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Top Selling Dishes</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="h-[300px]"
                config={{
                  value: { theme: { light: '#8b5cf6', dark: '#a78bfa' } },
                }}
              >
                <BarChart data={topSellingDishes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload) return null;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Dish
                              </span>
                              <span className="font-bold">
                                {payload[0]?.payload.name}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Sales
                              </span>
                              <span className="font-bold">
                                {payload[0]?.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="sold" fill="var(--color-value)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Orders by Category - Pie Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Orders by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                className="h-[300px]" 
                config={{
                  value: { theme: { light: '#8b5cf6', dark: '#a78bfa' } },
                }}
              >
                <PieChart>
                  <Pie
                    data={ordersByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ordersByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload) return null;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Category
                              </span>
                              <span className="font-bold">
                                {payload[0]?.name}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Orders
                              </span>
                              <span className="font-bold">
                                {payload[0]?.value}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Orders Over Time - Line Chart */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="h-[300px]"
                config={{
                  value: { theme: { light: '#8b5cf6', dark: '#a78bfa' } },
                }}
              >
                <LineChart data={ordersByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload) return null;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Date
                              </span>
                              <span className="font-bold">
                                {payload[0]?.payload.date}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Orders
                              </span>
                              <span className="font-bold">
                                {payload[0]?.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="var(--color-value)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
