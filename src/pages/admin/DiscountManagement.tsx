import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Sector {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface Merchant {
  id: string;
  name: string;
  sector_id: string;
  sector?: { name: string };
  discount_percentage: number;
  location: string;
  contact_phone: string;
  contact_email: string;
  description: string;
  website: string;
  is_active: boolean;
  featured: boolean;
}

export default function DiscountManagement() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [showSectorDialog, setShowSectorDialog] = useState(false);
  const [showMerchantDialog, setShowMerchantDialog] = useState(false);
  const { toast } = useToast();

  const [sectorForm, setSectorForm] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const [merchantForm, setMerchantForm] = useState({
    name: "",
    sector_id: "",
    discount_percentage: 0,
    location: "",
    contact_phone: "",
    contact_email: "",
    description: "",
    website: "",
    is_active: true,
    featured: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchSectors(), fetchMerchants()]);
    setIsLoading(false);
  };

  const fetchSectors = async () => {
    const { data, error } = await supabase
      .from("sectors")
      .select("*")
      .order("name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sectors",
        variant: "destructive",
      });
    } else {
      setSectors(data || []);
    }
  };

  const fetchMerchants = async () => {
    const { data, error } = await supabase
      .from("merchants")
      .select(`
        *,
        sector:sectors(name)
      `)
      .order("name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch merchants",
        variant: "destructive",
      });
    } else {
      setMerchants(data || []);
    }
  };

  const handleSectorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSector) {
      const { error } = await supabase
        .from("sectors")
        .update(sectorForm)
        .eq("id", editingSector.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update sector",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Success", description: "Sector updated successfully" });
    } else {
      const { error } = await supabase
        .from("sectors")
        .insert([sectorForm]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create sector",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Success", description: "Sector created successfully" });
    }

    setShowSectorDialog(false);
    resetSectorForm();
    fetchSectors();
  };

  const handleMerchantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMerchant) {
      const { error } = await supabase
        .from("merchants")
        .update(merchantForm)
        .eq("id", editingMerchant.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update merchant",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Success", description: "Merchant updated successfully" });
    } else {
      const { error } = await supabase
        .from("merchants")
        .insert([{
          ...merchantForm,
          sector: sectors.find(s => s.id === merchantForm.sector_id)?.name || ""
        }]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create merchant",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Success", description: "Merchant created successfully" });
    }

    setShowMerchantDialog(false);
    resetMerchantForm();
    fetchMerchants();
  };

  const deleteSector = async (id: string) => {
    const { error } = await supabase
      .from("sectors")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete sector",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Sector deleted successfully" });
      fetchSectors();
    }
  };

  const deleteMerchant = async (id: string) => {
    const { error } = await supabase
      .from("merchants")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete merchant",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Merchant deleted successfully" });
      fetchMerchants();
    }
  };

  const resetSectorForm = () => {
    setSectorForm({ name: "", description: "", is_active: true });
    setEditingSector(null);
  };

  const resetMerchantForm = () => {
    setMerchantForm({
      name: "",
      sector_id: "",
      discount_percentage: 0,
      location: "",
      contact_phone: "",
      contact_email: "",
      description: "",
      website: "",
      is_active: true,
      featured: false,
    });
    setEditingMerchant(null);
  };

  const openSectorDialog = (sector?: Sector) => {
    if (sector) {
      setEditingSector(sector);
      setSectorForm(sector);
    } else {
      resetSectorForm();
    }
    setShowSectorDialog(true);
  };

  const openMerchantDialog = (merchant?: Merchant) => {
    if (merchant) {
      setEditingMerchant(merchant);
      setMerchantForm({
        name: merchant.name,
        sector_id: merchant.sector_id,
        discount_percentage: merchant.discount_percentage,
        location: merchant.location || "",
        contact_phone: merchant.contact_phone || "",
        contact_email: merchant.contact_email || "",
        description: merchant.description || "",
        website: merchant.website || "",
        is_active: merchant.is_active,
        featured: merchant.featured,
      });
    } else {
      resetMerchantForm();
    }
    setShowMerchantDialog(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Discount Management</h1>

      <Tabs defaultValue="merchants" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
        </TabsList>

        <TabsContent value="merchants" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Merchants</h2>
            <Button onClick={() => openMerchantDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Merchant
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchants.map((merchant) => (
                    <TableRow key={merchant.id}>
                      <TableCell className="font-medium">{merchant.name}</TableCell>
                      <TableCell>{merchant.sector?.name || "N/A"}</TableCell>
                      <TableCell>{merchant.discount_percentage}%</TableCell>
                      <TableCell>{merchant.location}</TableCell>
                      <TableCell>
                        <Badge variant={merchant.is_active ? "default" : "secondary"}>
                          {merchant.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={merchant.featured ? "default" : "outline"}>
                          {merchant.featured ? "Featured" : "Regular"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openMerchantDialog(merchant)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMerchant(merchant.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Sectors</h2>
            <Button onClick={() => openSectorDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sector
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectors.map((sector) => (
                    <TableRow key={sector.id}>
                      <TableCell className="font-medium">{sector.name}</TableCell>
                      <TableCell>{sector.description}</TableCell>
                      <TableCell>
                        <Badge variant={sector.is_active ? "default" : "secondary"}>
                          {sector.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openSectorDialog(sector)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSector(sector.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sector Dialog */}
      <Dialog open={showSectorDialog} onOpenChange={setShowSectorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSector ? "Edit Sector" : "Add New Sector"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSectorSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sector-name">Name</Label>
              <Input
                id="sector-name"
                value={sectorForm.name}
                onChange={(e) => setSectorForm({ ...sectorForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="sector-description">Description</Label>
              <Textarea
                id="sector-description"
                value={sectorForm.description}
                onChange={(e) => setSectorForm({ ...sectorForm, description: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="sector-active"
                checked={sectorForm.is_active}
                onCheckedChange={(checked) => setSectorForm({ ...sectorForm, is_active: checked })}
              />
              <Label htmlFor="sector-active">Active</Label>
            </div>
            <div className="flex space-x-2">
              <Button type="submit">{editingSector ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowSectorDialog(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Merchant Dialog */}
      <Dialog open={showMerchantDialog} onOpenChange={setShowMerchantDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMerchant ? "Edit Merchant" : "Add New Merchant"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMerchantSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="merchant-name">Name</Label>
                <Input
                  id="merchant-name"
                  value={merchantForm.name}
                  onChange={(e) => setMerchantForm({ ...merchantForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="merchant-sector">Sector</Label>
                <Select
                  value={merchantForm.sector_id}
                  onValueChange={(value) => setMerchantForm({ ...merchantForm, sector_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.filter(s => s.is_active).map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="merchant-discount">Discount Percentage</Label>
                <Input
                  id="merchant-discount"
                  type="number"
                  min="0"
                  max="100"
                  value={merchantForm.discount_percentage}
                  onChange={(e) => setMerchantForm({ ...merchantForm, discount_percentage: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="merchant-location">Location</Label>
                <Input
                  id="merchant-location"
                  value={merchantForm.location}
                  onChange={(e) => setMerchantForm({ ...merchantForm, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="merchant-phone">Contact Phone</Label>
                <Input
                  id="merchant-phone"
                  value={merchantForm.contact_phone}
                  onChange={(e) => setMerchantForm({ ...merchantForm, contact_phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="merchant-email">Contact Email</Label>
                <Input
                  id="merchant-email"
                  type="email"
                  value={merchantForm.contact_email}
                  onChange={(e) => setMerchantForm({ ...merchantForm, contact_email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="merchant-website">Website</Label>
              <Input
                id="merchant-website"
                value={merchantForm.website}
                onChange={(e) => setMerchantForm({ ...merchantForm, website: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="merchant-description">Description</Label>
              <Textarea
                id="merchant-description"
                value={merchantForm.description}
                onChange={(e) => setMerchantForm({ ...merchantForm, description: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="merchant-active"
                  checked={merchantForm.is_active}
                  onCheckedChange={(checked) => setMerchantForm({ ...merchantForm, is_active: checked })}
                />
                <Label htmlFor="merchant-active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="merchant-featured"
                  checked={merchantForm.featured}
                  onCheckedChange={(checked) => setMerchantForm({ ...merchantForm, featured: checked })}
                />
                <Label htmlFor="merchant-featured">Featured</Label>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button type="submit">{editingMerchant ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowMerchantDialog(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}