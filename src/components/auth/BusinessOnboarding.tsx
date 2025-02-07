import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  DollarSign,
  Plus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface OnboardingFormData {
  businessName: string;
  phoneNumber: string;
  category: string;
  description: string;
  yearsInBusiness: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceRadius: number;
  alternatePhone: string;
  serviceCategories: string[];
  customServices: string;
  priceRange: string;
}

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<OnboardingFormData>({
    businessName: '',
    phoneNumber: '',
    category: '',
    description: '',
    yearsInBusiness: 0,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    serviceRadius: 25,
    alternatePhone: '',
    serviceCategories: [],
    customServices: '',
    priceRange: '',
  });

  const serviceCategories = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Landscaping',
    'Cleaning',
    'Home Improvement',
    'Painting',
    'Carpentry',
    'Roofing',
    'Flooring',
    'Interior Design',
    'Pet Services',
    'Photography',
    'Digital Services',
    'Tech Repair',
    'General Contractor',
    'Excavating',
    'Masonry',
    'Concrete',
    'Fencing',
    'Tree Service',
    'Pest Control',
    'Window Services',
    'Garage Door Services',
    'Appliance Repair',
    'Pool Services',
    'Lawn Care',
    'Handyman Services',
    'Moving Services',
    'Junk Removal',
    'Pressure Washing',
    'Gutter Services',
    'Deck & Patio',
    'Drywall',
    'Insulation',
    'Solar Installation',
    'Security Systems',
    'Waterproofing',
    'Foundation Repair',
    'Chimney Services',
    'Siding',
    'Cabinet Services',
    'Countertop Installation',
    'Tile Installation'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(category)
        ? prev.serviceCategories.filter(c => c !== category)
        : [...prev.serviceCategories, category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to complete onboarding');
      }

      // Create the business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert([{
          name: formData.businessName,
          description: formData.description,
          city: formData.city,
          state: formData.state,
          category: formData.category,
          user_id: user.id,
          employee_count: 1,
          founded_year: new Date().getFullYear() - formData.yearsInBusiness,
          phone: formData.phoneNumber,
          website: '',
          service_radius: formData.serviceRadius
        }])
        .select()
        .single();

      if (businessError) throw businessError;

      // Add business categories
      if (formData.serviceCategories.length > 0) {
        const { error: categoriesError } = await supabase
          .from('business_categories')
          .insert(
            formData.serviceCategories.map((category, index) => ({
              business_id: business.id,
              category_name: category,
              is_primary: index === 0
            }))
          );

        if (categoriesError) throw categoriesError;
      }

      // Navigate to the business dashboard
      navigate('/dashboard/business');
    } catch (err) {
      console.error('Error during onboarding:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during onboarding');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Complete Your Business Profile</h1>
        <p className="text-gray-600 mt-2">Tell us about your business to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => setCurrentStep(step)}
              className={`flex-1 text-center py-2 border-b-2 ${
                currentStep === step
                  ? 'border-blue-500 text-blue-600'
                  : step < currentStep
                  ? 'border-green-500 text-green-600'
                  : 'border-gray-200 text-gray-400'
              }`}
            >
              Step {step}
            </button>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        <div className={currentStep === 1 ? 'block' : 'hidden'}>
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {serviceCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your services, specialties, and experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years in Business
                </label>
                <input
                  type="number"
                  name="yearsInBusiness"
                  value={formData.yearsInBusiness}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Step 2: Location & Contact */}
        <div className={currentStep === 2 ? 'block' : 'hidden'}>
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Location & Contact Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
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
                    State
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
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{5}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Radius (miles)
                </label>
                <input
                  type="range"
                  name="serviceRadius"
                  value={formData.serviceRadius}
                  onChange={handleInputChange}
                  min="5"
                  max="100"
                  step="5"
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">
                  {formData.serviceRadius} miles
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Phone Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Step 3: Services & Pricing */}
        <div className={currentStep === 3 ? 'block' : 'hidden'}>
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Services & Pricing</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Service Categories
                </label>
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceCategories.map(category => (
                      <label
                        key={category}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.serviceCategories.includes(category)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.serviceCategories.includes(category)}
                          onChange={() => handleServiceCategoryChange(category)}
                          className="sr-only"
                        />
                        <span className={formData.serviceCategories.includes(category) ? 'text-blue-700' : 'text-gray-700'}>
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Services (Optional)
                </label>
                <textarea
                  name="customServices"
                  value={formData.customServices}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List any additional services not covered above..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="relative">
                  <select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a price range</option>
                    <option value="$">$ - Budget</option>
                    <option value="$$">$$ - Mid-Range</option>
                    <option value="$$$">$$$ - High-End</option>
                    <option value="$$$$">$$$$ - Premium</option>
                  </select>
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Creating...' : 'Complete Setup'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BusinessOnboarding;