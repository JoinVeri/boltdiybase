import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  User, 
  LogOut, 
  Settings, 
  Menu,
  Building2,
  MapPin,
  BookOpen,
  ChevronDown,
  Home,
  Briefcase,
  Heart,
  Scissors,
  Car,
  Laptop
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Logo from './Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);

  const serviceCategories = [
    {
      name: 'Home Services',
      icon: Home,
      services: ['Cleaning', 'Plumbing', 'Electrical', 'HVAC', 'Landscaping']
    },
    {
      name: 'Professional Services',
      icon: Briefcase,
      services: ['Legal', 'Accounting', 'Marketing', 'Consulting', 'Real Estate']
    },
    {
      name: 'Health & Beauty',
      icon: Heart,
      services: ['Fitness', 'Spa', 'Salon', 'Wellness', 'Therapy']
    },
    {
      name: 'Personal Care',
      icon: Scissors,
      services: ['Hair Styling', 'Nail Care', 'Skincare', 'Massage', 'Barber']
    },
    {
      name: 'Auto Services',
      icon: Car,
      services: ['Repair', 'Maintenance', 'Detailing', 'Towing', 'Tire Service']
    },
    {
      name: 'Tech Services',
      icon: Laptop,
      services: ['Computer Repair', 'IT Support', 'Web Design', 'Data Recovery']
    }
  ];

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchBusinessName(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchBusinessName(session.user);
      } else {
        setBusinessName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchBusinessName = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('name')
        .eq('user_id', user.id);
      
      if (error) throw error;
      if (data && data.length > 0) {
        setBusinessName(data[0].name);
      }
    } catch (error) {
      console.error('Error fetching business name:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getDisplayName = () => {
    if (!user) return '';
    
    if (user.user_metadata?.user_type === 'business') {
      return businessName || user.email?.split('@')[0];
    }
    
    return user.user_metadata?.first_name || user.email?.split('@')[0];
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/businesses" className="text-gray-700 hover:text-blue-600">
              Businesses
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowServicesMenu(!showServicesMenu)}
                onBlur={() => setTimeout(() => setShowServicesMenu(false), 200)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
              >
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showServicesMenu && (
                <div className="absolute top-full left-0 w-[600px] bg-white rounded-lg shadow-lg py-4 mt-2">
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      {serviceCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <div key={category.name} className="px-4">
                            <div className="flex items-center space-x-2 text-gray-900 font-medium mb-2">
                              <Icon className="h-5 w-5 text-blue-600" />
                              <span>{category.name}</span>
                            </div>
                            <ul className="space-y-1">
                              {category.services.map((service) => (
                                <li key={service}>
                                  <Link
                                    to={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="block px-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    onClick={() => setShowServicesMenu(false)}
                                  >
                                    {service}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/cities" className="text-gray-700 hover:text-blue-600">
              Cities
            </Link>
            <Link to="/articles" className="text-gray-700 hover:text-blue-600">
              Articles
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">
                    {getDisplayName()}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    {user.email === 'hello@verilocal.pro' && (
                      <Link
                        to="/dashboard/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="h-5 w-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to={user.user_metadata?.user_type === 'business' ? '/dashboard/business' : '/dashboard/customer'}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="hidden md:block text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="btn-apple flex items-center space-x-2"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/businesses"
                className="flex flex-col items-center p-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowMobileMenu(false)}
              >
                <Building2 className="h-6 w-6 mb-2" />
                <span>Businesses</span>
              </Link>
              <Link
                to="/cities"
                className="flex flex-col items-center p-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowMobileMenu(false)}
              >
                <MapPin className="h-6 w-6 mb-2" />
                <span>Cities</span>
              </Link>
              <Link
                to="/articles"
                className="flex flex-col items-center p-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowMobileMenu(false)}
              >
                <BookOpen className="h-6 w-6 mb-2" />
                <span>Articles</span>
              </Link>
            </div>

            {/* Mobile Services Menu */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h3 className="px-4 text-sm font-medium text-gray-900 mb-2">Services</h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {serviceCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.name} className="px-4">
                      <div className="flex items-center space-x-2 text-gray-900 font-medium mb-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <span>{category.name}</span>
                      </div>
                      <ul className="space-y-1 pl-7">
                        {category.services.map((service) => (
                          <li key={service}>
                            <Link
                              to={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                              className="block py-1 text-gray-600 hover:text-blue-600"
                              onClick={() => setShowMobileMenu(false)}
                            >
                              {service}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;