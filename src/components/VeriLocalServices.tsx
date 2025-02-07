import React from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  BarChart3, 
  Search,
  Users,
  Shield,
  BadgeCheck,
  MessageSquare,
  Mail,
  Rocket,
  Zap,
  Award,
  FileText,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import VeriLocalContact from './VeriLocalContact';

const VeriLocalServices = () => {
  const services = [
    {
      title: 'Enhanced Visibility',
      description: 'Get featured placement in search results and category listings to increase your business visibility.',
      icon: TrendingUp,
      features: [
        'Priority listing in search results',
        'Featured business badge',
        'Category spotlight placement',
        'Enhanced business profile'
      ]
    },
    {
      title: 'Marketing Tools',
      description: 'Powerful features to help you reach and engage with more customers.',
      icon: Megaphone,
      features: [
        'Featured in email marketing campaigns',
        'Social media integration',
        'Custom promotional deals'
      ]
    },
    {
      title: 'Direct Mail Postcards',
      description: 'Engage local audiences with professionally designed postcards that deliver real-world impact and measurable results.',
      icon: Mail,
      features: [
        'Custom design and messaging',
        'Geo-targeted distribution',
        'Performance tracking and analytics',
        'Cost-effective campaign management'
      ]
    },
    {
      title: 'SEO Optimization',
      description: 'Improve your online presence with our SEO optimization services.',
      icon: Search,
      features: [
        'Keyword optimization',
        'Local SEO enhancement',
        'Search ranking reports',
        'Content optimization tips'
      ]
    },
    {
      title: 'Customer Management',
      description: 'Tools to help you manage and grow your customer relationships.',
      icon: Users,
      features: [
        'Customer database',
        'Review management',
        'Customer feedback tools',
        'Loyalty program options'
      ]
    },
    {
      title: 'Verification Services',
      description: 'Build trust with customers through our verification program.',
      icon: Shield,
      features: [
        'Business verification badge',
        'Document verification',
        'Identity confirmation',
        'Trust score system'
      ]
    },
    {
      title: 'Lead Generation',
      description: 'Generate and manage quality leads for your business.',
      icon: Rocket,
      features: [
        'Lead capture forms',
        'Lead qualification tools',
        'Follow-up automation',
        'Lead analytics'
      ]
    },
    {
      title: 'Article Writing & Content Creation',
      description: 'Elevate your brand with well-researched, engaging articles and captivating copy.',
      icon: FileText,
      features: [
        'Topic research and planning',
        'SEO-friendly content',
        'Engaging storytelling',
        'Professional editing and proofreading'
      ]
    },
    {
      title: 'Google My Business Setup',
      description: 'Boost your local visibility on Google Maps and Search by creating and optimizing your Google My Business profile.',
      icon: MapPin,
      features: [
        'Profile creation and verification',
        'Accurate listing information (address, hours, and contact details)',
        'Photo and post optimization',
        'Review and rating strategy',
        'Insights and analytics tracking'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO 
        title="Business Services"
        description="Enhance your business with VeriLocal's professional services. Get verified, increase visibility, and grow your customer base with our comprehensive business solutions."
        type="website"
      />

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          VeriLocal Business Services
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Enhance your business presence and grow your customer base with our comprehensive suite of professional services.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {service.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Contact Form Section */}
      <div className="mt-20">
        <VeriLocalContact />
      </div>
    </div>
  );
};

export default VeriLocalServices;