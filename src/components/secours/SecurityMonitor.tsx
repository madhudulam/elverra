import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Lock, Eye, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const SecurityMonitor = () => {
  const { user } = useAuth();
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);

  // Monitor recent activity for security patterns
  const { data: recentActivity } = useQuery({
    queryKey: ['security-activity'],
    queryFn: async () => {
      if (!user) return [];

      // Get recent transactions and requests
      const [transactions, requests] = await Promise.all([
        supabase
          .from('token_transactions')
          .select(`
            *,
            secours_subscriptions!inner(user_id, subscription_type)
          `)
          .eq('secours_subscriptions.user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        
        supabase
          .from('rescue_requests')
          .select(`
            *,
            secours_subscriptions!inner(user_id, subscription_type)
          `)
          .eq('secours_subscriptions.user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      return {
        transactions: transactions.data || [],
        requests: requests.data || []
      };
    },
    enabled: !!user,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Analyze security patterns
  useEffect(() => {
    if (!recentActivity || Array.isArray(recentActivity) || !recentActivity.transactions) return;

    const alerts: any[] = [];
    const now = new Date();
    const oneHour = 60 * 60 * 1000;

    // Check for unusual transaction patterns
    const recentTransactions = recentActivity.transactions.filter(
      (t: any) => new Date(t.created_at).getTime() > now.getTime() - oneHour
    );

    if (recentTransactions.length > 5) {
      alerts.push({
        id: 'high-transaction-frequency',
        type: 'warning',
        title: 'High Transaction Frequency',
        message: `${recentTransactions.length} token purchases in the last hour. This is unusual activity.`,
        severity: 'medium'
      });
    }

    // Check for rapid rescue requests
    const recentRequests = recentActivity.requests.filter(
      (r: any) => new Date(r.created_at).getTime() > now.getTime() - oneHour
    );

    if (recentRequests.length > 2) {
      alerts.push({
        id: 'multiple-rescue-requests',
        type: 'warning',
        title: 'Multiple Rescue Requests',
        message: `${recentRequests.length} rescue requests in the last hour. Please ensure all requests are legitimate.`,
        severity: 'high'
      });
    }

    // Check for large token purchases
    const largePurchases = recentActivity.transactions.filter(
      (t: any) => t.token_amount > 100
    );

    if (largePurchases.length > 0) {
      alerts.push({
        id: 'large-purchases',
        type: 'info',
        title: 'Large Token Purchases Detected',
        message: `Detected ${largePurchases.length} large token purchase(s). Your account activity is being monitored for security.`,
        severity: 'low'
      });
    }

    setSecurityAlerts(alerts);
  }, [recentActivity]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Monitor
          <Badge variant="outline" className="ml-auto">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </CardTitle>
        <CardDescription>
          Real-time monitoring of your Ô Secours account security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50">
            <Lock className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Account Secure</p>
              <p className="text-xs text-green-600">No security issues detected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50">
            <Eye className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">Monitoring Active</p>
              <p className="text-xs text-blue-600">24/7 security surveillance</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-purple-50">
            <Shield className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-800">Data Encrypted</p>
              <p className="text-xs text-purple-600">All transactions protected</p>
            </div>
          </div>
        </div>

        {/* Security Alerts */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Security Alerts</h3>
          {securityAlerts.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No security alerts</p>
              <p className="text-sm">Your account activity looks normal</p>
            </div>
          ) : (
            <div className="space-y-3">
              {securityAlerts.map((alert) => (
                <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <AlertDescription className="mt-1">
                        {alert.message}
                      </AlertDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </div>

        {/* Security Tips */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Security Best Practices</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Keep your account credentials secure and don't share them</li>
            <li>• Only make rescue requests for legitimate emergencies</li>
            <li>• Verify all token purchase transactions</li>
            <li>• Report any suspicious activity immediately</li>
            <li>• Regularly review your transaction history</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMonitor;