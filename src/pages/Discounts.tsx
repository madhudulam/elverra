
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PremiumBanner from '@/components/layout/PremiumBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Store, Percent, Star, Loader2 } from 'lucide-react';
import { useDiscounts, useDiscountUsage } from '@/hooks/useDiscounts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Discounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { merchants, sectors, loading, error, fetchMerchants, getSectors, getLocations } = useDiscounts();
  const { recordDiscountUsage } = useDiscountUsage();

  const handleSectorClick = (sectorName: string) => {
    setSectorFilter(sectorName);
  };

  const handleSearch = () => {
    fetchMerchants({
      search: searchTerm,
      sector: sectorFilter,
      location: locationFilter
    });
  };

  const handleClaimDiscount = async (merchant: any) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    await recordDiscountUsage(merchant.id, merchant.discount_percentage);
  };

  useEffect(() => {
    handleSearch();
  }, [sectorFilter, locationFilter]);

  if (loading && merchants.length === 0) {
    return (
      <Layout>
        <PremiumBanner
        title="Client Discounts"
        description="Unlock exclusive savings across West Africa with Club66 Global client benefits"
          backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        />
        <div className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600">Loading discounts...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const featuredMerchants = merchants.filter(m => m.featured);
  const merchantStats = {
    totalMerchants: merchants.length,
    countries: [...new Set(merchants.map(m => m.location.split(',').pop()?.trim()))].length,
    avgDiscount: Math.round(merchants.reduce((sum, m) => sum + m.discount_percentage, 0) / merchants.length) || 0,
    members: '2M+'
  };

  return (
    <Layout>
      <PremiumBanner
        title="Client Discounts"
        description="Unlock exclusive savings across West Africa with Club66 Global client benefits"
        backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <div className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search and Filter Section */}
            <Card className="mb-12">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search merchants..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.name}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {getLocations().map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch} className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{merchantStats.totalMerchants}+</div>
                <div className="text-gray-600">Partner Merchants</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{merchantStats.countries}</div>
                <div className="text-gray-600">West African Countries</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{merchantStats.avgDiscount}%</div>
                <div className="text-gray-600">Average Savings</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{merchantStats.members}</div>
                <div className="text-gray-600">Happy Clients</div>
              </Card>
            </div>

            {/* Sectors Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Discount Sectors</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {sectors.map((sector) => (
                  <Card 
                    key={sector.id} 
                    className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer hover:bg-purple-50"
                    onClick={() => handleSectorClick(sector.name)}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Store className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 leading-tight">{sector.name}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Featured Discounts */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Featured Discounts</h2>
              {featuredMerchants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredMerchants.map((merchant) => (
                    <Card key={merchant.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative">
                        <img 
                          src={merchant.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} 
                          alt={merchant.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-green-500 text-white text-lg px-3 py-1">
                            {merchant.discount_percentage}% OFF
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">{merchant.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{merchant.rating || 4.5}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="mb-3">{merchant.sector}</Badge>
                        <p className="text-gray-600 mb-4">{merchant.description || 'Great deals and services'}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          {merchant.location}
                        </div>
                        <Button 
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleClaimDiscount(merchant)}
                        >
                          <Percent className="h-4 w-4 mr-2" />
                          Claim Discount
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No featured discounts found</h3>
                  <p className="text-gray-500">Check back later for new offers</p>
                </div>
              )}
            </div>

            {/* All Merchants */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">All Discounts</h2>
              {merchants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {merchants.map((merchant) => (
                    <Card key={merchant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={merchant.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} 
                          alt={merchant.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-500 text-white px-2 py-1">
                            {merchant.discount_percentage}%
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-md mb-1">{merchant.name}</h3>
                        <Badge variant="outline" className="text-xs mb-2">{merchant.sector}</Badge>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{merchant.description || 'Great deals available'}</p>
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <MapPin className="h-3 w-3 mr-1" />
                          {merchant.location}
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleClaimDiscount(merchant)}
                        >
                          Claim
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No merchants found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Start Saving Today!</h2>
                <p className="text-xl mb-8 opacity-90">
                  Join millions of Elverra Global members and unlock exclusive discounts across West Africa
                </p>
                <Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-gray-100">
                  Become a Member
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Discounts;
