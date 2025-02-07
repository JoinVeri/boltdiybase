import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Settings,
  Tag,
  BookOpen,
  Plus,
  Rocket,
  ChevronRight,
  Video
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Business } from '../../types/database';
import DealModal from '../modals/DealModal';
import VideoRequestForm from '../forms/VideoRequestForm';

const BusinessDashboard = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching businesses:', error);
      } else {
        setBusinesses(data || []);
        if (data && data.length > 0) {
          setCurrentBusiness(data[0]);
        }
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-xl mb-8"></div>
        <div className="space-y-8">
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header section */}
      <DashboardHeader currentBusiness={currentBusiness} />

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left content (2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Business List */}
          <BusinessList businesses={businesses} />
        </div>

        {/* Right content (1 column) */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions 
            setShowDealModal={setShowDealModal} 
            setShowVideoForm={setShowVideoForm}
          />
        </div>
      </div>

      {/* VeriLocal Services */}
      <div className="mt-12">
        <Link 
          to="/business/services" 
          className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">VeriLocal Services</h2>
          <p className="text-gray-600 mb-4">
            Enhance your business presence and grow your customer base with our comprehensive suite of professional services.
          </p>
          <div className="flex items-center text-blue-600">
            <span>Learn More</span>
            <ChevronRight className="h-5 w-5 ml-1" />
          </div>
        </Link>
      </div>

      {/* Video Production Request Form */}
      {showVideoForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl max-h-[90vh] m-4 overflow-hidden flex flex-col bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Video Production Request</h2>
              <button
                onClick={() => setShowVideoForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <VideoRequestForm onClose={() => setShowVideoForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Deal Modal */}
      {currentBusiness && (
        <DealModal
          isOpen={showDealModal}
          onClose={() => setShowDealModal(false)}
          businessId={currentBusiness.id}
        />
      )}
    </div>
  );
};

/**
 * DashboardHeader: Shows a page title and some info about the current business.
 */
const DashboardHeader: React.FC<{ currentBusiness: Business | null }> = ({ currentBusiness }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {currentBusiness ? currentBusiness.name : 'Business Dashboard'}
          </h1>
          <p className="text-gray-600">
            {currentBusiness
              ? `${currentBusiness.city}, ${currentBusiness.state}`
              : 'Manage your business listings and customer requests'}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * QuickActions: Provides shortcuts to add deals, articles, or view services.
 */
const QuickActions: React.FC<{
  setShowDealModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowVideoForm: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowDealModal, setShowVideoForm }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <button
          onClick={() => setShowDealModal(true)}
          className="w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg hover:bg-gray-50"
        >
          <Tag className="h-5 w-5 text-blue-500" />
          <span>Add Deal</span>
          <Plus className="h-4 w-4 ml-auto" />
        </button>
        <Link 
          to="/articles/new"
          className="w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg hover:bg-gray-50"
        >
          <BookOpen className="h-5 w-5 text-blue-500" />
          <span>Add Article</span>
          <Plus className="h-4 w-4 ml-auto" />
        </Link>
        <button
          onClick={() => setShowVideoForm(true)}
          className="w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg hover:bg-gray-50"
        >
          <Video className="h-5 w-5 text-blue-500" />
          <span>Request Video Production</span>
          <Plus className="h-4 w-4 ml-auto" />
        </button>
        <Link 
          to="/business/services"
          className="w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg hover:bg-gray-50"
        >
          <Rocket className="h-5 w-5 text-blue-500" />
          <span>VeriLocal Services</span>
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Link>
      </div>
    </div>
  );
};

/**
 * BusinessList: Displays all businesses owned by the user.
 */
const BusinessList: React.FC<{ businesses: Business[] }> = ({ businesses }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Your Businesses</h2>
      <div className="space-y-4">
        {businesses.map((business) => (
          <div
            key={business.id}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                {business.image_url ? (
                  <img
                    src={business.image_url}
                    alt={business.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{business.name}</h3>
                <p className="text-sm text-gray-500">
                  {business.city}, {business.state}
                </p>
              </div>
            </div>
            <Link
              to={`/business/edit/${business.id}`}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Settings className="h-5 w-5" />
              <span>Manage</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessDashboard;