import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Briefcase, Building, Users, Search, Plus, ChevronDown, Info, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import CountrySelector from './CountrySelector';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('/lovable-uploads/elverra-global-logo.png');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        // Try to get the uploaded logo from club66 storage bucket
        const { data: logoData, error: listError } = await supabase.storage
          .from('club66')
          .list('', { limit: 10 });
        
        if (listError) {
          console.log('Storage bucket not accessible, using default logo');
          return;
        }
        
        // Look for logo files (png, jpg, jpeg)
        const logoFile = logoData?.find(file => 
          file.name.toLowerCase().startsWith('logo.') && 
          ['png', 'jpg', 'jpeg', 'webp'].includes(file.name.toLowerCase().split('.').pop() || '')
        );
        
        if (logoFile) {
          const { data: urlData } = supabase.storage
            .from('club66')
            .getPublicUrl(logoFile.name);
          
          if (urlData?.publicUrl) {
            setLogoUrl(urlData.publicUrl);
          }
        }
      } catch (error) {
        console.log('Error fetching logo, using default:', error);
      }
    };

    fetchLogo();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoUrl} 
              alt="Elverra Global" 
              className="h-10 w-auto object-contain"
              onError={() => setLogoUrl('/lovable-uploads/elverra-global-logo.png')}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
            >
              Home
            </Link>
            
            {/* About Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 font-medium text-sm">
                  <Info className="h-4 w-4 mr-1" />
                  About
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    About Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/about/contact" className="flex items-center">
                    Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/project-requests" className="flex items-center">
                    Projects
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/faq" className="flex items-center">
                    Partners
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/faq" className="flex items-center">
                    News
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/team" className="flex items-center">
                    Team Members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about/mission" className="flex items-center">
                    Empowerment and Progress
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/terms" className="flex items-center">
                    Terms of Use
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/privacy" className="flex items-center">
                    Privacy Policy
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 font-medium text-sm">
                  Services
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/services" className="flex items-center">
                    All Services
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/services/o-secours" className="flex items-center">
                    Ô Secours
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/services/credit-system" className="flex items-center">
                    Credit System
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/services/hire-purchase" className="flex items-center">
                    Hire Purchase
                  </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                   <Link to="/services/payday-advance" className="flex items-center">
                     Payday Advance
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                   <Link to="/services/online-store" className="flex items-center">
                     Online Store
                   </Link>
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>

             {/* Shop Menu Item */}
             <Link 
               to="/shop" 
               className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
             >
               Shop
             </Link>

            {/* Jobs Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-purple-600 font-medium">
                  <Briefcase className="h-4 w-4 mr-1" />
                  Jobs
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/jobs" className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/job-center" className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Job Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/job-dashboard/employee" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Employee Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/job-dashboard/employer" className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Employer Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/post-job" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Job
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Our Affiliates Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-purple-600 font-medium">
                  <UserCheck className="h-4 w-4 mr-1" />
                  Our Affiliates
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/affiliates/members" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Member Affiliates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/affiliates/merchants" className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Merchant Partners
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/affiliates/distributors" className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Distributors
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/affiliate-dashboard" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Affiliate Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              to="/discounts" 
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Discounts
            </Link>

            <Link 
              to="/project-requests" 
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Projects
            </Link>

            <Link 
              to="/competitions" 
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Competitions
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <CountrySelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>My Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/my-account" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/register">Join Now</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                to="/about/contact" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <Link 
                to="/about/projects" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                onClick={toggleMenu}
              >
                Projects
              </Link>
              <Link 
                to="/about/partners" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                onClick={toggleMenu}
              >
                Partners
              </Link>
              <Link 
                to="/about/news" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                onClick={toggleMenu}
              >
                News
              </Link>
              <Link 
                to="/services" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Services
              </Link>
               <Link 
                 to="/services/o-secours" 
                 className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2 pl-6"
                 onClick={toggleMenu}
               >
                 Ô Secours
               </Link>
               <Link 
                 to="/shop" 
                 className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                 onClick={toggleMenu}
               >
                 Shop
               </Link>
              <Link 
                to="/jobs" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Browse Jobs
              </Link>
              <Link 
                to="/job-center" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Job Center
              </Link>
              <Link 
                to="/post-job" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Post a Job
              </Link>
              <Link 
                to="/affiliates/members" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Member Affiliates
              </Link>
              <Link 
                to="/affiliates/merchants" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Merchant Partners
              </Link>
              <Link 
                to="/affiliates/distributors" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Distributors
              </Link>
              <Link 
                to="/affiliate-dashboard" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Affiliate Dashboard
              </Link>
              <Link 
                to="/discounts" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Discounts
              </Link>
              <Link 
                to="/competitions" 
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium px-2"
                onClick={toggleMenu}
              >
                Competitions
              </Link>
              
              {!user && (
                <div className="flex flex-col space-y-2 px-2 pt-4 border-t">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login" onClick={toggleMenu}>Login</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-700">
                    <Link to="/register" onClick={toggleMenu}>Join Now</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;