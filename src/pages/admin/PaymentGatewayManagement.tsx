import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaymentGateways } from '@/hooks/usePaymentGateways';
import { PaymentGateway } from '@/types/payment';
import { Settings, CreditCard, Smartphone, Building, DollarSign, Save, TestTube } from 'lucide-react';
import { toast } from 'sonner';

const PaymentGatewayManagement = () => {
  const { gateways, loading, updateGateway } = usePaymentGateways();
  const [editingGateway, setEditingGateway] = useState<string | null>(null);
  const [gatewayConfigs, setGatewayConfigs] = useState<Record<string, Partial<PaymentGateway>>>({});

  console.log('Admin gateways:', gateways);

  const handleConfigChange = (gatewayId: string, field: string, value: any) => {
    setGatewayConfigs(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        [field]: value
      }
    }));
  };

  const handleSaveConfig = async (gatewayId: string) => {
    const config = gatewayConfigs[gatewayId];
    if (config) {
      await updateGateway(gatewayId, config);
      setEditingGateway(null);
      setGatewayConfigs(prev => {
        const { [gatewayId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleTestGateway = async (gateway: PaymentGateway) => {
    toast.info(`Testing ${gateway.name} connection...`);
    
    // Simulate test
    setTimeout(() => {
      if (gateway.isActive) {
        toast.success(`${gateway.name} connection test successful!`);
      } else {
        toast.error(`${gateway.name} is currently disabled`);
      }
    }, 2000);
  };

  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'mobile_money':
        return <Smartphone className="h-6 w-6" />;
      case 'card':
        return <CreditCard className="h-6 w-6" />;
      case 'bank_transfer':
        return <Building className="h-6 w-6" />;
      default:
        return <DollarSign className="h-6 w-6" />;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading payment gateways...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Gateway Management</h1>
          <p className="text-gray-600">Configure and manage payment methods for your platform</p>
        </div>

        <Tabs defaultValue="gateways" className="space-y-6">
          <TabsList>
            <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
            <TabsTrigger value="settings">Global Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="gateways" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {gateways.map((gateway) => {
                const isEditing = editingGateway === gateway.id;
                const config = gatewayConfigs[gateway.id] || {};

                return (
                  <Card key={gateway.id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getGatewayIcon(gateway.type)}
                          <div>
                            <CardTitle className="text-lg">{gateway.name}</CardTitle>
                            <CardDescription>{gateway.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(gateway.isActive)}>
                            {gateway.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <span className="text-2xl">{gateway.icon}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Gateway Status */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`${gateway.id}-status`}>Enable Gateway</Label>
                        <Switch
                          id={`${gateway.id}-status`}
                          checked={config.isActive ?? gateway.isActive}
                          onCheckedChange={(checked) => handleConfigChange(gateway.id, 'isActive', checked)}
                        />
                      </div>

                      {/* Fee Configuration */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`${gateway.id}-percentage`}>Percentage Fee (%)</Label>
                          <Input
                            id={`${gateway.id}-percentage`}
                            type="number"
                            step="0.1"
                            value={config.fees?.percentage ?? gateway.fees.percentage}
                            onChange={(e) => handleConfigChange(gateway.id, 'fees', {
                              ...gateway.fees,
                              percentage: parseFloat(e.target.value) || 0
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${gateway.id}-fixed`}>Fixed Fee (CFA)</Label>
                          <Input
                            id={`${gateway.id}-fixed`}
                            type="number"
                            value={config.fees?.fixed ?? gateway.fees.fixed}
                            onChange={(e) => handleConfigChange(gateway.id, 'fees', {
                              ...gateway.fees,
                              fixed: parseInt(e.target.value) || 0
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      {/* Gateway-specific Configuration */}
                      {gateway.type === 'mobile_money' && (
                        <div>
                          <Label htmlFor={`${gateway.id}-merchant`}>Merchant ID</Label>
                          <Input
                            id={`${gateway.id}-merchant`}
                            value={config.config?.merchantId ?? gateway.config.merchantId}
                            onChange={(e) => handleConfigChange(gateway.id, 'config', {
                              ...gateway.config,
                              merchantId: e.target.value
                            })}
                            placeholder="Enter merchant ID"
                            disabled={!isEditing}
                          />
                          {gateway.id === 'orange_money' && (
                            <>
                              <Label htmlFor={`${gateway.id}-merchant-key`} className="mt-2">Merchant Key</Label>
                              <Input
                                id={`${gateway.id}-merchant-key`}
                                value={config.config?.merchantKey ?? gateway.config.merchantKey}
                                onChange={(e) => handleConfigChange(gateway.id, 'config', {
                                  ...gateway.config,
                                  merchantKey: e.target.value
                                })}
                                placeholder="Enter merchant key"
                                disabled={!isEditing}
                              />
                              <Label htmlFor={`${gateway.id}-client-id`} className="mt-2">Client ID</Label>
                              <Input
                                id={`${gateway.id}-client-id`}
                                value={config.config?.clientId ?? gateway.config.clientId}
                                onChange={(e) => handleConfigChange(gateway.id, 'config', {
                                  ...gateway.config,
                                  clientId: e.target.value
                                })}
                                placeholder="Enter client ID"
                                disabled={!isEditing}
                              />
                              <Label htmlFor={`${gateway.id}-merchant-login`} className="mt-2">Merchant Login</Label>
                              <Input
                                id={`${gateway.id}-merchant-login`}
                                value={config.config?.merchantLogin ?? gateway.config.merchantLogin}
                                onChange={(e) => handleConfigChange(gateway.id, 'config', {
                                  ...gateway.config,
                                  merchantLogin: e.target.value
                                })}
                                placeholder="Enter merchant login"
                                disabled={!isEditing}
                              />
                            </>
                          )}
                          {gateway.id === 'sama_money' && (
                            <>
                              <Label htmlFor={`${gateway.id}-merchant-code`} className="mt-2">Merchant Code</Label>
                              <Input
                                id={`${gateway.id}-merchant-code`}
                                value={config.config?.merchantCode ?? gateway.config.merchantCode}
                                onChange={(e) => handleConfigChange(gateway.id, 'config', {
                                  ...gateway.config,
                                  merchantCode: e.target.value
                                })}
                                placeholder="Enter merchant code"
                                disabled={!isEditing}
                              />
                              <Label htmlFor={`${gateway.id}-user-id`} className="mt-2">User ID</Label>
                              <Input
                                id={`${gateway.id}-user-id`}
                                value={config.config?.userId ?? gateway.config.userId}
                                onChange={(e) => handleConfigChange(gateway.id, 'config', {
                                  ...gateway.config,
                                  userId: e.target.value
                                })}
                                placeholder="Enter user ID"
                                disabled={!isEditing}
                              />
                            </>
                          )}
                        </div>
                      )}

                      {gateway.type === 'card' && (
                        <div>
                          <Label htmlFor={`${gateway.id}-apikey`}>API Key</Label>
                          <Input
                            id={`${gateway.id}-apikey`}
                            type="password"
                            value={config.config?.apiKey ?? gateway.config.apiKey}
                            onChange={(e) => handleConfigChange(gateway.id, 'config', {
                              ...gateway.config,
                              apiKey: e.target.value
                            })}
                            placeholder="Enter API key"
                            disabled={!isEditing}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-4">
                        {isEditing ? (
                          <>
                            <Button
                              onClick={() => handleSaveConfig(gateway.id)}
                              className="flex-1"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingGateway(null);
                                setGatewayConfigs(prev => {
                                  const { [gateway.id]: removed, ...rest } = prev;
                                  return rest;
                                });
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => setEditingGateway(gateway.id)}
                              className="flex-1"
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleTestGateway(gateway)}
                            >
                              <TestTube className="h-4 w-4 mr-2" />
                              Test
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Payment Settings</CardTitle>
                <CardDescription>Configure platform-wide payment settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Input
                    id="default-currency"
                    value="CFA"
                    disabled
                    className="w-32"
                  />
                </div>
                <div>
                  <Label htmlFor="payment-timeout">Payment Timeout (minutes)</Label>
                  <Input
                    id="payment-timeout"
                    type="number"
                    defaultValue="15"
                    className="w-32"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-retry" defaultChecked />
                  <Label htmlFor="auto-retry">Enable automatic payment retry</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="email-receipts" defaultChecked />
                  <Label htmlFor="email-receipts">Send email receipts</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">94.2%</div>
                  <div className="text-gray-600">Success Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
                  <div className="text-gray-600">Transactions Today</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">2.1M</div>
                  <div className="text-gray-600">Total Volume (CFA)</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gateways.filter(g => g.isActive).map((gateway) => (
                    <div key={gateway.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getGatewayIcon(gateway.type)}
                        <span>{gateway.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.floor(Math.random() * 500)} transactions
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PaymentGatewayManagement;