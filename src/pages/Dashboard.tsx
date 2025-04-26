
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Book, Tag, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock statistics
  const stats = [
    { label: 'Menu Items', value: 24 },
    { label: 'Categories', value: 6 },
    { label: 'Featured Items', value: 4 },
  ];

  const quickLinks = [
    { 
      title: 'Manage Menu Items', 
      description: 'Add, edit or remove items from your menu',
      icon: Book,
      path: '/menu-items',
      color: 'bg-blue-100 text-blue-700'
    },
    { 
      title: 'Manage Categories', 
      description: 'Organize your menu with categories',
      icon: Tag,
      path: '/categories',
      color: 'bg-purple-100 text-purple-700'
    },
    { 
      title: 'Profile Settings', 
      description: 'Update your restaurant profile',
      icon: Settings,
      path: '/profile',
      color: 'bg-green-100 text-green-700'
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Manage your restaurant menu and delight your customers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="dashboard-stat-card">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-menu-purple">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link, index) => (
          <Card key={index} className="border-t-4 border-menu-purple">
            <CardHeader>
              <div className={`w-10 h-10 rounded-full ${link.color} flex items-center justify-center mb-3`}>
                <link.icon size={20} />
              </div>
              <CardTitle className="text-lg">{link.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">{link.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline"
                className="w-full border-menu-purple text-menu-purple hover:bg-menu-light-purple"
                onClick={() => navigate(link.path)}
              >
                Go to {link.title.split(' ')[1]}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
