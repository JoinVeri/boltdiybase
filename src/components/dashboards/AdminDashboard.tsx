import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Users, 
  Calendar,
  Plus,
  Image as ImageIcon,
  Save,
  Trash2,
  Settings,
  Shield,
  Mail,
  FileText,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AddCityModal from '../modals/AddCityModal';

interface AdminProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string;
  message: string;
  services: string[];
  status: 'new' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  totalBusinesses: number;
  totalCities: number;
  totalUsers: number;
  activeDeals: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBusinesses: 0,
    totalCities: 0,
    totalUsers: 0,
    activeDeals: 0
  });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    avatar_url: ''
  });

  useEffect(() => {
    checkAdmin();
    fetchStats();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/signin');
        return;
      }

      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (adminError || !adminData) {
        navigate('/');
        return;
      }

      setProfile(adminData);
      setFormData({
        first_name: adminData.first_name || '',
        last_name: adminData.last_name || '',
        avatar_url: adminData.avatar_url || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const fetchStats = async () => {
    try {
      // Get total businesses
      const { count: businessCount, error: businessError } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true });

      // Get total cities
      const { count: cityCount, error: cityError } = await supabase
        .from('cities')
        .select('*', { count: 'exact', head: true });

      // Get active deals
      const { count: dealCount, error: dealError } = await supabase
        .from('business_deals')
        .select('*', { count: 'exact', head: true })
        .gte('end_date', new Date().toISOString());

      // Get total users (from admin_users since we can't access auth.users directly)
      const { count: userCount, error: userError } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });

      if (businessError || cityError || dealError || userError) {
        throw new Error('Error fetching stats');
      }

      setStats({
        totalBusinesses: businessCount || 0,
        totalCities: cityCount || 0,
        totalUsers: userCount || 0,
        activeDeals: dealCount || 0
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          avatar_url: formData.avatar_url
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev!,
        ...formData
      }));
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.first_name || 'Admin'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Shield className="h-12 w-12 text-blue-600" />
                    )}
                  </div>
                </div>
                <h2 className="mt-4 text-xl font-semibold">
                  {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'Admin'}
                </h2>
                <p className="text-gray-500">{profile?.email}</p>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="mt-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <Settings className="h-4 w-4" />
                  <span>{editMode ? 'Cancel Editing' : 'Edit Profile'}</span>
                </button>
              </div>

              {editMode && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                    <input
                      type="url"
                      name="avatar_url"
                      value={formData.avatar_url}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Businesses</p>
                    <h3 className="text-xl font-semibold">{stats.totalBusinesses}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Cities</p>
                    <h3 className="text-xl font-semibold">{stats.totalCities}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Users</p>
                    <h3 className="text-xl font-semibold">{stats.totalUsers}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Tag className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Active Deals</p>
                    <h3 className="text-xl font-semibold">{stats.activeDeals}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowAddCityModal(true)}
                  className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span>Add New City</span>
                </button>
                <button className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Review Business Applications</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add City Modal */}
      <AddCityModal 
        isOpen={showAddCityModal}
        onClose={() => setShowAddCityModal(false)}
      />
    </div>
  );
};

export default AdminDashboard;