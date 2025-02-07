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
  Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Business } from '../types/database';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Business>>({
    name: '',
    description: '',
    city: '',
    state: '',
    category: '',
    website: '',
    employee_count: null,
    founded_year: null,
    image_url: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinesses();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  };

  const fetchBusinesses = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching businesses:', error);
    } else {
      setBusinesses(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const businessData = {
      ...formData,
      employee_count: formData.employee_count ? parseInt(String(formData.employee_count)) : null,
      founded_year: formData.founded_year ? parseInt(String(formData.founded_year)) : null,
    };

    let error;
    if (isEditing && selectedBusinessId) {
      const { error: updateError } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', selectedBusinessId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('businesses')
        .insert([businessData]);
      error = insertError;
    }

    if (error) {
      alert('Error saving business: ' + error.message);
    } else {
      resetForm();
      fetchBusinesses();
    }
    setLoading(false);
  };

  const handleEdit = (business: Business) => {
    setFormData(business);
    setIsEditing(true);
    setSelectedBusinessId(business.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;

    setLoading(true);
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting business: ' + error.message);
    } else {
      fetchBusinesses();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      city: '',
      state: '',
      category: '',
      website: '',
      employee_count: null,
      founded_year: null,
      image_url: '',
    });
    setIsEditing(false);
    setSelectedBusinessId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your business listings</p>
      </div>

      {/* Business Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Business' : 'Add New Business'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Spa & Wellness">Spa & Wellness</option>
                  <option value="Digital Services">Digital Services</option>
                  <option value="Pet Services">Pet Services</option>
                  <option value="Photography">Photography</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Tech Repair">Tech Repair</option>
                  <option value="Catering">Catering</option>
                  <option value="Music Education">Music Education</option>
                  <option value="Cleaning Services">Cleaning Services</option>
                </select>
              </div>
            </div>

            {/* Location and Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Count
                  </label>
                  <input
                    type="number"
                    name="employee_count"
                    value={formData.employee_count || ''}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    name="founded_year"
                    value={formData.founded_year || ''}
                    onChange={handleInputChange}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{isEditing ? 'Update' : 'Add'} Business</span>
            </button>
          </div>
        </form>
      </div>

      {/* Business List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Business Listings</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4">Business</th>
                <th className="text-left py-4 px-4">Location</th>
                <th className="text-left py-4 px-4">Category</th>
                <th className="text-left py-4 px-4">Rating</th>
                <th className="text-left py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr key={business.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                        {business.image_url ? (
                          <img
                            src={business.image_url}
                            alt={business.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{business.name}</div>
                        <div className="text-sm text-gray-500">
                          {business.review_count} reviews
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{business.city}, {business.state}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {business.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">{business.rating.toFixed(1)}</span>
                      <span className="text-gray-500">/ 5</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(business)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(business.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;