import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Search, Download, Users, Calendar, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface EmailSubscriber {
  id: string;
  email: string;
  source: string;
  metadata?: any;
  created_at: string;
}

export const EmailSubscribers = () => {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<EmailSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = subscribers.filter(subscriber =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscriber.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubscribers(filtered);
    } else {
      setFilteredSubscribers(subscribers);
    }
  }, [searchTerm, subscribers]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching email subscribers:', error);
        toast({
          title: "Error",
          description: "Failed to fetch email subscribers",
          variant: "destructive",
        });
        return;
      }

      setSubscribers(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvData = filteredSubscribers.map(subscriber => ({
      Email: subscriber.email,
      Source: subscriber.source,
      'Sign Up Date': format(new Date(subscriber.created_at), 'MM/dd/yyyy HH:mm'),
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `email-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'protected_interaction':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'email_capture':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'popup':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source.toLowerCase()) {
      case 'protected_interaction':
        return 'Protected Action';
      case 'email_capture':
        return 'Email Capture';
      case 'popup':
        return 'Popup Form';
      default:
        return source;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Email Subscribers</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Email Subscribers</h2>
          <p className="text-muted-foreground">
            Manage users who signed up through popup forms and email capture
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Website
          </Button>
          <Button onClick={exportToCSV} disabled={filteredSubscribers.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground">
              All time subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscribers.filter(s => 
                new Date(s.created_at).getMonth() === new Date().getMonth() &&
                new Date(s.created_at).getFullYear() === new Date().getFullYear()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              New subscribers this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Sources</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(subscribers.map(s => s.source)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Different sign-up sources
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Subscribers ({filteredSubscribers.length})</CardTitle>
          <CardDescription>
            Users who submitted their email through various forms on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Sign Up Date</TableHead>
                  <TableHead>Metadata</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No subscribers found matching your search.' : 'No email subscribers yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{subscriber.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSourceBadgeColor(subscriber.source)}>
                          {getSourceLabel(subscriber.source)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(subscriber.created_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(subscriber.created_at), 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {subscriber.metadata ? (
                          <div className="text-xs text-muted-foreground">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(subscriber.metadata, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};